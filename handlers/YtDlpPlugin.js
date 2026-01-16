import { DisTubeError, PlayableExtractorPlugin, Playlist, Song } from "distube";
import dargs from "dargs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const isPlaylist = (i) => Array.isArray(i.entries);

export class YtDlpPlugin extends PlayableExtractorPlugin {
    constructor({ update = true, cookies, userAgent } = {}) {
        super();
        this.cookies = cookies;
        this.userAgent = userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    }

    validate() {
        return true;
    }

    async getBinaryPath() {
        // Try to find the binary from the installed @distube/yt-dlp package
        try {
            // 1. Try resolving via node_modules relative to CWD
            let potentialPath = path.resolve("node_modules/@distube/yt-dlp/bin/yt-dlp");
            if (process.platform === "win32") potentialPath += ".exe";
            if (fs.existsSync(potentialPath)) return potentialPath;

            // 2. Try looking in the package directory if we are in a monorepo or weird structure
            //    (Skipping complex resolution for now, fallback to "yt-dlp" in PATH)
        } catch (e) {
            // Ignore
        }
        return "yt-dlp"; // Fallback to system PATH
    }

    async json(url, flags, options) {
        const ytDlpPath = await this.getBinaryPath();

        // Ensure cookies path is absolute if provided
        if (this.cookies) {
            flags.cookies = path.resolve(this.cookies);
        }

        if (this.userAgent) {
            flags.userAgent = this.userAgent;
        }

        const args = [url, ...dargs(flags, { useEquals: false })].filter(Boolean);

        return new Promise((resolve, reject) => {
            const process = spawn(ytDlpPath, args, options);
            let output = "";
            let errorOutput = "";

            process.stdout.on("data", (chunk) => { output += chunk; });
            process.stderr.on("data", (chunk) => { errorOutput += chunk; });

            process.on("close", (code) => {
                if (code === 0) {
                    try {
                        resolve(JSON.parse(output));
                    } catch (e) {
                        // Sometimes yt-dlp outputs warnings before JSON, try to find the JSON blob
                        // But dump-single-json usually handles this.
                        reject(new Error(`Invalid JSON output: ${output}`));
                    }
                } else {
                    reject(new Error(errorOutput || output));
                }
            });
            process.on("error", reject);
        });
    }

    async resolve(url, options) {
        const info = await this.json(url, {
            dumpSingleJson: true,
            noWarnings: true,
            // noCallHome: true, // REMOVED: Deprecated
            preferFreeFormats: true,
            skipDownload: true,
            simulate: true,
            defaultSearch: 'auto',
            flatPlaylist: true // Optimization for playlists
        }).catch((e) => {
            throw new DisTubeError("YTDLP_ERROR", `${e.stderr || e}`);
        });

        if (isPlaylist(info)) {
            if (info.entries.length === 0) throw new DisTubeError("YTDLP_ERROR", "The playlist is empty");
            return new Playlist(
                {
                    source: info.extractor,
                    songs: info.entries.map((i) => new YtDlpSong(this, i, options)),
                    id: info.id.toString(),
                    name: info.title,
                    url: info.webpage_url,
                    thumbnail: info.thumbnails?.[0]?.url
                },
                options
            );
        }
        return new YtDlpSong(this, info, options);
    }

    async getStreamURL(song) {
        if (!song.url) {
            throw new DisTubeError("YTDLP_PLUGIN_INVALID_SONG", "Cannot get stream url from invalid song.");
        }
        const info = await this.json(song.url, {
            dumpSingleJson: true,
            noWarnings: true,
            // noCallHome: true, // REMOVED
            skipDownload: true,
            simulate: true,
            format: "bestaudio/best" // Simplified format selection
        }).catch((e) => {
            throw new DisTubeError("YTDLP_ERROR", `${e.stderr || e}`);
        });

        if (isPlaylist(info)) throw new DisTubeError("YTDLP_ERROR", "Cannot get stream URL of a entire playlist");
        return info.url;
    }

    getRelatedSongs() { return []; }
}

class YtDlpSong extends Song {
    constructor(plugin, info, options = {}) {
        super(
            {
                plugin,
                source: info.extractor,
                playFromSource: true,
                id: info.id,
                name: info.title || info.fulltitle,
                url: info.webpage_url || info.original_url,
                isLive: info.is_live,
                thumbnail: info.thumbnail || info.thumbnails?.[0]?.url,
                duration: info.is_live ? 0 : info.duration,
                uploader: {
                    name: info.uploader,
                    url: info.uploader_url
                },
                views: info.view_count,
                likes: info.like_count,
                dislikes: info.dislike_count,
                reposts: info.repost_count,
                ageRestricted: Boolean(info.age_limit) && info.age_limit >= 18
            },
            options
        );
    }
}
