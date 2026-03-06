"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Music2, Plus, Trash2, ArrowLeft, Search, X } from "lucide-react";
import { handleGetPlaylist, handleGetPlaylistSongs, handleRemoveSongFromPlaylist, handleAddSongToPlaylist } from "@/lib/actions/playlist-action";
import { Playlist, Song } from "@/lib/api/playlist";
import { getAllSongs, Song as SongType } from "@/lib/api/songs";

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;
  
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<SongType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [availableSongs, setAvailableSongs] = useState<SongType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        console.log("Fetching playlist with ID:", playlistId);
        const [playlistResult, songsResult] = await Promise.all([
          handleGetPlaylist(playlistId),
          handleGetPlaylistSongs(playlistId)
        ]);

        console.log("Playlist result:", playlistResult);
        console.log("Songs result:", songsResult);

        if (playlistResult.success) {
          setPlaylist(playlistResult.data);
        }
        
        if (songsResult.success) {
          setSongs(songsResult.data || []);
        }
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [playlistId]);

  const handleRemoveSong = async (songId: string) => {
    try {
      const result = await handleRemoveSongFromPlaylist(playlistId, songId);
      if (result.success) {
        setSongs(prev => prev.filter(song => song._id !== songId));
        if (playlist) {
          setPlaylist((prev: Playlist | null) => prev ? {...prev, songCount: prev.songCount - 1} : null);
        }
      }
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  const loadAvailableSongs = async () => {
    setLoadingSongs(true);
    try {
      console.log("Loading available songs...");
      const result = await getAllSongs();
      console.log("All songs result:", result);
      console.log("Result data type:", typeof result.data);
      console.log("Result data:", result.data);
      
      if (result.success && Array.isArray(result.data)) {
        // Filter out songs that are already in the playlist
        const currentSongIds = songs.map(song => song._id?.toString());
        console.log("Current playlist songs:", currentSongIds);
        
        const filteredSongs = result.data.filter((song: SongType) => {
          const songId = song._id?.toString();
          return !currentSongIds.includes(songId);
        });
        console.log("Filtered songs:", filteredSongs);
        
        setAvailableSongs(filteredSongs);
      } else {
        console.error("Songs data is not an array:", result.data);
      }
    } catch (error) {
      console.error("Error loading songs:", error);
    } finally {
      setLoadingSongs(false);
    }
  };

  const handleAddSongs = async () => {
    if (selectedSongs.length === 0) return;
    
    try {
      // Add each selected song to the playlist
      for (const songId of selectedSongs) {
        await handleAddSongToPlaylist(playlistId, songId);
      }
      
      // Refresh playlist data
      const songsResult = await handleGetPlaylistSongs(playlistId);
      if (songsResult.success) {
        setSongs(songsResult.data || []);
        if (playlist) {
          setPlaylist((prev: Playlist | null) => prev ? {...prev, songCount: prev.songCount + selectedSongs.length} : null);
        }
      }
      
      // Close modal and reset selection
      setShowAddSongModal(false);
      setSelectedSongs([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding songs:", error);
    }
  };

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const filteredSongs = availableSongs.filter(song => {
    const artistName = typeof song.artist === 'string' ? song.artist : song.artist?.name || '';
    return song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artistName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">Loading playlist...</div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">Playlist not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Library
        </button>

        <div className="flex items-end gap-8 mb-8">
          <div className={`w-48 h-48 rounded-xl bg-gradient-to-br ${playlist.coverColor || "from-blue-500 to-purple-500"} flex items-center justify-center shadow-2xl`}>
            <Music2 size={64} className="text-white/20" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{playlist.name}</h1>
            <p className="text-zinc-400 mb-4">
              {playlist.songCount} songs • {playlist.isPublic ? "Public" : "Private"}
            </p>
            {playlist.description && (
              <p className="text-zinc-300">{playlist.description}</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900/40 rounded-xl">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Songs</h2>
              <button
                onClick={() => {
                  setShowAddSongModal(true);
                  loadAvailableSongs();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Add Songs
              </button>
            </div>
          </div>

          {songs.length === 0 ? (
            <div className="p-12 text-center">
              <Music2 size={48} className="text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">No songs in this playlist yet</p>
              <p className="text-zinc-500 text-sm mt-2">Click "Add Songs" to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {songs.map((song, index) => {
                console.log("Rendering song:", song);
                return (
                <div key={`${song._id}_${index}`} className="p-4 hover:bg-zinc-800/40 transition-colors group">
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-500 w-6 text-center">{index + 1}</span>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{song.title}</h3>
                      <p className="text-zinc-400 text-sm">{typeof song.artist === 'string' ? song.artist : song.artist?.name || 'Unknown Artist'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-400 text-sm">{formatDuration(song.duration)}</span>
                      <button
                        onClick={() => handleRemoveSong(song._id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>

        {showAddSongModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Add Songs to Playlist</h3>
                <button
                  onClick={() => setShowAddSongModal(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mb-4">
                {loadingSongs ? (
                  <div className="text-center py-8">
                    <div className="text-zinc-400">Loading songs...</div>
                  </div>
                ) : filteredSongs.length === 0 ? (
                  <div className="text-center py-8">
                    <Music2 size={48} className="text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">
                      {searchTerm ? "No songs found matching your search" : "No additional songs available"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredSongs.map((song) => (
                      <div
                        key={song._id}
                        onClick={() => toggleSongSelection(song._id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedSongs.includes(song._id)
                            ? 'bg-blue-500/20 border border-blue-500'
                            : 'bg-zinc-800 hover:bg-zinc-700 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSongs.includes(song._id)}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-500 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{song.title}</h4>
                          <p className="text-zinc-400 text-sm">{typeof song.artist === 'string' ? song.artist : song.artist?.name || 'Unknown Artist'}</p>
                        </div>
                        <span className="text-zinc-400 text-sm">
                          {formatDuration(song.duration)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddSongModal(false)}
                  className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSongs}
                  disabled={selectedSongs.length === 0}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    selectedSongs.length === 0
                      ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Add {selectedSongs.length} {selectedSongs.length === 1 ? 'Song' : 'Songs'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}