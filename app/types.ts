export type Song = {
  id: string;
  title: string;
  artist: string;
};

export type Playlist = {
  id: string;
  title: string;
  owner: string;
  likes: number;
  songs: Song[];
};

