import React, {useCallback} from 'react';
import { vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Playlist from '../components/PlaylistHandling/Playlist';
import SearchResults from '../components/SearchResults/SearchResults';
import { makeSpotifyRequest } from '../util/api';

vi.mock('../util/api', () => ({
    makeSpotifyRequest: vi.fn()
}));

const mockPlaylists = [
    { 
        playlistId: 'a1b2c3',
        playlistName: 'Test Playlist',
        tracks: [
            { 
                uniqueKey: 'playlist-11',
                id: '1',
                name: 'PlaylistTrack-1',
                album: 'Test Album',
                artist: 'Test Artist',
                image: '/test.jpg',
                uri: '/testURI.jpg', 
                onAdd: vi.fn(),
                onRemove: vi.fn(),
                isSelected: false,
                keyPrefix: 'playlist'
            },
            {
                uniqueKey: 'playlist-22',
                id: '2',
                name: 'PlaylistTrack-2',
                album: 'Test Album-2',
                artist: 'Test Artist-2',
                imageUri: '/test2.jpg',
                uri: '/testURI2.jpg', 
                onAdd: vi.fn(),
                onRemove: vi.fn(),
                isSelected: false,
                keyPrefix: 'playlist'

            },
            
        ],
    },
     { 
        playlistId: 'd4e5f6',
        playlistName: 'Test Playlist-2',
        tracks: [
            { 
                uniqueKey: 'playlist-33',
                id: '3',
                name: 'PlaylistTrack-3',
                album: 'Test Album-3',
                artist: 'Test Artist-3',
                image: '/test3.jpg',
                uri: '/testURI3.jpg', 
                onAdd: vi.fn(),
                onRemove: vi.fn(),
                isSelected: false,
                keyPrefix: 'playlist'
            },
            {
                uniqueKey: 'playlist-44',
                id: '4',
                name: 'PlaylistTrack-4',
                album: 'Test Album-4',
                artist: 'Test Artist-4',
                imageUri: '/test4.jpg',
                uri: '/testURI4.jpg', 
                onAdd: vi.fn(),
                onRemove: vi.fn(),
                isSelected: false,
                keyPrefix: 'playlist'

            },
            
        ],
    },

];

const searchTracks = [
        {
            uniqueKey: 'search-22',
            id: '2',
            name: 'SearchTrack-2',
            album: 'Test Album-2',
            artist: 'Test Artist-2',
            image: '/test2.jpg',
            uri: '/testURI2.jpg', 
            onAdd: vi.fn(),
            onRemove: vi.fn(),
            isSelected: true,
            keyPrefix: 'search'

        }, 
        {
            uniqueKey: 'search-33',
            id: '3',
            name: 'SearchTrack-3',
            album: 'Test Album-3',
            artist: 'Test Artist-3',
            imageUri: '/test3.jpg',
            uri: '/testURI3.jpg', 
            onAdd: vi.fn(),
            onRemove: vi.fn(),
            isSelected: false,
            keyPrefix: 'search'

        },
        {
            uniqueKey: 'search-44',
            id: '4',
            name: 'SearchTrack-4',
            album: 'Test Album-4',
            artist: 'Test Artist-4',
            imageUri: '/test4.jpg',
            uri: '/testURI4.jpg', 
            onAdd: vi.fn(),
            onRemove: vi.fn(),
            isSelected: false,
            keyPrefix: 'search'

        }
];

const defaultProps = {
    existingPlaylist: mockPlaylists,
    playlistName:"",
    playlistTracks:[],
    onNameChange:vi.fn(),
    setExistingPlaylist:vi.fn(),
    onEdit:vi.fn(),
    onSave:vi.fn(),
    onRemove:vi.fn(),
    onAdd:vi.fn(),
    searchResults:[],
    setSearchLoading:vi.fn(),
    setTransferLoading:vi.fn(),
    transferLoading:vi.fn(),
    onEditOpen:vi.fn(),
    onEditClose:vi.fn(),
    setShowModal:vi.fn(),
    dashboardOpen:false
}

function HandleTrackWrapper() {
    const [newPlaylistTracks, setNewPlaylistTracks] = React.useState([]);
    const [playlistName, setPlaylistName] = React.useState('');
    const [existingPlaylist, setExistingPlaylist] = React.useState([...mockPlaylists]);


    const addingTrack = (track) => {
        setNewPlaylistTracks((prevTracks) => [...prevTracks, track])
    };

    const removingTrack = track => {
        setNewPlaylistTracks((prev) => (
            prev.filter((t) => t.uniqueKey !== track.uniqueKey)
        ));
    }

    const handleSave = useCallback(() => {
       // Creating a playlistId for local playlist
        const generateLocalId = () => `local-${Date.now()}-${Math.floor(Math.random() * 5)}`;

        const newPlaylist = {
            key: generateLocalId(),
            playlistId: generateLocalId(),
            playlistName: playlistName,
            tracks: newPlaylistTracks
        };


        setExistingPlaylist((prevPlaylists) => {
        // Ensure prevPlaylists is an array and newPlaylist has tracks
            const validPrevPlaylists = Array.isArray(prevPlaylists) ? prevPlaylists : [];
            if (newPlaylist.tracks && newPlaylist.tracks.length > 0) {
                return [...validPrevPlaylists, newPlaylist];
            } else {
                console.log("No tracks available in customPlaylist, skipping update.");
                return validPrevPlaylists; // Return the previous state without changes if no tracks
            }
        });    
        
        setPlaylistName('');
        setNewPlaylistTracks([]);

    },[playlistName, newPlaylistTracks])

    const updatePlaylistName = useCallback((newName, playlistIndex) => {
    
        // Checks if playlistIndex is a number and not over or under the existingPlaylist length
        if (typeof playlistIndex === 'number' && playlistIndex >= 0 && playlistIndex < existingPlaylist.length) {
            console.log(`Playlist is existing`);
    
            setExistingPlaylist((prevPlaylists) => {
              const updatedPlaylists = [...prevPlaylists];
              updatedPlaylists[playlistIndex].playlistName =  newName;
              return updatedPlaylists;
            })
    
        } else {
          setPlaylistName(newName);
    
        }
      },[existingPlaylist])


    const playlistProps = {
        dashboardOpen: false,
        existingPlaylist: existingPlaylist,
        setExistingPlaylist: setExistingPlaylist,
        onAdd: addingTrack,
        onRemove: removingTrack,
        onEdit: vi.fn(),
        onEditClose: vi.fn(),
        onEditOpen: vi.fn(),
        onNameChange: updatePlaylistName,
        onSave: handleSave,
        playlistName: playlistName,
        playlistTracks: newPlaylistTracks,
        setSelectedPlaylist: vi.fn(),
        showModal: false,
        searchResults: searchTracks,
        tracks: searchTracks,
        setSearchLoading: vi.fn(),
        setTransferLoading: vi.fn(),
        transferLoading: vi.fn(),
    };

    const searchResultsProps = {
        keyPrefix: 'search-',
        onAdd: addingTrack,
        onRemove: vi.fn(),
        playlistTracks: newPlaylistTracks,
        tracks: searchTracks,
    }


    return (
    <>
        <Playlist {...playlistProps} />
        <SearchResults {...searchResultsProps}/>
    </>
    );
}

function RemovingPlaylistWrapper() {
    const [existingPlaylist, setExistingPlaylist] = React.useState([...mockPlaylists]);
    const handleRemove = (playlistId) => {
        setExistingPlaylist((prev) =>
            prev.filter((playlist) => playlist.playlistId !== playlistId)
        );
    };

    const playlistProps = {
        dashboardOpen: false,
        existingPlaylist: existingPlaylist,
        setExistingPlaylist: setExistingPlaylist,
        onAdd: vi.fn(),
        onRemove: handleRemove,
        onEdit: vi.fn(),
        onEditClose: vi.fn(),
        onEditOpen: vi.fn(),
        onNameChange: vi.fn(),
        onSave: vi.fn(),
        playlistName: '',
        playlistTracks: [searchTracks[0]],
        setSelectedPlaylist: vi.fn(),
        showModal: false,
        searchResults: searchTracks,
        tracks: searchTracks,
        setSearchLoading: vi.fn(),
        setTransferLoading: vi.fn(),
        transferLoading: vi.fn(),
    };

    return <Playlist {...playlistProps} />;
}


describe('Playlist Component', () => {

    it('renders input and save button', () => {

        render(<Playlist {...defaultProps} />);
        expect(screen.getAllByPlaceholderText('New Playlist').length).toBeGreaterThan(0);
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('calls onSave and adds new playlist to app', async() => {
        const playlistComponenet = render(<HandleTrackWrapper />)
        const initialPlaylists = playlistComponenet.container.querySelectorAll('.allPlaylists .Playlist').length;
        expect(initialPlaylists).toBe(mockPlaylists.length);

        const addTrackButton = screen.getByTestId('search-2');
        fireEvent.click(addTrackButton);

        const updatedTracks = playlistComponenet.container.querySelectorAll('.displayPlaylistsContainer .displayTrackList .displaytrackContainer').length;
        expect(updatedTracks).toBe(1);

        const nameInput = screen.getByTestId('playlist-name-input');
        fireEvent.change(nameInput, { target: { value: 'Saving Playlist' } });
        fireEvent.blur(nameInput);

        await waitFor(() => {
            expect(nameInput.value).toBe('Saving Playlist');
        });

        // Save playlist
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        const updatedPlaylists = playlistComponenet.container.querySelectorAll('.allPlaylists .Playlist').length;
        expect(updatedPlaylists).toBe(initialPlaylists + 1);


    });

    it('it shows new playlist with correct name', () => {
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

    it('adds tracks when "+" button is clicked', () => {

        const playlistComponenet = render(<HandleTrackWrapper />)
        const initialTracks = playlistComponenet.container.querySelectorAll('.displayPlaylistsContainer .trackBlock').length;
        // console.log(initialTracks)
        expect(initialTracks).toBeLessThan(1);

        const addTrackButton = screen.getByTestId('search-2');
        fireEvent.click(addTrackButton);

        const updatedTracks = playlistComponenet.container.querySelectorAll('.displayPlaylistsContainer .trackBlock').length;
        expect(updatedTracks).toBe(initialTracks + 1);

    });

    it('removes tracks when "-" button is clicked', () => {

        // SET UP
        const playlistComponenet = render(<HandleTrackWrapper />)
        const initialTracks = playlistComponenet.container.querySelectorAll('.displayPlaylistsContainer .trackBlock').length;
        expect(initialTracks).toBeLessThan(1);

        // console.log(initialTracks)

        const addTrackButton = screen.getByTestId('search-2');
        fireEvent.click(addTrackButton);

        const addedTracks = playlistComponenet.container.querySelectorAll('.displayPlaylistsContainer .trackBlock').length;
        expect(addedTracks).toBe(initialTracks + 1);
        
        // console.log(addedTracks)

        // Deleting Selected Track
        const updatedTracks = playlistComponenet.container.querySelectorAll('.displayPlaylistsContainer .trackBlock').length;
        const deleteTrackButton = screen.getByTestId('playlist-2');
        expect(updatedTracks).toBe(1);

        // console.log(updatedTracks)

        fireEvent.click(deleteTrackButton);
        const deletedTracks = playlistComponenet.container.querySelectorAll('.displayPlaylistsContainer .trackBlock').length;

        expect(deletedTracks).toBe(updatedTracks - 1);
        // console.log(deletedTracks)

    });

    it('removes playlist using "remove" button', () => {
        const playlistComponenet = render(<RemovingPlaylistWrapper/>);
        
        const initialPlaylists = playlistComponenet.container.querySelectorAll('.Playlist').length;
        expect(initialPlaylists).toBeGreaterThan(1);

        const removeButton = screen.getByTestId('a1b2c3-Remove');
        fireEvent.click(removeButton);

        const updatedPlaylists = playlistComponenet.container.querySelectorAll('.Playlist').length;
        expect(updatedPlaylists).toBe(initialPlaylists - 1);

        
    });

});