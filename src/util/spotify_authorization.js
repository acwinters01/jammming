// Request User Authorization
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private';

// Generate random string for code verifier
export const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Transform code verifier using SHA 256 algorithm. This value will be sent within user authorization request.
export const sha256 = async (plain) => {
    const encode = new TextEncoder()
    const data = encode.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

// Returns base64 representation of the digest from sha256
export const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export const clearSpotifyTokens = () => {
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
}

export const scheduleTokenRefresh = (secondsUntilExpiry) => {

    const safeTimeout = Math.max(60, secondsUntilExpiry - 60);
    setTimeout(() => {
        refreshToken().then(newToken => {
        if (newToken) {
            localStorage.setItem('access_token', newToken);
        }
        });
    }, safeTimeout * 1000); // refresh 1 min before expiry
};


// Initate Spotify Authorization 
export async function initiateAuthorization(){

    clearSpotifyTokens();

    const codeVerifier = generateRandomString(64);
    localStorage.setItem('code_verifier', codeVerifier);
    

    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    console.log("Client ID:", clientId);

    const authURL = new URL('https://accounts.spotify.com/authorize');

    console.log("Redirect URI being used:", redirectUri);
    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };
    
    authURL.search = new URLSearchParams(params).toString();
    window.location.href = authURL.toString();
}

// Request an Access Token with a function
export async function getToken (code) {
    const url = 'https://accounts.spotify.com/api/token';
    const codeVerifier = localStorage.getItem('code_verifier');

    console.log("Retrieved verifier:", codeVerifier);
    if (!codeVerifier) {
        console.error("Missing code_verifier");
        return null;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier
            })
        });

        const data = await response.json();

        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);

            if (data.refresh_token) {
                localStorage.setItem('refresh_token', data.refresh_token);
            }

            if (data.expires_in) {
                localStorage.setItem('expires_in', (Date.now() + data.expires_in * 1000).toString());            
            }

            return data.access_token;
        } else {
            console.error('Failed to get token:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
}

// Refresh the access token when it has expired
export async function refreshToken () {
    const refresh_token = localStorage.getItem('refresh_token');
    const url = 'https://accounts.spotify.com/api/token';
    
    if (!refresh_token) {
        console.warn("No refresh_token available, re-authorizing...");
        initiateAuthorization();  // Redirect user to login
        return null;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'refresh_token',
                refresh_token
            })
        });

        const data = await response.json();

    // Spotify might say "invalid_grant" here → token revoked / reused / reauth needed
    if (!response.ok) {
        if (data.error === 'invalid_grant') {
            console.warn('Refresh token revoked. Clearing and re-authorizing...');
            clearSpotifyTokens();
            initiateAuthorization();
            return null;
        }

        console.error('Failed to refresh token:', data);
        return null;
    }

    // success
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
    }

    // sometimes Spotify returns a NEW refresh token - save it
    if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
    }

    if (data.expires_in) {
        localStorage.setItem('expires_in', (Date.now() + data.expires_in * 1000).toString());
    }

    return data.access_token;
  } catch (err) {
        console.error('Error refreshing token:', err);
        return null;
  }
}

// Check if the current access token is expired
export function isTokenExpired() {
    const expiresAt = parseInt(localStorage.getItem('expires_in'), 10);
    return isNaN(expiresAt) || Date.now() > expiresAt;
}