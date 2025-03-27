import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { RadioProvider } from './context/RadioContext';
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext } from "./context/PlayerContext";
import Radio from './components/Radio';

const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);

  return (
    <RadioProvider>
      <div className="h-screen bg-black">
        <div className="h-screen bg-black">
          {songsData?.length !== 0 ? (
            <>
              <div className="h-[90%] flex">
                <Sidebar />
                <Routes>
                  <Route path="/" element={<Display />} />
                  <Route path="/radio" element={<Radio />} />
                </Routes>
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

export default App;
