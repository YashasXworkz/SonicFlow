import React, { useContext, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { RadioProvider } from './context/RadioContext';
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext, PlayerContextProvider } from "./context/PlayerContext";
import Radio from './components/Radio';
import Search from './components/Search';
import { assets } from './assets/assets';

const AppContent = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and then hide the loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show loading screen for 2.5 seconds
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 rounded-lg">
          <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-green-500 opacity-20 rounded-full animate-ping"></div>
            <img 
              src={assets.spotify_gif || assets.spotify_logo}
              alt="Loading..." 
              className="relative z-10 w-48 h-48 object-contain"
            />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-black">SonicFlow</h1>
          <p className="mt-2 text-xl text-gray-600">Your Music, Your Way</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RadioProvider>
      <div className="h-screen bg-black">
        <div className="h-screen bg-black">
          {songsData?.length !== 0 ? (
            <>
              <div className="h-[90%] flex">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/*" element={<Display />} />
                    <Route path="/radio" element={<Radio />} />
                    <Route path="/search/:query" element={<Search />} />
                  </Routes>
                </div>
              </div>
              <Player />
            </>
          ) : null}
        </div>

        <audio
          ref={audioRef}
          src={track ? track.file : null}
          preload="auto"
        ></audio>
      </div>
    </RadioProvider>
  );
};

const App = () => {
  return (
    <PlayerContextProvider>
      <AppContent />
    </PlayerContextProvider>
  );
};

export default App;
