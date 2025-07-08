import React from 'react';
import TrackList from '../Tracklist/Tracklist';



const SearchResults = ({ tracks, onAdd, onRemove, playlistTracks, tracksEdited, keyPrefix, allowDuplicateAdd}) => {

    // If there are no search results
    if (!tracks || tracks.length === 0) {
        return;
    }

    return (
        <div className='displaySearchResults'>
            {/* Add pagination controls to Search Results */}
            <TrackList 
                keyPrefix={keyPrefix}
                tracks={tracks}
                onAdd={onAdd}
                onRemove={onRemove}
                playlistTracks={playlistTracks}
                tracksEdited={tracksEdited}
                allowDuplicateAdd={true}
            />
        </div>
    )
}

export default SearchResults;