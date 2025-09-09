import React, { Suspense } from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App'


// Mocking the Authorization component
vi.mock('../util/Authorization', () => {

    // Make sure to grab the exports from the component
    const actual = vi.importActual('../components/Authorization');

    return {
        ...actual, // use the real exports
        default: ({ onLogin }) => <button onClick={onLogin}>Login with Spotify</button>,
        isTokenExpired: vi.fn(() => false), 
        refreshToken: vi.fn(() => Promise.resolve('new_token')), // replacing function with a fake that resolves to 'new token'
        __esModule: true // making sure vi understands default and named exports
    }
});

vi.mock('../Components/Loading/Loading', () => ({
    default: ({ isLoading }) => (isLoading ? <div>Loading...</div> : null),
}));

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
    });
    
    it('shows the loading screen after clicking login', async() => {
        await act(async () => {
            render(
                <Suspense fallback={<div>Loading...</div>}>
                    <App/>
                </Suspense>
            );
        });
        const loginButton = screen.getByText('Loading...');
        expect(loginButton).toBeInTheDocument();

        await act(async () => {
            await userEvent.click(loginButton);
        });
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    });
});