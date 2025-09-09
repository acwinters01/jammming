# Jammming

Jamming is a React-based web application that allows users to search for tracks using the Spotify API, create custom playlists, and save them directly to their Spotify account. Built with modern front-end technologies, this project demonstrates working with APIs, state management, pagination, and user authentication. 

<br>

- **FrontEnd** - `https://github.com/acwinters01/jammming`
- **BackEnd** - `https://github.com/acwinters01/jammming-backend`

<br>

## Features: 
- **Spotify Track Search** - Search for songs using the Spotify API
- **Add/Remove Tracks** - Add tracks to a playlist with duplicate support
- **Edit Playlist Name** - Rename Playlists on the fly
- **Save to Spotify** - Authenticate and save custom playlists to your Spotify account
- **Responsive UI** - Optimized for both desktop and mobile
- **Pagination** - Browse through search results and playlists efficently. 
- **Dynamic UI** - Uses conditional rendering for a clean experience

<br>

## Tech Stack:
- **React 18 + Vite**
- **JavaScript**
- **Spotify Web API** (accessed via backend)
- **Vitest + React Testing Library**
- **ESLint**
- **Render** (for backend deployment)

<br>

## Getting Started


### 1. Environment Variables
Create a `.env` in the project root (Vite requires VITE_prefix):
<br>

```bash
VITE_API_BASE_URL=http://localhost:4000      # your backend base URL
VITE_SPOTIFY_CLIENT_ID=your_client_id        # if frontend needs it for display or flows
VITE_REDIRECT_URI=http://localhost:5173      # (development) used if backend redirects back to frontend after OAuth

```
<br>

### 2. Run Backend
Follow the backend README.

```bash
git clone https://github.com/acwinters01/jammming-backend.git
cd jammming-backend
npm install
npm run dev # or npm start 
# Backend will likely be on http://localhost:4000/
```
<br>
<br>

### 3. Run the Frontend
```bash
git clone https://github.com/acwinters01/jammming.git
cd jammming

npm install
npm run dev # or npm start 

# Frontend runs on http://localhost:3000/
```

If you decide to use a different origin (e.g. :5005), enable CORS support in the backend to allow requests from the frontend. 
  
<br>

**Option A:**  Enabling CORS on the Backend 

In the backend: 

```Javascript
import cors from 'cors';
app.use( cors({ origin: "http://localhost:5173", credentials: true })); // development
```


<br>

**Option B:** Vite Dev proxy

Instead of enabling CORS, you can also configure a proxy in Vite:

In the vite.config.js (frontend):

```Javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true,
            }
        }
    }
})
```

You can then call the API with relative paths (e.g. /api/search.)
Please do **not** rely on the proxy in production!
<br>
<br>


## API Contract (example)
The Frontend expects the backend to provide:

### Search
- GET /api/search?q={term}
<br>

- Response:

    ```json
    {
        "tracks": [
            { "id": '123', "name": 'Song', "artist": 'Artist', "album": 'Album', "uri": 'spotify:track:123',
            }
        ]
    }
    ```
<br>
<br>

### Save Playlist
- POST /api/playlists

- Body:

    ```json
    { "name": 'My Playlist', "tracks": ['spotify:track:123', 'spotify:track:456'] }
    ```
    <br>

- Response:

    ```json
    { "playlistId": "abc123", "url": "https://open.spotify.com/playlist/abc123" }
    ```

    Make sure it matches your backend to keep the front end fetch code in sync

<br>

## Project Structure
```bash
src/
├── __tests__/
│ 
├── components/
│   ├── Dashboard/
│   ├── Loading/
│   ├── Playlist/
│   ├── SearchBar/
│   ├── SearchResults/
│   ├── Track/
│   └── TrackList/
│  
├── util/
│   └── api.js    # fetch wrappers that use REACT_APP_API_BASE_URL
├── App.js
├── index.js
└── styles/
```

<br>

## Testing
```bash
npm test
```
<br>

- Unit tests for modal pop-ups, add/remove, input changes, and "save playlist" flow
- Used @testing-library/react queries (getByRole, getByText, getByTestId)

<br>


## Development


### Frontend
- Netlify / Vercel / GitHub Pages
    - Build: npm run build
    - Serve the build/ directory
    - Set environment variables in your hosting provider

### Backend
- Deploy separately (Render, Railway, Heroku alternative, ete)
- Update VITE_API_URL in the frontend environment to the deployed backend URL

<br>

## Troubleshooting
- Input value not updating in tests
    - Ensure the input is controlled: 


    ```JSX
    <input value={playlistName} onChange{(e) => setPlaylistName(e.target)} />
    ```

    <br>
    - In tests, prefer userEvent.type() or await waitFor(...) after fireEvent.change(..)
    <br>
    <br>

- CORS errors
    - In development, make sure the backend allows requests from you Vite **DEV** server

    <br>

- 401/403 from Spotify
    - Ensure backend OAuth is configured ( client id, redirect URI ), and tokens are being stored / forwarded correctly

<br>

## Contributing
1. For the repo
2. Create a feature branch: git checkout -b feat/awesomeness
3. Commit changes: git commit -m "Add awesome"
4. Push: git push origin feat/awesomeness
5. Open a PR