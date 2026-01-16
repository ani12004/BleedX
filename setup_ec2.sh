#!/bin/bash

# setup_ec2.sh
# Automated setup script for Imperium Bot on AWS EC2 (Ubuntu/Debian)

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Imperium Bot EC2 Setup Script ===${NC}"
echo -e "${YELLOW}Note: This script assumes a fresh Ubuntu/Debian instance.${NC}"
echo "---------------------------------------------------"

# 1. Update System
echo -e "\n${GREEN}[1/7] Updating system packages...${NC}"
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Dependencies
echo -e "\n${GREEN}[2/7] Installing system dependencies (Build tools, Canvas, FFmpeg)...${NC}"
# build-essential & python3 for node-gyp
# libcairo2-dev, libpango1.0-dev, etc. for node-canvas
# ffmpeg for music functionality
sudo apt-get install -y \
    build-essential \
    git \
    curl \
    wget \
    unzip \
    python3 \
    make \
    gcc \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    ffmpeg

# 3. Install Node.js v22
echo -e "\n${GREEN}[3/7] Installing Node.js v22...${NC}"
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node version
NODE_VERSION=$(node -v)
echo -e "Installed Node.js version: ${YELLOW}$NODE_VERSION${NC}"

# 4. Clone Repository
echo -e "\n${GREEN}[4/7] Setting up repository...${NC}"
read -p "Enter your Git Repository URL (leave empty if you want to use the current directory/manual upload): " GIT_REPO

if [ ! -z "$GIT_REPO" ]; then
    echo "Cloning from $GIT_REPO..."
    git clone "$GIT_REPO" imperium-bot
    cd imperium-bot || { echo -e "${RED}Failed to enter directory.${NC}"; exit 1; }
else
    echo -e "${YELLOW}Skipping clone. Assuming you are in the project directory or will upload files later.${NC}"
    # If we are not in a project dir, warn user
    if [ ! -f "package.json" ]; then
        echo -e "${RED}Warning: package.json not found in current directory. Please make sure you are in the bot directory.${NC}"
    fi
fi

# 5. Configuration (.env)
echo -e "\n${GREEN}[5/7] Configuring Environment Variables...${NC}"
if [ -f ".env" ]; then
    read -p ".env file already exists. Overwrite? (y/n): " OVERWRITE_ENV
    if [ "$OVERWRITE_ENV" != "y" ]; then
        echo "Skipping .env creation."
    else
        rm .env
    fi
fi

if [ ! -f ".env" ]; then
    echo "Please enter the following values:"
    
    read -p "Discord Bot Token (DISCORD_TOKEN): " TOKEN
    read -p "Client ID (CLIENT_ID): " CLIENT_ID
    read -p "Subabase URL (SUPABASE_URL): " SUPABASE_URL
    read -p "Supabase Key (SUPABASE_KEY): " SUPABASE_KEY
    read -p "Owner ID (OWNER_ID): " OWNER_ID
    read -p "Spotify Client ID (SPOTIFY_CLIENT_ID) [Optional]: " SPOTIFY_ID
    read -p "Spotify Client Secret (SPOTIFY_CLIENT_SECRET) [Optional]: " SPOTIFY_SECRET
    
    echo "Creating .env file..."
    cat > .env <<EOL
DISCORD_TOKEN=$TOKEN
CLIENT_ID=$CLIENT_ID
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY
OWNER_ID=$OWNER_ID
SPOTIFY_CLIENT_ID=$SPOTIFY_ID
SPOTIFY_CLIENT_SECRET=$SPOTIFY_SECRET
PORT=3000
EOL
    echo -e "${GREEN}.env file created!${NC}"
fi

# 6. Install NPM Dependencies
echo -e "\n${GREEN}[6/7] Installing NPM dependencies...${NC}"
npm install

# 7. Process Management with PM2
echo -e "\n${GREEN}[7/7] Setting up PM2 Process Manager...${NC}"
sudo npm install -g pm2

echo "Starting bot with PM2..."
pm2 start index.js --name imperium

echo "Saving PM2 list..."
pm2 save

echo "Setting up PM2 startup hook..."
# This command generates the startup script but requires sudo execution manually often, 
# but we can try to run the output of 'pm2 startup'
STARTUP_CMD=$(pm2 startup | grep "sudo env")
if [ ! -z "$STARTUP_CMD" ]; then
    echo "Executing startup script: $STARTUP_CMD"
    eval "$STARTUP_CMD"
else
    echo -e "${YELLOW}Could not auto-detect startup command. Please run 'pm2 startup' manually.${NC}"
fi

echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo -e "Your bot should now be running. Check status with: ${YELLOW}pm2 status${NC}"
echo -e "View logs with: ${YELLOW}pm2 logs imperium${NC}"

