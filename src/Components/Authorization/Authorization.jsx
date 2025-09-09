import React, { useState, useEffect } from 'react';
import { isTokenExpired, refreshToken, initiateAuthorization, getToken, scheduleTokenRefresh } from '../../util/spotify_authorization';
import Loading from '../Loading/Loading';

function Authorization({ onLogin, onLogout }) {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access_token') || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const existingToken = localStorage.getItem('access_token');
        const tokenExpired = isTokenExpired();

        console.log('🚀 useEffect triggered');
        console.log('🔑 code:', code);
        console.log('💾 existingToken:', existingToken);
        console.log('⌛ expired:', tokenExpired);


        const handleToken = async (token) => {
            setAccessToken(token);
            setLoading(false);
            onLogin(token);
            const expiresAt = parseInt(localStorage.getItem('expires_in'), 10);
            if (!isNaN(expiresAt)) {
                const secondsUntilExpiry = (expiresAt - Date.now()) / 1000;
                scheduleTokenRefresh(secondsUntilExpiry);
            }
            window.history.replaceState({}, document.title, '/');
        };

        if (code && !existingToken) {
            console.log("getting token with code")

            getToken(code).then(token => {
                console.log("getting token:", token)

                if (token) {
                    handleToken(token);
                } else {
                    setLoading(false);
                }
            });
        } else if (existingToken && !tokenExpired) {
            console.log("reusing existing token")
            handleToken(existingToken);
        } else if (existingToken && tokenExpired) {
            console.log("refreshing token...")

            refreshToken().then(newToken => {
                console.log("refreshed token response: ", newToken)

                if (newToken) {
                    handleToken(newToken);
                } else {
                    setLoading(false);
                }
            });
        } else {
            console.log("no token found ")

            setLoading(false);
        }
    }, []);


    if (loading) return <Loading />;
    const isLoggedIn = !!(accessToken && accessToken.trim() !== '');
    console.log(isLoggedIn)

    return (
        <div className='displayAuthorization'>
            {isLoggedIn ? (
                <div className='loggedIn'>
                    <h2>You are logged in!</h2>
                    <button onClick={onLogout}>Log Out</button>
                </div>
            ) : (
            <div className='needAuthorization'>
                <h1>Spotify Authorization</h1>
                <button onClick={initiateAuthorization}>Log in with Spotify</button>
            </div>
            )}
        </div>
);
}

export default Authorization;