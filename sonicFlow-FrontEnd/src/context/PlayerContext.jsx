//

import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

// Create the PlayerContext
export const PlayerContext = createContext();

// Create the PlayerContextProvider component
export const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const volumeBg = useRef();
  const volumeBar = useRef();

  const url = "http://localhost:4000"; // Fix the URL typo

  // States for songs, albums, track, play status, and time
  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null); // Default track should be null, not undefined
  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(0.7); // Default volume 70%
  const [isMuted, setIsMuted] = useState(false); // Track mute state
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  // Store radio state to coordinate playback
  const [radioState, setRadioState] = useState({
    isRadioPlaying: false,
    pauseRadio: null,
  });

  // Set initial volume when audio is ready
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Update volume bar if ref is available
      if (volumeBar.current) {
        volumeBar.current.style.width = `${volume * 100}%`;
      }
    }
  }, [volume, audioRef.current]);

  // Volume control functions
  const adjustVolume = (e) => {
    if (audioRef.current && volumeBg.current) {
      const newVolume = Math.max(0, Math.min(1, e.nativeEvent.offsetX / volumeBg.current.offsetWidth));
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      
      // Update volume bar
      if (volumeBar.current) {
        volumeBar.current.style.width = `${newVolume * 100}%`;
      }
      
      // If volume is set above 0, we're no longer muted
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      } else if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (!isMuted) {
        // Store current volume before muting
        audioRef.current.volume = 0;
        setIsMuted(true);
        // Update volume bar
        if (volumeBar.current) {
          volumeBar.current.style.width = '0%';
        }
      } else {
        // Restore previous volume
        audioRef.current.volume = volume || 0.7;
        setIsMuted(false);
        // Update volume bar
        if (volumeBar.current) {
          volumeBar.current.style.width = `${(volume || 0.7) * 100}%`;
        }
      }
    }
  };

  // Play and Pause functions
  const play = () => {
    if (audioRef.current) {
      // Pause radio if it's playing
      if (radioState.isRadioPlaying && radioState.pauseRadio) {
        radioState.pauseRadio();
      }
      
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const playWithId = async (id) => {
    // Pause radio if it's playing
    if (radioState.isRadioPlaying && radioState.pauseRadio) {
      radioState.pauseRadio();
    }
    
    await songsData.map((item) => {
      if (id === item._id) {
        setTrack(item);
      }
    });
    await audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = async () => {
    // Pause radio if it's playing
    if (radioState.isRadioPlaying && radioState.pauseRadio) {
      radioState.pauseRadio();
    }
    
    songsData.map(async (item, index) => {
      if (track._id === item._id && index > 0) {
        await setTrack(songsData[index - 1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
    });
  };

  const next = async () => {
    // Pause radio if it's playing
    if (radioState.isRadioPlaying && radioState.pauseRadio) {
      radioState.pauseRadio();
    }
    
    songsData.map(async (item, index) => {
      if (track._id === item._id && index < songsData.length) {
        await setTrack(songsData[index + 1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
    });
  };

  // Method for RadioContext to update its state
  const updateRadioState = (isPlaying, pauseFunction) => {
    setRadioState({
      isRadioPlaying: isPlaying,
      pauseRadio: pauseFunction
    });
  };

  const seekSong = (e) => {
    if (audioRef.current && seekBg.current) {
      audioRef.current.currentTime =
        (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
        audioRef.current.duration;
    }
  };

  // Fetch songs and albums data
  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongsData(response.data.songs);
      setTrack(response.data.songs[0]);
    } catch (error) {
      console.error("Error fetching songs data:", error);
    }
  };

  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumsData(response.data.album);
    } catch (error) {
      console.error("Error fetching albums data:", error);
    }
  };

  // Handle time updates
  useEffect(() => {
    if (!audioRef.current) return;

    const updateTime = () => {
      if (!audioRef.current.duration) return;
      seekBar.current.style.width = `${Math.floor(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      )}%`;
      setTime({
        currentTime: {
          second: String(
            Math.floor(audioRef.current.currentTime % 60)
          ).padStart(2, "0"),
          minute: Math.floor(audioRef.current.currentTime / 60),
        },
        totalTime: {
          second: String(Math.floor(audioRef.current.duration % 60)).padStart(
            2,
            "0"
          ),
          minute: Math.floor(audioRef.current.duration / 60),
        },
      });
    };

    audioRef.current.addEventListener("timeupdate", updateTime);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateTime);
      }
    };
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    getSongsData();
    getAlbumsData();
  }, []); // Empty dependency array to ensure it only runs once

  // Provide context values
  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    volumeBg,
    volumeBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    volume,
    isMuted,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    adjustVolume,
    toggleMute,
    songsData,
    albumsData,
    updateRadioState
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};
