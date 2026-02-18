"use client";

import { usePlayer } from "@/context/PlayerContext";

export default function GlobalPlayer() {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{currentSong.title}</p>
      </div>

      <div>
        <button
          onClick={togglePlay}
          className="px-4 py-2 bg-green-500 rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
