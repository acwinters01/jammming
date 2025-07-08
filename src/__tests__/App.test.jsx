import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../Components/App/App'


// Mocking the Authorization component
jest.mock('../Components/Authorization/Authorization', () => {

    // Make sure to grab the exports from the component
    const actual = jest.requireActual('../Components/Authorization/Authorization');

    return {
        ...actual, // use the real exports
        default: ({ onLogin }) => <button onClick={onLogin}>Login with Spotify</button>,
        isTokenExpired: jest.fn(() => false), // replacing function with a fake
        refreshToken: jest.fn(() => Promise.resolve('new_token')), // replacing function with a fake that resolves to 'new token'
        __esModule: true // making sure jest understands defaut and named exports
    }
});

jest.mock('../Components/Authorization/Loading', () => ({ isLoading }) =>
  isLoading ? <div>Loading...</div> : null
);

describe('App Component', () => {
    beforeEach(() => {
        // Mock tokens
        localStorage.setItem('access_token', 'mock_token');
        localStorage.setItem('refresh_token', 'mock_refresh');
        localStorage.setItem('expires_in', '3600');
    });

    afterEach(()=> {
        // Deletes mock tokens after every test
        localStorage.clear()
    })
    it('shows the loading screen after clicking login', async() => {
        render(<App />);

        const loginButton = screen.getByText('Login with Spotify');
        expect(loginButton).toBeInTheDocument();

        await userEvent.click(loginButton);
        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument();

        })
    }) 
});