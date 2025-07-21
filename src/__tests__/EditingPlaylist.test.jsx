import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import EditingPlaylist from '../Components/Playlist/EditPlaylist';
import DuplicateTrackModal from '../Components/Track/DuplicateTrackModal';
import TrackList from '../Components/Tracklist/Tracklist';


const tracks = [
        {
            uniqueKey: '11',
            id: '1',
            name: 'Track',
            album: 'Test Album',
            artist: 'Test Artist',
            image: '/test.jpg',
            uri: '/testURI.jpg', 
            onAdd: jest.fn(),
            onRemove: jest.fn(),
            isSelected: true,

        }, 
        {
            uniqueKey: '22',
            id: '2',
            name: 'Track-2',
            album: 'Test Album-2',
            artist: 'Test Artist-2',
            imageUri: '/test2.jpg',
            uri: '/testURI2.jpg', 
            onAdd: jest.fn(),
            onRemove: jest.fn(),
            isSelected: false,

        }
];

const searchTracks = [
        {
            uniqueKey: 'search-11',
            id: '1',
            name: 'SearchTrack-1',
            album: 'Test Album',
            artist: 'Test Artist',
            image: '/test.jpg',
            uri: '/testURI.jpg', 
            onAdd: jest.fn(),
            onRemove: jest.fn(),
            isSelected: true,
            keyPrefix: 'search'

        }, 
        {
            uniqueKey: 'search-22',
            id: '2',
            name: 'SearchTrack-2',
            album: 'Test Album-2',
            artist: 'Test Artist-2',
            imageUri: '/test2.jpg',
            uri: '/testURI2.jpg', 
            onAdd: jest.fn(),
            onRemove: jest.fn(),
            isSelected: false,
            keyPrefix: 'search'

        },
        {
            uniqueKey: '33',
            id: '3',
            name: 'SearchTrack-3',
            album: 'Test Album-3',
            artist: 'Test Artist-3',
            imageUri: '/test3.jpg',
            uri: '/testURI3.jpg', 
            onAdd: jest.fn(),
            onRemove: jest.fn(),
            isSelected: false,
            keyPrefix: 'search'

        }
];

const testPlaylist = [
    {
        playlistId: '12345',
        playlistName: 'TestPlaylist', 
        tracks: tracks,
    },
];

const defaultEditingPlaylistProps = {
    existingPlaylist: testPlaylist,
    selectedPlaylist: 0,
    setSelectedPlaylist: jest.fn(),
    onEdit: jest.fn(),
    setTracksEdited: jest.fn(),
    tracksEdited: tracks,
    tracks: tracks,
    onNameChange: jest.fn(),
    searchResults: [],
    handleExitEditMode: jest.fn(),
    setSearchLoading: jest.fn(),
};

function PlaylistTestWrapper() {
  const [playlist, setPlaylist] = React.useState([
    {
      playlistId: '12345',
      playlistName: 'TestPlaylist',
      tracks: [...testPlaylist[0].tracks], // e.g. 2 tracks initially
    },
  ]);

  const handleConfirm = () => {
    const updatedTracks = [...playlist[0].tracks, searchTracks[0]];
    setPlaylist([
      {
        ...playlist[0],
        tracks: updatedTracks,
      },
    ]);
  };

  const editingPlaylistProps = {
    existingPlaylist: playlist,
    selectedPlaylist: 0,
    setSelectedPlaylist: jest.fn(),
    onEdit: jest.fn(),
    setTracksEdited: jest.fn(),
    tracksEdited: playlist[0].tracks,
    tracks: playlist[0].tracks,
    onNameChange: jest.fn(),
    searchResults: [],
    handleExitEditMode: jest.fn(),
    setSearchLoading: jest.fn(),
  };

  return (
    <>
      <EditingPlaylist 
        {...editingPlaylistProps} />
      <DuplicateTrackModal
        track={searchTracks[0]}
        onConfirm={handleConfirm}
        onCancel={jest.fn()}
      />
    </>
  );
};

function RemovingTrackWrapper() {
  const [trackList, setTrackList] = React.useState([...tracks]);

  const handleRemove = (track) => {
    setTrackList((prev) =>  prev.filter((t) => t.uniqueKey !== track.uniqueKey))
  };

  return (
    <TrackList 
        keyPrefix='editing'
        tracks= {trackList}
        onAdd={jest.fn()}
        onRemove= {handleRemove}
        playlistTracks={trackList}
        tracksEdited={trackList}
        tracksPerPage= {10}
        allowDuplicateAdd= {false}/>
  );
  
};

describe('Editing Playlist Component', () => {

    it('renders edit playlist header', () => {
        render(<EditingPlaylist {...defaultEditingPlaylistProps}/>);
        expect(screen.getByText(/Editing: Test/i)).toBeInTheDocument();
    });

    it('allows changing the name', () => {
        render(<EditingPlaylist {...defaultEditingPlaylistProps}/>);
        fireEvent.click(screen.getByText(/Editing: Test/i));
        const testInput = screen.getByDisplayValue('TestPlaylist');
        fireEvent.change(testInput, {target: {value: 'Updated Name'}});
        fireEvent.blur(testInput);
        expect(testInput.value).toBe('Updated Name');
    });

    it('calls handleExitEditMode when the cancel button is clicked', () => {
        render(<EditingPlaylist {...defaultEditingPlaylistProps}/>);
        fireEvent.click(screen.getByText('Cancel'));
        expect(defaultEditingPlaylistProps.handleExitEditMode).toHaveBeenCalled();

    });

    it('tracks adds after add again button is clicked', () => {

        render(<PlaylistTestWrapper />)

        const initialCount = screen.getAllByText(searchTracks[0].name).length;
        const addAgainButton = screen.getByRole('button', { name: 'Add Again' })

        fireEvent.click(addAgainButton)
        const updatedCount = screen.getAllByText(searchTracks[0].name).length;
        expect(updatedCount).toBe(initialCount + 1);

    });

    it('removes tracks from editing playlist', () => {
        render(<RemovingTrackWrapper/>)
        expect(screen.getByText('Track')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("editing-1"));
        expect(screen.queryByText('Track')).not.toBeInTheDocument();
      
    });
});