import React, {useCallback, useState} from 'react';
import Playlist from './components/Playlist/Playlist';
import Authorization from './util/Authorization';
import Dashboard from './components/Dashboard/Dashboard';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Loading from './components/Loading/Loading'
import DuplicateTrackModal from './components/Track/DuplicateTrackModal';
import PlaylistModal from './components/Playlist/PlaylistModal'
import './styles/App.css'
import './styles/App-mobile.css'
import './styles/reset.css'


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  const [searchResults, setSearchResults] = useState([]);
  const [existingPlaylist, setExistingPlaylist] = useState([]);
  const [newPlaylistTracks, setNewPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  let setIsDuplicateModalVisible = false;
  const [ duplicateTrack, setDuplicateTrack ] = useState(null);

  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [playlistModalMessage, setPlaylistModalMessage] = useState('');


  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);  

  // Loading Screens
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const isAnyLoading = () => searchLoading || transferLoading;

  // Toggle
  const toggleDashboard = () => {
    if (isEditing) return;
    setDashboardOpen(!dashboardOpen);
  }
  const handleEditOpen = () => {
    if (dashboardOpen) {
      setShowModal(true); // Show modal if dashboard is open
    } else {
      setIsEditing(true);
    }
  }
  const handleEditClose = () => setIsEditing(false);
  const closeModal = () => setShowModal(false);

  // Functions
  const handleConfirmAdd = (track) => {
    const uniqueKey = `track-${track.id}-${Date.now()}-${Math.random()}`;

    setNewPlaylistTracks((prevTracks) => [...prevTracks,{...track, uniqueKey}]); // Adding making sure of duplicates
    setIsDuplicateModalVisible(false);
    setDuplicateTrack(null);
  }

  const handleCancelAdd = () => {
    setIsDuplicateModalVisible(false);
    setDuplicateTrack(null); // Hide modal without adding
  };

  // Add track to new playlist
  const addTrack = (track) => {
      console.log('being read')
      const uniqueKey = `track-${track.id}-${Date.now()}-${Math.random()}`;
      setNewPlaylistTracks((prevTracks) => [...prevTracks, {...track, uniqueKey}]);
    };

  // Remove track to new playlist
  const removeTrack = useCallback((track) => {
    console.log(`deleting....${track.uniqueKey}`)

    setNewPlaylistTracks((prev) => (
      prev.filter((t) => t.uniqueKey !== track.uniqueKey)
    ));

  }, []);

  // Sets track results from searchbar.js
  const handleSearchResults = (results) => {
    setSearchResults(results || []);
  };

  // Updates Playlist name
  const updatePlaylistName = useCallback((newName, playlistIndex) => {

    console.log(`Playlist is ${playlistIndex}`)
    // Checks if playlistIndex is a number and not over or under the existingPlaylist length
    if (typeof playlistIndex === 'number' && playlistIndex >= 0 && playlistIndex < existingPlaylist.length) {
        console.log(`Playlist is existing`);
        setExistingPlaylist((prevPlaylists) => {
          const updatedPlaylists = [...prevPlaylists];
          updatedPlaylists[playlistIndex].playlistName =  newName;
          return updatedPlaylists;
        });

    } else {
      setPlaylistName(newName);
    }
  }, [existingPlaylist])

  // Saves Playlist
  const savePlaylist = useCallback(() => {
    // Ensure playlist has a name and tracks
    if (!playlistName || newPlaylistTracks.length === 0) {
      setPlaylistModalMessage(!playlistName ? "Please name your playlist before saving." : "Please add tracks before saving.");
      setShowPlaylistModal(true);
      return;
    }
    // Creating a playlistId for local playlist
    const generateLocalId = () => `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;


    const newPlaylist = {
        key: generateLocalId(),
        playlistId: generateLocalId(),
        playlistName: playlistName,
        tracks: newPlaylistTracks
    };

    // console.log('Saving playlist', newPlaylist)
    setExistingPlaylist((prev) => [...prev, newPlaylist]);    
    
    setPlaylistName('');
    setNewPlaylistTracks([]);

  }, [playlistName, newPlaylistTracks]);

  // Edits Existing Playlists
  const editExistingPlaylist = useCallback((playlistIndex, updatedTracks) => {
    setExistingPlaylist((prevPlaylists) => {
      const updatedPlaylist = [...prevPlaylists];
      updatedPlaylist[playlistIndex].tracks = updatedTracks;
      return updatedPlaylist;
    })

  },[])

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsAppLoaded(true);
    // For testing
    // setTimeout(() => setIsAppLoaded(true), 1000); 
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    setIsAuthenticated(false);
    setIsAppLoaded(false);
  }

  const handleSetSearchLoading = useCallback((bool) => {
    setSearchLoading(bool);
  }, []);

  const playlistProps = {
    playlistName,
    playlistTracks:newPlaylistTracks,
    onNameChange: updatePlaylistName,
    setPlaylistName: setPlaylistName,
    setExistingPlaylist: setExistingPlaylist,
    existingPlaylist:existingPlaylist,
    tracks:searchResults,
    onEdit:editExistingPlaylist,
    onSave:savePlaylist,
    onRemove:removeTrack,
    onAdd:addTrack,
    searchResults:searchResults,
    setSearchLoading:setSearchLoading,
    setTransferLoading:setTransferLoading,
    transferLoading:transferLoading,
    onEditOpen:handleEditOpen,
    onEditClose: handleEditClose,
    setShowModal:setShowModal,
    showModal:showModal,
    dashboardOpen:dashboardOpen,
  }

  return (
    <div className={`AppContainer ${dashboardOpen ? 'dashboard-open' : ''} ${isEditing ? 'editing-active' : ''}`}>
      <div className='mainAppTitle'>
        <h1>Ja<span>mmm</span>ing</h1>
      </div>
      
      {!isAuthenticated ? (
        <div className='authorizationContainer'>
          <Authorization onLogin={handleLogin} onLogout={handleLogout}/>
        </div>
      ) : !isAppLoaded ? (
        <Loading isLoading={true}/>
      ) : (
        <>
          {<Loading isLoading={isAnyLoading()}/>}
          <div className='authorizationContainer' id="logOut">
            <Authorization onLogin={handleLogin} onLogout={handleLogout}/>
          </div>
          <div className='spacer'id='title-spacer'></div>

          <div className='main'>
            <div className='appStart'>
              <div className='PlaylistsContainer'>
                <div className='playlistTitle'>
                  <h2 id='title'>Playlists</h2>
                </div>
                <Playlist {...playlistProps}/>
              </div>
              <div className='search'>
              <div className='searchBarContainer'>
                <h2 id='title'>Results</h2>
                <SearchBar onSearchResults={handleSearchResults} setSearchLoading={handleSetSearchLoading} />
              </div>
              <div className='searchResultsContainer'>
                <SearchResults 
                  tracks={searchResults} 
                  onAdd={addTrack} 
                  onRemove={removeTrack} 
                  playlistTracks={newPlaylistTracks} 
                  keyPrefix={'search-'} 
                />
              </div>
            </div>
            </div>

          </div>

          {/* Dashboard Component */}
          <div className={`dashboardContainer ${dashboardOpen ? 'open' : ''}`}>
                {/* Dashboard Toggle Button */}
            <button className="dashboardToggle" onClick={toggleDashboard} disabled={isEditing}>
              {dashboardOpen ? '>' : '<'}
            </button>
            <Dashboard setExistingPlaylist={setExistingPlaylist} existingPlaylist={existingPlaylist} isOpen={dashboardOpen}/>
          </div>

          {/* Modal */}
          {showModal && ( <PlaylistModal message="Close the dashboard to edit a playlist." onClose={closeModal} />)}
          <DuplicateTrackModal track={duplicateTrack} onConfirm={handleConfirmAdd} onCancel={handleCancelAdd} />
          {showPlaylistModal && ( <PlaylistModal message={playlistModalMessage} onClose={() => setShowPlaylistModal(false)} />)}
        </>
      )}
    </div>
  );
}

export default App;