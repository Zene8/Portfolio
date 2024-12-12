const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 8080;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for basic verification (e.g., API key check)
app.use((req, res, next) => {
    const apiKey = req.query.apiKey;
    if (apiKey === 'your_api_key') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
});

// Route to fetch GitHub projects
app.get('/api/projects', async (req, res) => {
    try {
        const response = await axios.get('https://api.github.com/users/your_github_username/repos');
        const projects = response.data.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url
        }));
        res.json(projects);
    } catch (error) {
        res.status(500).send('Error fetching projects from GitHub');
    }
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
