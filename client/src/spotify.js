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
    const { expiresIn, tokenTimestamp, access_token } = LOCALSTORAGE_VALUES;

    if (!access_token || !expiresIn || !tokenTimestamp) {
        return false;
    }

    const now = new Date().getTime();
    const expirationTime = tokenTimestamp + expiresIn * 1000;
    return now > expirationTime;
};

/**
 * Logout of Spotify by clearing local storage and returning user to home page
 */
export const logout = () => {
    // Clear localstorage
    for (const property in LOCALSTORAGE_KEYS) {
        localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }

    // navigate to home page
    window.location = window.location.origin;
};

/**
 * Refreshes the Spotify access token
 * @returns void
 */
const refreshToken = async() => {
    try {
        // If there is no refresh token (including undefined), or we are in an infinite refresh loop, redirect to login
        if (!LOCALSTORAGE_VALUES.refreshToken ||
            LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
            Date.now() - Number(LOCALSTORAGE_VALUES.tokenTimestamp) / 1000 < 1000
        ) {
            console.error('No refresh token found');
            logout();
        }

        // use the refresh token to access a new access token
        const { data } = await axios.get(
            `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
        );

        window.localStorage.setItem(
            LOCALSTORAGE_KEYS.accessToken,
            data.access_token
        );
        // don't need to set expires in because it is always the same (3600 ms)
        window.localStorage.setItem(LOCALSTORAGE_KEYS.tokenTimestamp, Date.now());

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
        [LOCALSTORAGE_KEYS.accessToken]: urlParams.get(
            LOCALSTORAGE_KEYS.accessToken
        ),
        [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get(
            LOCALSTORAGE_KEYS.refreshToken
        ),
        [LOCALSTORAGE_KEYS.expiresIn]: urlParams.get(LOCALSTORAGE_KEYS.expiresIn),
        [LOCALSTORAGE_KEYS.tokenTimestamp]: urlParams.get(
            LOCALSTORAGE_KEYS.tokenTimestamp
        ),
    };

    const hasError = urlParams.get('error');

    // If there is an error, or the access token is expired, or there is no access token, redirect to login
    if (hasError || isExpired() || !queryParams.accessToken) {
        console.log('theres an error');
        refreshToken();
    }

    // If there is a valid access token in local storage, use that
    if (
        LOCALSTORAGE_VALUES.accessToken &&
        LOCALSTORAGE_VALUES.accessToken !== 'undefined'
    ) {
        console.log(`there is a valid access token in local storage`);
        return LOCALSTORAGE_VALUES.accessToken;
    }

    // If there is a token in the query params, the user is logging in for the first time
    // set query params from the request into local storage and return the access_token
    if (queryParams.accessToken) {
        for (const property in queryParams) {
            localStorage.setItem(LOCALSTORAGE_KEYS[property], queryParams[property]);
        }
        console.log(`setting new access token`);
        return queryParams.accessToken;
    }

    console.log(`shouldn't have gotten here`);
    // shouldn't get here
    return false;
};

export const accessToken = getAccessToken();