import axios from 'axios';

const LOCALSTORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expiresIn: 'spotify_expires_in',
    tokenTimestamp: 'spotify_token_timestamp',
};

// Map to retrieve localstorage values
const LOCALSTORAGE_VALUES = {
    accessToken: localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expiresIn: localStorage.getItem(LOCALSTORAGE_KEYS.expiresIn),
    tokenTimestamp: localStorage.getItem(LOCALSTORAGE_KEYS.tokenTimestamp),
};

/**
 * Checks if the access token is expired
 */
const isExpired = () => {
    const { accessToken, expiresIn, tokenTimeStamp } = LOCALSTORAGE_VALUES;
    if (!accessToken || !tokenTimeStamp) {
        return false;
    }
    const millisecondsElapsed = Date.now() - Number(tokenTimeStamp);
    return millisecondsElapsed / 1000 > Number(expiresIn);
};

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
    // Clear all localStorage items
    for (const property in LOCALSTORAGE_KEYS) {
        window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }
    // Navigate to homepage
    window.location = window.location.origin;
};

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async() => {
    try {
        // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
        if (!LOCALSTORAGE_VALUES.refreshToken ||
            LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
            Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
        ) {
            console.error('No refresh token available');
            logout();
        }

        // Use `/refresh_token` endpoint from our Node app
        const { data } = await axios.get(
            `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
        );

        // Update localStorage values
        window.localStorage.setItem(
            LOCALSTORAGE_KEYS.accessToken,
            data.access_token
        );
        window.localStorage.setItem(LOCALSTORAGE_KEYS.tokenTimestamp, Date.now());

        // Reload the page for localStorage updates to be reflected
        window.location.reload();
    } catch (e) {
        console.error(e);
    }
};

/**
 * Handles logic for retrieving the Spotify access token from localStorage or from URL query params
 * @returns {string} Spotify access token
 */
const getAccessToken = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {
        [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
        [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
        [LOCALSTORAGE_KEYS.expiresIn]: urlParams.get('expires_in'),
    };

    const hasError = urlParams.get('error');

    if (
        hasError ||
        isExpired() ||
        LOCALSTORAGE_VALUES.accessToken === 'undefined'
    ) {
        console.log('calling refresh token');
        refreshToken();
    }

    // If there is a valid access token in localStorage, use that
    if (
        LOCALSTORAGE_VALUES.accessToken &&
        LOCALSTORAGE_VALUES.accessToken !== 'undefined'
    ) {
        return LOCALSTORAGE_VALUES.accessToken;
    }

    // If there is a token in the URL query params, user is logging in for the first time
    if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
        // Store the query params in localStorage
        for (const property in queryParams) {
            window.localStorage.setItem(property, queryParams[property]);
        }
        // Set timestamp
        window.localStorage.setItem(LOCALSTORAGE_KEYS.tokenTimestamp, Date.now());
        // Return access token from query params
        return queryParams[LOCALSTORAGE_KEYS.accessToken];
    }

    // We should never get here!
    return false;
};

export const accessToken = getAccessToken();

/**
 * Axios global request headers
 * https://github.com/axios/axios#global-axios-defaults
 */
axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';

/**
 * Get current user's profile
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 * @returns {Promise}
 */
export const getUserProfile = () => axios.get('/me');

/**
 * Get current users's playlists
 * @returns {Promise}
 */
export const getCurrentUserPlaylists = (limit = 20) => {
    return axios.get(`/me/playlists?limit=${limit}`);
};

/**
 * Get a user's top artists and tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 * @param {string} time_range - long_term (several years of data), medium_term (last 6 months), short_term (last 4 weeks)
 * @returns {Promise}
 */
export const getTopArtists = (time_range = 'short_term') => {
    return axios.get(`/me/top/artists?time_range=${time_range}`);
};

export const getTopTracks = (time_range = 'short_term') => {
    return axios.get(`/me/top/tracks?time_range=${time_range}`);
};