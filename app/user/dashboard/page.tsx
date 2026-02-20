"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const TOP_ARTISTS = [
  { id: 1, name: "Jax Bloom", sub: "Artist", src: "http://localhost:5000/upload/images/singer%201.webp" },
  { id: 2, name: "Sonu Nigam", sub: "Artist", src: "http://localhost:5000/upload/images/singer2.webp" },
  { id: 3, name: "The Weeknd", sub: "Artist", src: "http://localhost:5000/upload/images/singer%201.webp" },
  { id: 4, name: "Lofi Girl", sub: "Artist", src: "http://localhost:5000/upload/images/singer2.webp" },
];

export default function RootLandingPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/songs');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      
      // Transform backend data to match frontend format
      const transformedSongs = data.data?.songs?.map((song: any) => ({
        id: song._id,
        title: song.title,
        sub: song.artist?.name || 'Unknown Artist',
        src: song.album.coverImage && song.album.coverImage !== '/upload/hello.png' 
          ? (song.album.coverImage.startsWith('http') ? song.album.coverImage : `http://localhost:5000${song.album.coverImage}`)
          : `http://localhost:5000/upload/images/singer${(Math.floor(Math.random() * 4) + 1)}.webp`,
        audioUrl: song.audioUrl.startsWith('http') ? song.audioUrl : `http://localhost:5000${song.audioUrl}`
      })) || [];
      
      setSongs(transformedSongs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/albums');
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await response.json();
      
      // Transform backend data to match frontend format
      const transformedAlbums = data.data?.albums?.map((album: any) => ({
        id: album._id,
        title: album.title,
        sub: album.artist?.name || 'Unknown Artist',
        src: album.coverImage.startsWith('http') ? album.coverImage : `http://localhost:5000${album.coverImage}`,
        audioUrl: null // Albums don't have single audio URL
      })) || [];
      
      setAlbums(transformedAlbums);
    } catch (err) {
      console.error('Failed to fetch albums:', err);
    }
  };

  const handlePlayAction = (title: string) => {
    console.log("Playing:", title);
  };

  if (loading) {
    return (
      <div className="py-6 space-y-12 pb-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#207bc5]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 space-y-12 pb-20">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading songs: {error}</p>
            <button 
              onClick={fetchSongs}
              className="bg-[#207bc5] text-white px-6 py-2 rounded-full font-bold text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-12 pb-20">
      <section className="relative h-72 rounded-3xl overflow-hidden bg-gradient-to-r from-[#1d88be] to-[#b5a1f4] p-10 text-white flex flex-col justify-center shadow-lg">
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-80 mb-2 flex items-center gap-2">
            <Sparkles size={16} /> Featured Album: Synthwave Dreams
          </p>
          <h1 className="text-5xl font-bold max-w-xl leading-tight mb-6">Discover Your Next Obsession</h1>
          <button 
            onClick={() => handlePlayAction("Featured Album")}
            className="bg-white text-[#207bc5] px-8 py-3 rounded-full font-bold text-sm shadow-sm hover:scale-105 transition-transform"
          >
            Start Listening
          </button>
        </div>
        <span className="absolute right-[-20px] bottom-[-20px] text-[180px] font-bold opacity-10 select-none pointer-events-none">Lofix</span>
      </section>


      <MusicRow title="For You" subtitle="Based on your recent activity" items={songs} onPlay={handlePlayAction} />

      <MusicRow title="Albums" subtitle="Discover new releases" items={albums} onPlay={handlePlayAction} />

      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Top Artists</h2>
            <p className="text-sm text-gray-400">Your favorite creators</p>
          </div>
          <button className="text-sm font-bold text-[#14c9f6] hover:underline">View All</button>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
          {TOP_ARTISTS.map((artist) => (
            <div key={artist.id} className="min-w-[160px] text-center group cursor-pointer">
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                <img src={artist.src} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white p-3 rounded-full text-[#42a0ed] shadow-xl"><Play size={20} fill="currentColor" /></div>
                </div>
              </div>
              <h3 className="font-bold text-gray-900">{artist.name}</h3>
              <p className="text-xs text-gray-400 font-medium tracking-tight">{artist.sub}</p>
            </div>
          ))}
        </div>
      </section>


      <MusicRow title="Trending Now" subtitle="Most played this week" items={[...songs].reverse()} onPlay={handlePlayAction} />
    </div>
  );
}


function MusicRow({ title, subtitle, items, onPlay }: any) {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSong = (song: any, index: number) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    playSong(items[nextIndex], nextIndex);
  };

  const playPrevious = () => {
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    playSong(items[prevIndex], prevIndex);
  };

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.play();
    }
  }, [currentSong]);

  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <button className="text-sm font-bold text-[#5ca9f6] hover:underline">View All</button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {items.map((item: any, index: number) => (
          <div key={item.id} className="min-w-[200px] group">
            <div 
              onClick={() => item.audioUrl && playSong(item, index)}
              className={`relative h-48 rounded-2xl mb-4 overflow-hidden cursor-pointer shadow-sm group-hover:shadow-xl transition-all duration-300 bg-gray-100 ${
                currentSong?.id === item.id ? 'ring-2 ring-[#5c95f6]' : ''
              }`}
            >
              <img 
                src={item.src} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = 'http://localhost:5000/upload/hello.png';
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white p-3 rounded-full text-[#8b5cf6] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {currentSong?.id === item.id && isPlaying ? (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-4 bg-[#8b5cf6] rounded-sm mr-0.5"></div>
                      <div className="w-2 h-4 bg-[#8b5cf6] rounded-sm"></div>
                    </div>
                  ) : (
                    <Play size={24} fill="currentColor" />
                  )}
                </div>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 leading-tight mb-0.5">{item.sub}</h3>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Playlist • Lofix</p>
          </div>
        ))}
      </div>
      
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <audio
            ref={audioRef}
            src={currentSong.audioUrl}
            onEnded={playNext}
          />
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <img 
                src={currentSong.src} 
                alt={currentSong.title} 
                className="w-12 h-12 rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'http://localhost:5000/upload/hello.png';
                }}
              />
              <div>
                <h4 className="font-semibold text-gray-900">{currentSong.title}</h4>
                <p className="text-sm text-gray-500">{currentSong.sub}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={playPrevious}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-8a1 1 0 00-1.555-.832L5 8.382V6a1 1 0 00-2 0v8a1 1 0 002 0v-2.382l3.445 3.214z"/>
                </svg>
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-3 bg-[#496699] text-white rounded-full hover:bg-[#1567da] transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>
              
              <button
                onClick={playNext}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L8 11.618V14a1 1 0 002 0V6a1 1 0 00-2 0v2.382L4.555 5.168z"/>
                  <path d="M15 6a1 1 0 00-1 1v6a1 1 0 102 0V7a1 1 0 00-1-1z"/>
                </svg>
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}