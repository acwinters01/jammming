import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Playlist from '../Components/Playlist/Playlist';
import { makeSpotifyRequest } from '../Components/Authorization/Requests';

const mockPlaylists = [
    { 
        playlistId: 'a1b2c3',
        playlistName: 'Test Playlist',
        tracks: [
            { 
                id: "1",
                name: "Track 1",
                imageUri: '/track1.jpg',
                uri: 'spotify:track:1'
            },
            { 
                id: "2",
                name: "Track 2",
                imageUri: '/track2.jpg',
                uri: 'spotify:track:2'
            },
            
        ],
    },

];
jest.mock('../Components/Authorization/Requests', () => ({
    makeSpotifyRequest: jest.fn()
}));

const defaultProps = {
    existingPlaylist: mockPlaylists,
    playlistName:"New Playlists",
    playlistTracks:[],
    onNameChange:jest.fn(),
    setExistingPlaylist:jest.fn(),
    onEdit:jest.fn(),
    onSave:jest.fn(),
    onRemove:jest.fn(),
    onAdd:jest.fn(),
    searchResults:[],
    setSearchLoading:jest.fn(),
    setTransferLoading:jest.fn(),
    transferLoading:jest.fn(),
    onEditOpen:jest.fn(),
    onEditClose:jest.fn(),
    setShowModal:jest.fn(),
    dashboardOpen:false
}

describe('Playlist Component', () => {
    it('renders input and save button', () => {

        render(<Playlist {...defaultProps} />);
        expect(screen.getAllByPlaceholderText('New Playlist').length).toBeGreaterThan(0);
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('calls onSave when Save button is clicked', () => {
        render (<Playlist {...defaultProps} />);
        fireEvent.click(screen.getByText('Save'));
        expect(defaultProps.onSave).toHaveBeenCalled();
    });

    it('it shows existing playlist with correct name', () => {
        render (<Playlist {...defaultProps} />); 
        expect(screen.getByText('Test Playlist')).toBeInTheDocument();
    });

    it('calls setShowModal when dashboard is open and edit is clicked', () => {
        render(<Playlist {...defaultProps} dashboardOpen={true} />);
        fireEvent.click(screen.getByTestId('a1b2c3-EditPlaylist'));
        expect(defaultProps.setShowModal).toHaveBeenCalled();
    });

    it('class makeSpotify Request when transferring a playlist to Spotify', async () => {
        makeSpotifyRequest.mockResolvedValueOnce({ id: 'mock-playlist-id' }); // creates id for created playlist
        makeSpotifyRequest.mockResolvedValueOnce({}); // add tracks here

        render(<Playlist {...defaultProps} />);

        const transferButton = screen.getByTestId('a1b2c3-Transfer'); 
        fireEvent.click(transferButton);

        await waitFor(() => {
            expect(makeSpotifyRequest).toHaveBeenCalledWith(
            expect.stringContaining('me/playlists'),
            'POST',
            expect.objectContaining({ name: expect.any(String) })
            );
        });
    });

})