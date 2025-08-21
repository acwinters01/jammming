import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App'


// Mocking the Authorization component
vi.mock('../util/Authorization', () => {

    // Make sure to grab the exports from the component
    const actual = vi.importActual('../util/Authorization');

    return {
        ...actual, // use the real exports
        default: ({ onLogin }) => <button onClick={onLogin}>Login with Spotify</button>,
        isTokenExpired: vi.fn(() => false), // replacing function with a fake
        refreshToken: vi.fn(() => Promise.resolve('new_token')), // replacing function with a fake that resolves to 'new token'
        __esModule: true // making sure vi understands defaut and named exports
    }
});

vi.mock('../Components/Loading/Loading', () => {
    return {
        default: ({ isLoading }) => (isLoading ? <div>Loading...</div> : null),
    }
});

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
        render(<App />);

        const loginButton = screen.getByText('Login with Spotify');
        expect(loginButton).toBeInTheDocument();

        await userEvent.click(loginButton);
        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument();

        });
    });

    
});