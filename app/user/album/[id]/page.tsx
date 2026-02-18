"use client";

import React, { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, ListMusic } from "lucide-react";

export default function AlbumViewPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // In a real app, fetch album details using params.id
  const albumData = {
    title: "Starlight",
    artist: "Muse",
    cover: "/images/image2.webp",
    duration: "3:30",
    queue: [
      { id: 1, title: "Uprising", artist: "Muse" },
      { id: 2, title: "Knights of Cydonia", artist: "Muse" },
      { id: 3, title: "Hysteria", artist: "Muse" },
    ]
  };

  return (
    <div className="flex h-full bg-white">
      {/* Main Player Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 border-r border-gray-50">
        <div className="w-80 h-80 rounded-2xl shadow-2xl overflow-hidden mb-10 bg-gray-100">
          <img src={albumData.cover} alt={albumData.title} className="w-full h-full object-cover" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">{albumData.title}</h1>
          <p className="text-lg text-gray-400 font-medium">{albumData.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-bold">
            <span>1:45</span>
            <span>{albumData.duration}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-[45%] bg-[#8b5cf6] rounded-full" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8 text-gray-400">
          <Shuffle size={20} className="cursor-pointer hover:text-gray-900" />
          <SkipBack size={28} fill="currentColor" className="cursor-pointer hover:text-gray-900" />
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-[#8b5cf6] rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-200 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <SkipForward size={28} fill="currentColor" className="cursor-pointer hover:text-gray-900" />
          <Repeat size={20} className="cursor-pointer hover:text-gray-900" />
        </div>
      </div>

      {/* Up Next Sidebar */}
      <aside className="w-80 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900">Up Next</h2>
          <ListMusic size={20} className="text-gray-400" />
        </div>

        <div className="space-y-6">
          {albumData.queue.map((track) => (
            <div key={track.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                   {/* Placeholder for track thumb */}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{track.title}</p>
                  <p className="text-xs text-gray-400 font-medium">{track.artist}</p>
                </div>
              </div>
              <Play size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}