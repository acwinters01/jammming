import React from "react";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DuplicateTrackModal from "../components/Track/DuplicateTrackModal";
import EditingPlaylist from "../components/Playlist/EditPlaylist";
import SearchResults from '../components/SearchResults/SearchResults';



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
]

const searchTracks = [
        {
            uniqueKey: '11',
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
            uniqueKey: '22',
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
]

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

const searchProps = {
    tracks: searchTracks,
    onAdd: jest.fn(),
    onRemove: jest.fn(),
    playlistTracks: testPlaylist[0].tracks
}

const duplicateTrackModalProps = {
    track: searchTracks[0],
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
}


describe('Duplicate Track Modal Component', () => {
    const jestConsole = console;

    beforeEach(() => {
        global.console = require('console');
    });

    afterEach(() => {
        global.console = jestConsole;
    });


    it('modal pops up when user attempts to add same track', () => {
        // SET UP //
        const editingModalResult = render(<EditingPlaylist {...defaultEditingPlaylistProps} />);
        editingModalResult.container.querySelector('.displayEditingPlaylist');
        const searchResults = render(<SearchResults {...searchProps}/>)
        searchResults.container.querySelector('.displaySearchResults');

        // Check for track to add
        expect(screen.getByText('SearchTrack-1')).toBeInTheDocument();
        const searchAddButton = screen.getByTestId('search-1');

        fireEvent.click(searchAddButton);
        render(<DuplicateTrackModal {...duplicateTrackModalProps}/>)
      
        
    });

    it('add again button is clickable', () => {

        // SET UP
        const editingModalResult = render(<EditingPlaylist {...defaultEditingPlaylistProps} />);
        editingModalResult.container.querySelector('.displayEditingPlaylist');
        const searchResults = render(<SearchResults {...searchProps}/>);
        searchResults.container.querySelector('.displaySearchResults');
        screen.getByTestId('search-1');

        // Check if Componenet Renders
        render(<DuplicateTrackModal {...duplicateTrackModalProps}/>);
        expect(screen.getByText('Do you want to add it again?')).toBeInTheDocument();

        // Check if Add Button is found and clickable
        const buttonEnabled = screen.getByRole('button', {name: 'Add Again'});
        expect(buttonEnabled).toBeInTheDocument();
        expect(buttonEnabled).toBeEnabled();


    });

    it('cancel button is clickable', async() => {

        // SET UP
        render(<EditingPlaylist {...defaultEditingPlaylistProps} />);
        const searchResults = render(<SearchResults {...searchProps}/>);
        searchResults.container.querySelector('.displaySearchResults');

        // Check if Componenet Renders
        const duplicateModal = render(<DuplicateTrackModal {...duplicateTrackModalProps}/>);
        expect(screen.getByText('Do you want to add it again?')).toBeInTheDocument();

        // Check if Cancel button is found and clickable
        await waitFor(() => {
            const modalButtons = duplicateModal.container.querySelector('.modal-buttons');
            expect(modalButtons).toBeInTheDocument();
            expect(modalButtons).toBeEnabled();
        });        
       
    });
})
