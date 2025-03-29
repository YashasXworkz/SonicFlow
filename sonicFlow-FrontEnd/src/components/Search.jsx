import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import SongItem from './songItem';
import AlbumItem from './AlbumItem';
import Navbar from './Navbar';

const Search = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const { songsData, albumsData, playWithId } = useContext(PlayerContext);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to home if query is empty
    if (!query || query.trim() === '') {
      navigate('/');
      return;
    }
    
    if (songsData.length || albumsData.length) {
      setIsLoading(true);
      const searchTerm = query.toLowerCase();
      
      // Filter songs
      const matchingSongs = songsData.filter(song => 
        song.name.toLowerCase().includes(searchTerm) || 
        (song.desc && song.desc.toLowerCase().includes(searchTerm)) ||
        (song.album && song.album.toLowerCase().includes(searchTerm))
      );
      
      // Filter albums
      const matchingAlbums = albumsData.filter(album => 
        album.name.toLowerCase().includes(searchTerm) || 
        (album.desc && album.desc.toLowerCase().includes(searchTerm))
      );
      
      setFilteredSongs(matchingSongs);
      setFilteredAlbums(matchingAlbums);
      setIsLoading(false);
    }
  }, [query, songsData, albumsData, navigate]);

  return (
    <div className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg-ml-0">
      <Navbar />
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-1 my-5">Search Results for "{query}"</h2>
        <p className="text-gray-400">Found {filteredSongs.length} songs and {filteredAlbums.length} albums</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Searching...</p>
          </div>
        </div>
      ) : (
        <>
          {filteredAlbums.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Albums</h3>
              <div className="flex flex-row overflow-x-auto gap-4 pb-4 no-scrollbar">
                {filteredAlbums.map((album, index) => (
                  <AlbumItem 
                    key={index} 
                    name={album.name} 
                    desc={album.desc} 
                    id={album._id} 
                    image={album.image}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredSongs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Songs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSongs.map((song, index) => (
                  <div 
                    key={index}
                    className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all cursor-pointer"
                    onClick={() => playWithId(song._id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-[#282828] rounded-md flex-shrink-0 overflow-hidden">
                        <img 
                          src={song.image} 
                          alt={song.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base text-white truncate">{song.name}</h4>
                        <p className="text-sm text-gray-400 truncate mt-1">{song.desc || song.album || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredSongs.length === 0 && filteredAlbums.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
              <p className="text-gray-400 text-xl mb-4">No results found for "{query}"</p>
              <p className="text-gray-500">Try searching for something else</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search; 