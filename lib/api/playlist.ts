import axios from "./axios";
import { API } from "./endpoints";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  coverColor?: string;
  songCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Song {
  _id: string;
  title: string;
  artist: string;
  duration: number;
  album?: string;
  coverImage?: string;
  audioUrl?: string;
  genre?: string[];
}

export interface CreatePlaylistData {
  name: string;
  description?: string;
  isPublic?: boolean;
  coverColor?: string;
}

export interface UpdatePlaylistData {
  name?: string;
  description?: string;
  isPublic?: boolean;
  coverColor?: string;
}

export const createPlaylist = async (playlistData: CreatePlaylistData) => {
  try {
    const response = await axios.post(API.USER.PLAYLIST.CREATE, playlistData);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to create playlist'
    );
  }
};

export const getAllPlaylists = async () => {
  try {
    const response = await axios.get(API.USER.PLAYLIST.GET_ALL);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to fetch playlists'
    );
  }
};

export const getPlaylist = async (playlistId: string) => {
  try {
    const response = await axios.get(API.USER.PLAYLIST.GET_ONE(playlistId));
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to fetch playlist'
    );
  }
};

export const updatePlaylist = async (playlistId: string, playlistData: UpdatePlaylistData) => {
  try {
    const response = await axios.put(API.USER.PLAYLIST.UPDATE(playlistId), playlistData);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to update playlist'
    );
  }
};

export const deletePlaylist = async (playlistId: string) => {
  try {
    const response = await axios.delete(API.USER.PLAYLIST.DELETE(playlistId));
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to delete playlist'
    );
  }
};

export const addSongToPlaylist = async (playlistId: string, songId: string) => {
  try {
    const response = await axios.post(API.USER.PLAYLIST.ADD_SONG(playlistId), { songId });
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to add song to playlist'
    );
  }
};

export const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
  try {
    const response = await axios.delete(API.USER.PLAYLIST.REMOVE_SONG(playlistId, songId));
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to remove song from playlist'
    );
  }
};

export const getPlaylistSongs = async (playlistId: string) => {
  try {
    const response = await axios.get(API.USER.PLAYLIST.GET_SONGS(playlistId));
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to fetch playlist songs'
    );
  }
};