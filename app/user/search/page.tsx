"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, ChevronRight, Play } from "lucide-react";

// Static demo songs for the "Recommended for You" section when not searching
const STATIC_ALBUMS = [
  { id: 1, title: "Coffee", sub: "Morning Brew", src: "/images/image2.webp", audioUrl: "/audio/coffee.mp3" },
  { id: 2, title: "Beats", sub: "Focus Beats", src: "/images/image3.webp", audioUrl: "/audio/beats.mp3" },
  { id: 3, title: "Nature", sub: "Indie Gems", src: "/images/image4.webp", audioUrl: "/audio/nature.mp3" },
  { id: 4, title: "Chill", sub: "Chill Vibes", src: "/images/image5.jpg", audioUrl: "/audio/chill.mp3" },
];

/**
 * SearchPage component: Handles search functionality and audio playback
 */
export default function SearchPage() {
  // Search state - manages the search input and results
  const [query, setQuery] = useState(""); // Search query input
  const [results, setResults] = useState([]); // Search results
  const [isSearching, setIsSearching] = useState(false); // Flag to indicate if search is in progress
  
  // Audio player state - manages currently playing song and playback controls
  const [currentSong, setCurrentSong] = useState<any>(null); // Currently playing song
  const [isPlaying, setIsPlaying] = useState(false); // Flag to indicate if audio is playing
  const [currentIndex, setCurrentIndex] = useState(-1); // Current index in playlist
  const [currentPlaylist, setCurrentPlaylist] = useState<any[]>([]); // Current playlist
  const audioRef = useRef<HTMLAudioElement | null>(null); // Reference to audio element

  /**
   * Play a specific song from a playlist at a given index
   * @param song Song to play
   * @param index Index of song in playlist
   * @param playlist Playlist containing the song
   */
  const playSong = (song: any, index: number, playlist: any[]) => {
    console.log('Playing song:', song); // Debug log
    console.log('Song audio URL:', song.audioUrl); // Debug log
    setCurrentSong(song);
    setCurrentIndex(index);
    setCurrentPlaylist(playlist);
    setIsPlaying(true);
  };

  /**
   * Toggle between play and pause for the current song
   */
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Play the next song in the current playlist
   */
  const playNext = () => {
    // Check if playlist is empty
    if (currentPlaylist.length === 0) return;
    // Calculate next index
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    // Play next song
    playSong(currentPlaylist[nextIndex], nextIndex, currentPlaylist);
  };

  /**
   * Play the previous song in the current playlist
   */
  const playPrevious = () => {
    // Check if playlist is empty
    if (currentPlaylist.length === 0) return;
    // Calculate previous index
    const prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1;
    // Play previous song
    playSong(currentPlaylist[prevIndex], prevIndex, currentPlaylist);
  };

  // Auto-play new song when currentSong changes
  useEffect(() => {
    // Check if audio element and current song exist
    if (audioRef.current && currentSong) {
      // Play current song
      audioRef.current.play();
    }
  }, [currentSong]);

  // Handle search functionality with debouncing
  useEffect(() => {
    const handleSearch = async () => {
      // Check if search query is too short
      if (query.length < 2) {
        // Reset search results
        setResults([]);
        return;
      }

      // Set searching flag to true
      setIsSearching(true);
      try {
        // Fetch songs from backend API
        const res = await fetch(`http://localhost:5000/api/auth/search?q=${query}`);
        const data = await res.json();
        console.log('Search API response:', data); // Debug log
        
        // Check if API call was successful
        if (data.success) {
          // Transform backend data to match frontend format
          const transformedSongs = data.data?.songs?.map((song: any) => {
            const audioUrl = song.audioUrl.startsWith('http') ? song.audioUrl : `http://localhost:5000${song.audioUrl}`;
            console.log('Transformed song audio URL:', audioUrl); // Debug log
            return {
              _id: song._id,
              title: song.title,
              album: song.album || 'Unknown Album',
              artist: song.artist?.name || 'Unknown Artist',
              coverImage: song.coverImage 
                ? (song.coverImage.startsWith('http') ? song.coverImage : `http://localhost:5000${song.coverImage}`)
                : `http://localhost:5000/upload/hello.png`,
              audioUrl: audioUrl
            };
          }) || [];
          // Update search results
          setResults(transformedSongs);
        }
      } catch (error) {
        // Log any errors
        console.error("Search error:", error);
      } finally {
        // Set searching flag to false
        setIsSearching(false);
      }
    };

    // Debounce search to avoid too many API calls
    const debounce = setTimeout(handleSearch, 300);
    // Clear timeout on component unmount
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="py-6 space-y-10">
      {/* Search Bar - Input field for searching songs */}
      <div className="relative max-w-2xl">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, artists, or albums..."
          className="w-full bg-white border border-gray-100 py-4 pl-14 pr-6 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-purple-100 transition-all"
        />
      </div>

      {/* Show search results when user has typed 2+ characters */}
      {query.length >= 2 ? (
        <section>
          <h2 className="text-2xl font-bold mb-6">Search Results</h2>
          {results.length > 0 ? (
            // Grid of search result songs
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {results.map((song: any, index: number) => (
                <AlbumCard 
                  key={song._id} 
                  title={song.title} 
                  sub={song.album} 
                  src={song.coverImage} 
                  audioUrl={song.audioUrl} 
                  playSong={() => playSong(song, index, results)}
                  isPlaying={currentSong?._id === song._id && isPlaying}
                />
              ))}
            </div>
          ) : (
            // Message when no songs found
            <p className="text-gray-400">No real songs found in database yet...</p>
          )}
        </section>
      ) : (
        <>
          {/* Default Content when not searching */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Recent Searches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Synthwave Dreams", "Lofi Girl", "Chill Study Beats"].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl hover:bg-gray-50 cursor-pointer transition">
                  <span className="font-semibold text-gray-700">{item}</span>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              ))}
            </div>
          </section>

          {/* Recommended songs section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {STATIC_ALBUMS.map((album, index) => (
                <AlbumCard 
                  key={album.id} 
                  title={album.title} 
                  sub={album.sub} 
                  src={album.src} 
                  audioUrl={album.audioUrl} 
                  playSong={() => playSong(album, index, STATIC_ALBUMS)}
                  isPlaying={currentSong?.id === album.id && isPlaying}
                />
              ))}
            </div>
          </section>
        </>
      )}
      
      {/* Audio Player - Fixed at bottom when song is playing */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <audio
            ref={audioRef}
            src={currentSong.audioUrl}
            onEnded={playNext} // Auto-play next song when current ends
          />
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Song info display */}
            <div className="flex items-center gap-4">
              <img src={currentSong.src} alt={currentSong.title} className="w-12 h-12 rounded-lg" />
              <div>
                <h4 className="font-semibold text-gray-900">{currentSong.title}</h4>
                <p className="text-sm text-gray-500">{currentSong.sub}</p>
              </div>
            </div>
            
            {/* Playback controls */}
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
                className="p-3 bg-[#8b5cf6] text-white rounded-full hover:bg-[#7c3aed] transition-colors"
              >
                {isPlaying ? (
                  // Pause icon
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  // Play icon
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
            
            {/* Playlist position indicator */}
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {currentPlaylist.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * AlbumCard component: Reusable song card with play functionality
 * @param title Song title
 * @param sub Song subtitle/artist
 * @param src Cover image URL
 * @param audioUrl Audio file URL
 * @param playSong Function to play this song
 * @param isPlaying Whether this song is currently playing
 */
function AlbumCard({ title, sub, src, audioUrl, playSong, isPlaying }: any) {
  return (
    <div className="group cursor-pointer">
      <div 
        onClick={playSong}
        className={`relative aspect-square rounded-2xl mb-4 overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 ${
          isPlaying ? 'ring-2 ring-[#8b5cf6]' : '' // Purple ring when playing
        }`}
      >
        {/* Cover image */}
        <img src={src} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        
        {/* Hover overlay with play/pause button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white p-3 rounded-full text-[#8b5cf6] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            {isPlaying ? (
              // Pause icon for currently playing song
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-2 h-4 bg-[#8b5cf6] rounded-sm mr-0.5"></div>
                <div className="w-2 h-4 bg-[#8b5cf6] rounded-sm"></div>
              </div>
            ) : (
              // Play icon for other songs
              <Play size={20} fill="currentColor" />
            )}
          </div>
        </div>
      </div>
      
      {/* Song info text */}
      <h3 className="font-bold text-gray-900 leading-tight truncate">{title}</h3>
      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{sub}</p>
    </div>
  );
}