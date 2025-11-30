"use client";

import { useEffect, useState } from "react";

import { AddSongModal } from "./components/AddSongModal";
import { PlaylistCard } from "./components/PlaylistCard";
import { PlaylistModal } from "./components/PlaylistModal";
import type { ApiSong, Playlist } from "./types";

const user = {
  id: 1,
  username: "user_1",
};

export default function Home() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [isLoadingUserPlaylists, setIsLoadingUserPlaylists] = useState(true);
  const [userPlaylistsError, setUserPlaylistsError] = useState<string | null>(
    null
  );
  const [popularPlaylists, setPopularPlaylists] = useState<Playlist[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [popularError, setPopularError] = useState<string | null>(null);
  const [playlistForAddSong, setPlaylistForAddSong] = useState<Playlist | null>(
    null
  );

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/playlists`);
        if (!response.ok) {
          throw new Error("Failed to load your playlists");
        }

        const data: {
          playlists: Array<{
            id: number;
            name: string;
            likes: number;
            uploader: string;
            songs: Array<{ id: number; title: string; artist: string }>;
          }>;
        } = await response.json();

        const playlists = data.playlists.map((playlist) => ({
          id: playlist.id.toString(),
          title: playlist.name,
          owner: playlist.uploader,
          likes: playlist.likes,
          songs: playlist.songs.map((song) => ({
            id: song.id.toString(),
            title: song.title,
            artist: song.artist,
          })),
        }));

        setUserPlaylists(playlists);
        setUserPlaylistsError(null);
      } catch (error) {
        console.error(error);
        setUserPlaylistsError(
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching your playlists"
        );
      } finally {
        setIsLoadingUserPlaylists(false);
      }
    };

    fetchUserPlaylists();
  }, []);

  useEffect(() => {
    const fetchPopularPlaylists = async () => {
      try {
        const response = await fetch("/api/playlists/popular");
        if (!response.ok) {
          throw new Error("Failed to load popular playlists");
        }

        const data: {
          playlists: Array<{
            id: number;
            name: string;
            likes: number;
            uploader: string;
            songs: Array<{ id: number; title: string; artist: string }>;
          }>;
        } = await response.json();

        const playlists = data.playlists.map((playlist) => ({
          id: playlist.id.toString(),
          title: playlist.name,
          owner: playlist.uploader,
          likes: playlist.likes,
          songs: playlist.songs.map((song) => ({
            id: song.id.toString(),
            title: song.title,
            artist: song.artist,
          })),
        }));

        setPopularPlaylists(playlists);
        setPopularError(null);
      } catch (error) {
        console.error(error);
        setPopularError(
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching popular playlists"
        );
      } finally {
        setIsLoadingPopular(false);
      }
    };

    fetchPopularPlaylists();
  }, []);

  const handleCardClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleAddSongRequest = (playlist: Playlist) => {
    setSelectedPlaylist(null);
    setPlaylistForAddSong(playlist);
  };

  const closeModal = () => {
    setSelectedPlaylist(null);
  };

  const closeAddSongModal = () => {
    setPlaylistForAddSong(null);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddingSong, setIsAddingSong] = useState(false);

  const handleSongAdded = async (playlistId: string, song: ApiSong) => {
    try {
      setIsAddingSong(true);
      const response = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songId: song.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to add song to playlist");
      }

      setUserPlaylists((prev) =>
        prev.map((playlist) =>
          playlist.id === playlistId
            ? {
                ...playlist,
                songs: [
                  ...playlist.songs,
                  {
                    id: song.id.toString(),
                    title: song.title,
                    artist: song.artist,
                  },
                ],
              }
            : playlist
        )
      );

      setPopularPlaylists((prev) =>
        prev.map((playlist) =>
          playlist.id === playlistId
            ? {
                ...playlist,
                songs: [
                  ...playlist.songs,
                  {
                    id: song.id.toString(),
                    title: song.title,
                    artist: song.artist,
                  },
                ],
              }
            : playlist
        )
      );

      setSelectedPlaylist((current) =>
        current && current.id === playlistId
          ? {
              ...current,
              songs: [
                ...current.songs,
                {
                  id: song.id.toString(),
                  title: song.title,
                  artist: song.artist,
                },
              ],
            }
          : current
      );

      setToastMessage(`Added "${song.title}" to the playlist!`);
    } catch (error) {
      console.error(error);
      setToastMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while adding the song"
      );
    } finally {
      setIsAddingSong(false);
      setPlaylistForAddSong(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
        <header className="flex items-center gap-4 border-b border-zinc-200 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-300 text-xl font-semibold text-zinc-700">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-zinc-500">Logged in as</p>
            <h1 className="text-2xl font-semibold">{user.username}</h1>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-950">
                Your Playlists
              </h2>
              <span className="text-sm text-zinc-500">
                {userPlaylists.length} uploaded
              </span>
            </div>
            <div className="mt-5 flex flex-col gap-4">
              {isLoadingUserPlaylists && (
                <p className="text-sm text-zinc-500">Loading your playlists…</p>
              )}
              {userPlaylistsError && (
                <p className="text-sm text-red-500">{userPlaylistsError}</p>
              )}
              {!isLoadingUserPlaylists &&
                !userPlaylistsError &&
                (userPlaylists.length > 0 ? (
                  userPlaylists.map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      variant="user"
                      onSelect={handleCardClick}
                    />
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">
                    You have not uploaded any playlists yet.
                  </p>
                ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-950">
                Trending Playlists
              </h2>
              <span className="text-sm text-zinc-500">Top picks today</span>
            </div>
            <div className="mt-5 flex flex-col gap-4">
              {isLoadingPopular && (
                <p className="text-sm text-zinc-500">Loading playlists…</p>
              )}
              {popularError && (
                <p className="text-sm text-red-500">{popularError}</p>
              )}
              {!isLoadingPopular &&
                !popularError &&
                (popularPlaylists.length > 0 ? (
                  popularPlaylists.map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      variant="popular"
                      onSelect={handleCardClick}
                    />
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">
                    No playlists found yet. Check back later!
                  </p>
                ))}
            </div>
          </section>
        </div>
      </div>

      {selectedPlaylist && (
        <PlaylistModal
          playlist={selectedPlaylist}
          isOwner={selectedPlaylist.owner === user.username}
          onClose={closeModal}
          onAddSong={handleAddSongRequest}
        />
      )}

      {playlistForAddSong && (
        <AddSongModal
          playlist={playlistForAddSong}
          onClose={closeAddSongModal}
          onSongSelect={(song) => handleSongAdded(playlistForAddSong.id, song)}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-lg">
          {toastMessage}
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-3 text-xs text-zinc-300 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
