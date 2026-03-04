"use client";

import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function GlobalPlayerBar() {
  const { currentSong, isPlaying, togglePlay, nextSong, previousSong } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white border-t border-gray-800 p-4 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src={currentSong.src || currentSong.coverImage || 'http://localhost:5000/upload/hello.png'} 
            alt={currentSong.title} 
            className="w-12 h-12 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = 'http://localhost:5000/upload/hello.png';
            }}
          />
          <div>
            <p className="font-medium">{currentSong.title}</p>
            <p className="text-sm text-gray-400">Now playing</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button onClick={previousSong} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay}
            className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={nextSong} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
}
