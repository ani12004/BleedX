const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '.')));

app.get('/commands', (req, res) => {
    res.sendFile(path.join(__dirname, 'commands.html'));
});

app.get('/premium', (req, res) => {
    res.sendFile(path.join(__dirname, 'premium.html'));
});

app.get('/support', (req, res) => {
    res.sendFile(path.join(__dirname, 'support.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms.html'));
});

app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs.html'));
});

// Fallback to index.html for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
