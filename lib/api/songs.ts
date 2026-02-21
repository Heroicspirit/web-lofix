import axios from "./axios";
import { API } from "./endpoints";

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

export const getAllSongs = async () => {
  try {
    const response = await axios.get('/api/songs');
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to fetch songs'
    );
  }
};

export const getSong = async (id: string) => {
  try {
    const response = await axios.get(API.ADMIN.SONG.GET_ONE(id));
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to fetch song'
    );
  }
};

export const updateSong = async (id: string, songData: Partial<Song>) => {
  try {
    const response = await axios.put(API.ADMIN.SONG.UPDATE(id), songData);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to update song'
    );
  }
};

export const deleteSong = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.SONG.DELETE(id));
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to delete song'
    );
  }
};
