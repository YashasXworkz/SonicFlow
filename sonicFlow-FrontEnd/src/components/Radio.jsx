import React, { useState, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';

const Radio = () => {
  const {
    stations,
    setStations,
    loading,
    setLoading,
    currentStation,
    isPlaying,
    playStation
  } = useRadio();
  const [searchTerm, setSearchTerm] = useState('');

  const defaultRadioImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxNC41Yy0yLjQ5IDAtNC41LTIuMDEtNC41LTQuNVM5LjUxIDcuNSAxMiA3LjVzNC41IDIuMDEgNC41IDQuNS0yLjAxIDQuNS00LjUgNC41em0wLTUuNWMtLjU1IDAtMSAuNDUtMSAxczAuNDUgMSAxIDEgMS0wLjQ1IDEtMS0wLjQ1LTEtMS0xeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==';

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      // Using the all.api endpoint which redirects to a working server
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = 'https://all.api.radio-browser.info/json/stations/bycountrycodeexact/in';
      
      try {
        const response = await fetch(`${apiUrl}?limit=1300&order=random`, {
          headers: {
            'Origin': window.location.origin
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Loaded ${data.length} stations from primary API`);
          const stationsWithIds = data.map(station => ({
            ...station,
            id: station.stationuuid || station.id || Math.random().toString(36).substr(2, 9)
          }));
          setStations(stationsWithIds);
        } else {
          throw new Error('Failed to fetch stations');
        }
      } catch (error) {
        console.error('Error fetching from API:', error);
        
        // Fallback API call using public API
        try {
          const response = await fetch('https://de1.api.radio-browser.info/json/stations/search?limit=1300&countrycode=in&order=random');
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Loaded ${data.length} stations from fallback API`);
            const stationsWithIds = data.map(station => ({
              ...station,
              id: station.stationuuid || station.id || Math.random().toString(36).substr(2, 9)
            }));
            setStations(stationsWithIds);
          } else {
            throw new Error('Failed to fetch stations from fallback');
          }
        } catch (fallbackError) {
          console.error('Fallback API failed:', fallbackError);
          throw fallbackError;
        }
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      setStations([
        {
          id: '1',
          name: 'All India Radio',
          url_resolved: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8',
          tags: 'News, National'
        },
        {
          id: '2',
          name: 'Radio Mirchi',
          url_resolved: 'https://radioindia.net/radio/mirchi98/icecast.audio',
          tags: 'Music, Entertainment'
        },
        {
          id: '3',
          name: 'Radio City',
          url_resolved: 'https://prclive1.listenon.in:9302/',
          tags: 'Bollywood, Hindi'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (event) => {
    event.target.src = defaultRadioImage;
  };

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (station.tags && station.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full h-[calc(100vh-120px)] overflow-y-auto relative z-0 px-6 mt-5">
      <div className="flex justify-between items-center mb-6 sticky top-0 z-10 py-4 bg-gradient-to-r from-[#fef08a] via-[#84cc16] to-[#16a34a] px-4 rounded-md">
        <h2 className="text-2xl font-semibold ">Radio Stations</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search stations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#242424] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-[300px]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400 text-lg">Loading stations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4 mx-auto max-w-[2000px]">
          {filteredStations.map((station) => {
            const isCurrentlyPlaying = currentStation && station.id === currentStation.id && isPlaying;
            
            return (
              <div
                key={station.id}
                className={`bg-[#181818] rounded-md cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  isCurrentlyPlaying ? 'ring-1 ring-green-500' : 'hover:bg-[#282828]'
                }`}
                onClick={() => playStation(station)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-16 h-16 bg-[#282828] rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden ${
                      isCurrentlyPlaying ? 'ring-1 ring-green-500' : ''
                    }`}>
                      <img
                        src={station.favicon || defaultRadioImage}
                        alt={station.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-white truncate pr-2">
                        {station.name}
                      </h3>
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {station.tags || 'No tags'}
                      </p>
                      {isCurrentlyPlaying && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-500 font-medium">Now Playing</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Radio;
