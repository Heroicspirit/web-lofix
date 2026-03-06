import { 
  createPlaylist, 
  getAllPlaylists, 
  getPlaylist, 
  updatePlaylist, 
  deletePlaylist, 
  addSongToPlaylist, 
  removeSongFromPlaylist, 
  getPlaylistSongs,
  CreatePlaylistData,
  UpdatePlaylistData
} from "../api/playlist";

export const handleCreatePlaylist = async (playlistData: CreatePlaylistData) => {
  try {
    const result = await createPlaylist(playlistData);
    if (result.success) {
      return {
        success: true,
        message: 'Playlist created successfully',
        data: result.data
      };
    }
    return { 
      success: false, 
      message: result.message || "Failed to create playlist"
    };
  } catch (err: Error | any) {
    return {
      success: false, 
      message: err.message || "Failed to create playlist"
    };
  }
};

export const handleGetAllPlaylists = async () => {
  try {
    const result = await getAllPlaylists();
    if (result.success) {
      // Transform backend data to match frontend interface
      const transformedPlaylists = result.data.map((playlist: any) => ({
        id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        isPublic: playlist.isPublic || false,
        coverColor: playlist.coverColor,
        songCount: playlist.songs ? playlist.songs.length : 0,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
        userId: playlist.userId
      }));
      
      return {
        success: true,
        message: 'Playlists fetched successfully',
        data: transformedPlaylists
      };
    }
    return { 
      success: false, 
      message: result.message || "Failed to fetch playlists"
    };
  } catch (err: Error | any) {
    return {
      success: false, 
      message: err.message || "Failed to fetch playlists"
    };
  }
};

export const handleGetPlaylist = async (playlistId: string) => {
  try {
    const result = await getPlaylist(playlistId);
    if (result.success) {
      return {
        success: true,
        message: 'Playlist fetched successfully',
        data: result.data
      };
    }
    return { 
      success: false, 
      message: result.message || "Failed to fetch playlist"
    };
  } catch (err: Error | any) {
    return {
      success: false, 
      message: err.message || "Failed to fetch playlist"
    };
  }
};

export const handleUpdatePlaylist = async (playlistId: string, playlistData: UpdatePlaylistData) => {
  try {
    const result = await updatePlaylist(playlistId, playlistData);
    if (result.success) {
      return {
        success: true,
        message: 'Playlist updated successfully',
        data: result.data
      };
    }
    return { 
      success: false, 
      message: result.message || "Failed to update playlist"
    };
  } catch (err: Error | any) {
    return {
      success: false, 
      message: err.message || "Failed to update playlist"
    };
  }
};

export const handleDeletePlaylist = async (playlistId: string) => {
  try {
    const result = await deletePlaylist(playlistId);
    if (result.success) {
      return {
        success: true,
        message: 'Playlist deleted successfully'
      };
    }
    return { 
      success: false, 
      message: result.message || "Failed to delete playlist"
    };
  } catch (err: Error | any) {
    return {
      success: false, 
      message: err.message || "Failed to delete playlist"
    };
  }
};

export const handleAddSongToPlaylist = async (playlistId: string, songId: string) => {
  try {
    const result = await addSongToPlaylist(playlistId, songId);
    if (result.success) {
      return {
        success: true,
        message: 'Song added to playlist successfully'
      };
    }
    return { 
      success: false, 
      message: result.message || "Failed to add song to playlist"
    };
  } catch (err: Error | any) {
    return {
      success: false, 
      message: err.message || "Failed to add song to playlist"
    };
  }
};

export const handleRemoveSongFromPlaylist = async (playlistId: string, songId: string) => {
  try {
    const result = await removeSongFromPlaylist(playlistId, songId);
    if (result.success) {
      return {
        success: true,
        message: 'Song removed from playlist successfully'
      };
    }
    return { 
      success: false, 
      message: result.message || "Failed to remove song from playlist"
    };
  } catch (err: Error | any) {
    return {
      success: false, 
      message: err.message || "Failed to remove song from playlist"
    };
  }
};

export const handleGetPlaylistSongs = async (playlistId: string) => {
  try {
    const result = await getPlaylistSongs(playlistId);
    if (result.success) {
      return {
        success: true,
        message: 'Playlist songs fetched successfully',
        data: result.data
      };
    }
    return { 
      success: false, 
      message: result.message || "Failed to fetch playlist songs"
    };
  } catch (err: Error | any) {
    return {
      success: false, 
      message: err.message || "Failed to fetch playlist songs"
    };
  }
};