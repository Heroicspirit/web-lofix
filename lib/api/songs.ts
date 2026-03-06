import axios from "./axios";
import { API } from "./endpoints";

export interface Song {
  _id: string;
  title: string;
  artist: string | { _id: string; name: string; bio?: string };
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
    const response = await axios.get(`/api/songs/${id}`);
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
    const response = await axios.put(`/api/songs/${id}`, songData);
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
    const response = await axios.delete(`/api/songs/${id}`);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message
      || err.message
      || 'Failed to delete song'
    );
  }
};
