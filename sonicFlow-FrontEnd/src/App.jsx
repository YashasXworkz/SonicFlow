import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { RadioProvider } from './context/RadioContext';
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext, PlayerContextProvider } from "./context/PlayerContext";
import Radio from './components/Radio';
import Search from './components/Search';

const AppContent = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);

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
