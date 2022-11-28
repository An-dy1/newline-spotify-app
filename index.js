require('dotenv').config();
const express = require('express');
const URLSearchParams = require('url').URLSearchParams;
const querystring = require('query-string');
const axios = require('axios');
const request = require('request');

const app = express();
const port = 8888;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const stateKey = 'spotify_auth_state';

app.get('/login', (_req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = ['user-read-private', 'user-read-email', 'user-top-read'].join(
        ' '
    );

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope,
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params}`;
    // when a user clicks on the login button, we want to redirect them to the spotify login page
    res.redirect(authUrl);
});

// app.get('/callback', function(req, res) {
//             // your application requests refresh and access tokens
//             // after checking the state parameter

//             const code = req.query.code || null;
//             const state = req.query.state || null;
//             const storedState = req.cookies ? req.cookies[stateKey] : null;

//             if (state === null) {
//                 res.redirect('/#' +
//                     querystring.stringify({
//                         error: 'state_mismatch'
//                     }));
//             } else {
//                 res.clearCookie(stateKey);
//                 const authOptions = {
//                         url: 'https://accounts.spotify.com/api/token',
//                         form: {
//                             code: code,
//                             redirect_uri: REDIRECT_URI,
//                             grant_type: 'authorization_code',
//                         },
//                         headers: {
//                             Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
//                     },
//                     json: true,
//                     };

//                 request.post(authOptions, function (error, response, body) {
//                     if (!error && response.statusCode === 200) {
//                     const access_token = body.access_token;
//                     const refresh_token = body.refresh_token;

//                     var options = {
//                         url: 'https://api.spotify.com/v1/me',
//                         headers: { Authorization: 'Bearer ' + access_token },
//                         json: true,
//                     };

//                     // use the access token to access the Spotify Web API
//                     request.get(options, function(error, response, body) {
//                         console.log(body);
//                     });
//                     // we can also pass the token to the browser to make requests from there
//                     res.redirect('/#' + querystring.stringify({
//                         access_token: access_token,
//                         refresh_token: refresh_token,
//                     }));
//                     } else {
//                     res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`);
//                     }
//                 });
//     }
//   });

app.get('/callback', (req, res) => {
            const code = req.query.code || null;

            const usp = new URLSearchParams({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
            });

            axios({
                        method: 'post',
                        url: 'https://accounts.spotify.com/api/token',
                        data: usp,
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'accept-encoding': 'application/json',
                            Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString('base64')}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data;

        const params = querystring.stringify({
          access_token,
          refresh_token,
          expires_in,
        });

        // redirect to react app with tokens in query params
        res.redirect(`http://localhost:3000/?${params}`);
      } else {
        res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

// access_token=BQAN-OlB5bCQ7KV2eT4R2ybqK0IoP1YRgGb02-1lVfWgYQHeLcTWcmUn0Jj-9uzDrdolWiOgZvcIJymTHwE6aYYvdvLZi2W3sHy64jqnNxCmzU3F-ceR6QzPoQwgdHBB6IDimD_cbYmeFf3ZVtn8nsQeTQ_ofVnSpD9XyL3cOcHJGvl7-JibMvCTAJKDweoyXn19pQxTpiQyg5HikP70Xw&expires_in=3600&refresh_token=AQBBM3mwUOBKG9_QnXrDDnuO0Hw9YtQ5GCetuEu-nuhPy1_bcykk_dIfhHrTx1wqWkXOW0PMH9-hBNSu6_r-7c2U-RDJYr7EsVL2E75aNOhT4SjpE94FX-RU1PA4YwA_8ig

app.get('/refresh_token', function (req, res) {
  const { refresh_token } = req.query;

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
  });

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: params,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'accept-encoding': 'application/json',
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString('base64')}`,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});