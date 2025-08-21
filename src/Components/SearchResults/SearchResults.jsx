import React from 'react';
import TrackList from '../Tracklist/Tracklist';


const SearchResults = ({ tracks, onAdd, onRemove, playlistTracks, tracksEdited, tracksPerPage}) => {

    // If there are no search results
    if (!tracks || tracks.length === 0) {
        return;
    }

    return (
        <div className='displaySearchResults'>
            {/* Add pagination controls to Search Results */}
            <TrackList 
                keyPrefix={'search'}
                tracks={tracks}
                onAdd={onAdd}
                onRemove={onRemove}
                playlistTracks={playlistTracks}
                tracksEdited={tracksEdited}
                allowDuplicateAdd={true}
                tracksPerPage={tracksPerPage}
            />
        </div>
    )
}

export default SearchResults;