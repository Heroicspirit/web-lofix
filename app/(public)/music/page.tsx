"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";

export default function MusicPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('/api/songs');
      setSongs(response.data.data?.songs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    const timestamp = Date.now();
    return `http://localhost:5000${url}?t=${timestamp}`;
  };

  const handlePlaySong = (song: any) => {
    if (currentSong?._id === song._id && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Music Library</h1>
          <p className="text-gray-600 mt-2">Browse and play your favorite songs</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Music Player */}
        {currentSong && (
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/20">
                {currentSong.coverImage ? (
                  <img
                    src={getImageUrl(currentSong.coverImage)}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/30 rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                <p className="text-white/80">{currentSong.artist?.name || 'Unknown Artist'}</p>
                <p className="text-white/60 text-sm">{currentSong.album || 'Single'}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handlePlaySong(currentSong)}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  ) : (
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                  )}
                </button>
              </div>
            </div>
            {currentSong.audioUrl && (
              <audio
                ref={(audio) => {
                  if (audio) {
                    if (isPlaying) {
                      audio.play();
                    } else {
                      audio.pause();
                    }
                  }
                }}
                src={`http://localhost:5000${currentSong.audioUrl}`}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}
          </div>
        )}

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div
              key={song._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                currentSong?._id === song._id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handlePlaySong(song)}
            >
              <div className="aspect-square bg-gray-200 relative">
                {song.coverImage ? (
                  <img
                    src={getImageUrl(song.coverImage)}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-y-[6px] border-y-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{song.title}</h3>
                <p className="text-sm text-gray-600 truncate">{song.artist?.name || 'Unknown Artist'}</p>
                <p className="text-xs text-gray-500 truncate">{song.album || 'Single'}</p>
              </div>
            </div>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">No songs available</h3>
            <p>Check back later for new music!</p>
          </div>
        )}
      </div>
    </div>
  );
}
