import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import EditingPlaylist from '../Components/Playlist/EditPlaylist';

const testPlaylist = [
    {
        playlistId: '12345',
        playlistName: 'Test', 
        tracks: [{ id: '1', name: "Track", imageUri: '/test.jpg'}],
    },
];

const defaultProps = {
    existingPlaylist: testPlaylist,
    selectedPlaylist: 0,
    setSelectedPlaylist: jest.fn(),
    onEdit: jest.fn(),
    setTracksEdited: jest.fn(),
    tracksEdited: [],
    onNameChange: jest.fn(),
    searchResults: [],
    handleExitEditMode: jest.fn(),
    setSearchLoading: jest.fn(),
};

describe('Editing Playlist Component', () => {
    it('renders edit playlist header', () => {
        render(<EditingPlaylist {...defaultProps}/>);
        expect(screen.getByText(/Editing: Test/i)).toBeInTheDocument();
    });

    it('allows changing the name', () => {
        render(<EditingPlaylist {...defaultProps}/>);
        fireEvent.click(screen.getByText(/Editing: Test/i));
        const testInput = screen.getByDisplayValue('Test');
        fireEvent.change(testInput, {target: {value: 'Updated Name'}});
        fireEvent.blur(testInput);
        expect(testInput.value).toBe('Updated Name');
    });

    it('calls handleExitEditMode when the cancel button is clicked', () => {
        render(<EditingPlaylist {...defaultProps}/>);
        fireEvent.click(screen.getByText('Cancel'));
        expect(defaultProps.handleExitEditMode).toHaveBeenCalled();

    })
})