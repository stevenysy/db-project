export type Song = {
  id: string;
  title: string;
  artist: string;
};

export type User = {
  id: number;
  username: string;
};

export type Playlist = {
  id: string;
  title: string;
  owner: string;
  likes: number;
  songs: Song[];
};

export type ApiSong = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  releaseDate: string | null;
};
