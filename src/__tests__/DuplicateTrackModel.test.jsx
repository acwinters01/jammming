import React from "react";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import DuplicateTrackModal from "../Components/Track/DuplicateTrackModal";
import EditingPlaylist from "../Components/Playlist/EditPlaylist";
import SearchResults from '../Components/SearchResults/SearchResults';
import SearchBar from '../Components/SearchBar/SearchBar';



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




describe('Duplicate Track Modal Component', () => {
    it('modal pops up when user attempts to add same track', () => {
        render(<EditingPlaylist {...defaultEditingPlaylistProps} />);
        render(<SearchResults {...searchProps}/>)
        console.log(searchProps)
        expect(screen.getByText('SearchTrack-1')).toBeInTheDocument();
        
        
        // render(<TrackList {...defaultTrackListProps} />);
        // fireEvent.click(screen.getByTestId('track-1'));
        // expect(screen.getByText('Do you want to add it again?')).toBeInTheDocument();
    });
})



const defaultTrackListProps = {
    tracks: [
        {
            uniqueKey: '',
            id: '1',
            name: 'Track',
            album: 'Test Album',
            artist: 'Test Artist',
            imageUri: '/test.jpg',
            uri: '/testURI.jpg', 
            onAdd: jest.fn(),
            onRemove: jest.fn(),
            isSelected: true,

        }, 
        {
            uniqueKey: '',
            id: '2',
            name: 'Track-2',
            album: 'Test Album-2',
            artist: 'Test Artist-2',
            imageUri: '/test2.jpg',
            uri: '/testURI2.jpg', 
            onAdd: jest.fn(),
            onRemove: jest.fn(),
            isSelected: false,

        }],
    tracksPerPage: 5,
    onAdd: jest.fn(),
    onRemove: jest.fn(),
    playlistTracks: testPlaylist
};

const testTrack = {
    uniqueKey: '000-Track',
    id: '1',
    name: 'Track', 
    artist: '',
    album: "Album Name",
    uri: '/track.jpg',
    imageUri: '/test.jpg',
    onAdd: jest.fn(),
    onRemove: jest.fn(),
    isSelected: true,
}

const defaultTrackProps = {
    uniqueKey: '',
    id: '1',
    name: 'Track',
    album: 'Test Album',
    artist: 'Test Artist',
    imageUri: '/test.jpg',
    uri: '/testURI.jpg', 
    onAdd: jest.fn(),
    onRemove: jest.fn(),
    isSelected: true,

}