require('dotenv').config();
const express = require('express')
const URLSearchParams = require('url').URLSearchParams;

const app = express();
const port = 8888;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


app.get('/', (_req, res) => {
    res.send('Hello World!')
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const stateKey = 'spotify_auth_state';

app.get('/login', (_req, res) => {

    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email';

    const params = new URLSearchParams({
        'response_type': 'code',
        'client_id': CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        state: state,
        scope: scope
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params}`;

    // when a user clicks on the login button, we want to redirect them to the spotify login page
    res.redirect(authUrl)

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});