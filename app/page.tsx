"use client";

import { FormEvent, useEffect, useState } from "react";

import { useUser } from "@/app/context/UserContext";

import { AddSongModal } from "./components/AddSongModal";
import { CreatePlaylistModal } from "./components/CreatePlaylistModal";
import { PlaylistCard } from "./components/PlaylistCard";
import { PlaylistModal } from "./components/PlaylistModal";
import type { ApiSong, Playlist } from "./types";

export default function Home() {
  const { user, login, logout, isLoggingIn } = useUser();
  const [usernameInput, setUsernameInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [likedPlaylistIds, setLikedPlaylistIds] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    if (!user) {
      setUserPlaylists([]);
      setUserPlaylistsError(null);
      setIsLoadingUserPlaylists(false);
      return;
    }

    const userId = user.id;

    const fetchUserPlaylists = async () => {
      setIsLoadingUserPlaylists(true);
      try {
        const response = await fetch(`/api/users/${userId}/playlists`);
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
  }, [user]);

  useEffect(() => {
    if (!user) {
      setPopularPlaylists([]);
      setPopularError(null);
      setIsLoadingPopular(false);
      return;
    }

    const fetchPopularPlaylists = async () => {
      setIsLoadingPopular(true);
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
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLikedPlaylistIds(new Set());
      return;
    }

    const userId = user.id;

    const fetchLikedPlaylists = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/liked-playlists`);
        if (!response.ok) {
          throw new Error("Failed to load liked playlists");
        }

        const data: {
          likedPlaylists: Array<{ id: number }>;
        } = await response.json();

        setLikedPlaylistIds(
          new Set(data.likedPlaylists.map((playlist) => playlist.id.toString()))
        );
      } catch (error) {
        console.error(error);
        // Leave likedPlaylistIds unchanged on failure.
      }
    };

    fetchLikedPlaylists();
  }, [user]);

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);

    try {
      await login(usernameInput);
      setUsernameInput("");
    } catch (error) {
      console.error(error);
      setLoginError(
        error instanceof Error ? error.message : "Failed to log in."
      );
    }
  };

  const handleCardClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleToggleLike = async (playlist: Playlist) => {
    if (!user) {
      setToastMessage("Please log in to like playlists.");
      return;
    }

    setIsMutating(true);
    const currentlyLiked = likedPlaylistIds.has(playlist.id);
    const nextLiked = !currentlyLiked;
    try {
      const response = await fetch(`/api/playlists/${playlist.id}/likes`, {
        method: nextLiked ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          (result && result.error) ||
          (nextLiked
            ? "Failed to like playlist"
            : "Failed to remove like from playlist");
        throw new Error(message);
      }

      const likes =
        typeof result.likes === "number"
          ? result.likes
          : Math.max(0, playlist.likes + (nextLiked ? 1 : -1));

      setLikedPlaylistIds((prev) => {
        const updated = new Set(prev);
        if (nextLiked) {
          updated.add(playlist.id);
        } else {
          updated.delete(playlist.id);
        }
        return updated;
      });

      setPopularPlaylists((prev) => {
        const updated = prev.map((item) =>
          item.id === playlist.id
            ? {
                ...item,
                likes,
              }
            : item
        );
        return [...updated].sort(
          (a, b) => b.likes - a.likes || Number(a.id) - Number(b.id)
        );
      });

      setSelectedPlaylist((current) =>
        current && current.id === playlist.id
          ? {
              ...current,
              likes,
            }
          : current
      );

      setToastMessage(
        nextLiked
          ? `Liked "${playlist.title}".`
          : `Removed like from "${playlist.title}".`
      );
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the like";
      setToastMessage(message);
    } finally {
      setIsMutating(false);
    }
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
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    if (user) {
      return;
    }

    setSelectedPlaylist(null);
    setPlaylistForAddSong(null);
    setIsCreateModalOpen(false);
    setToastMessage(null);
    setIsMutating(false);
  }, [user]);

  const handleCreatePlaylist = async (name: string) => {
    if (!user) {
      setToastMessage("Please log in to create playlists.");
      return;
    }

    setIsMutating(true);
    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, uploaderId: user.id }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = (result && result.error) || "Failed to create playlist";
        throw new Error(message);
      }

      const newPlaylist: Playlist = {
        id: result.playlist.id.toString(),
        title: result.playlist.name,
        owner: user.username,
        likes: result.playlist.number_of_likes,
        songs: [],
      };

      setUserPlaylists((prev) => [newPlaylist, ...prev]);
      setSelectedPlaylist(newPlaylist);
      setPlaylistForAddSong(null);
      setIsCreateModalOpen(false);
      setToastMessage(`Created "${newPlaylist.title}".`);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the playlist";
      setToastMessage(message);
      throw error instanceof Error ? error : new Error(message);
    } finally {
      setIsMutating(false);
    }
  };

  const handleSongAdded = async (playlistId: string, song: ApiSong) => {
    setIsMutating(true);
    try {
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

      setPlaylistForAddSong(null);
      setToastMessage(`Added "${song.title}" to the playlist!`);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while adding the song";
      setToastMessage(message);
      throw new Error(message);
    } finally {
      setIsMutating(false);
    }
  };

  const handleSongRemoved = async (
    playlist: Playlist,
    song: Playlist["songs"][number]
  ) => {
    setIsMutating(true);
    try {
      const response = await fetch(
        `/api/playlists/${playlist.id}/songs/${song.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove song from playlist");
      }

      setUserPlaylists((prev) =>
        prev.map((current) =>
          current.id === playlist.id
            ? {
                ...current,
                songs: current.songs.filter((item) => item.id !== song.id),
              }
            : current
        )
      );

      setPopularPlaylists((prev) =>
        prev.map((current) =>
          current.id === playlist.id
            ? {
                ...current,
                songs: current.songs.filter((item) => item.id !== song.id),
              }
            : current
        )
      );

      setSelectedPlaylist((current) =>
        current && current.id === playlist.id
          ? {
              ...current,
              songs: current.songs.filter((item) => item.id !== song.id),
            }
          : current
      );

      setToastMessage(`Removed "${song.title}" from the playlist.`);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while removing the song";
      setToastMessage(message);
    } finally {
      setIsMutating(false);
    }
  };

  const handlePlaylistRemoved = async (playlist: Playlist) => {
    setIsMutating(true);
    try {
      const response = await fetch(`/api/playlists/${playlist.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove playlist");
      }

      setUserPlaylists((prev) =>
        prev.filter((current) => current.id !== playlist.id)
      );

      setPopularPlaylists((prev) =>
        prev.filter((current) => current.id !== playlist.id)
      );

      setSelectedPlaylist((current) =>
        current && current.id === playlist.id ? null : current
      );

      setPlaylistForAddSong((current) =>
        current && current.id === playlist.id ? null : current
      );

      setLikedPlaylistIds((prev) => {
        if (!prev.has(playlist.id)) {
          return prev;
        }
        const updated = new Set(prev);
        updated.delete(playlist.id);
        return updated;
      });

      setToastMessage(`Deleted "${playlist.title}".`);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while removing the playlist";
      setToastMessage(message);
    } finally {
      setIsMutating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-100 text-zinc-900">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-10">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold text-zinc-950">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Enter your username to get started. We will create an account if
              it does not exist yet.
            </p>
            <form
              className="mt-6 flex flex-col gap-4"
              onSubmit={handleLoginSubmit}
            >
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Username
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(event) => setUsernameInput(event.target.value)}
                  placeholder="e.g. music_fan"
                  autoFocus
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base text-zinc-950 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              {loginError && (
                <p className="text-sm text-red-500" role="alert">
                  {loginError}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {isLoggingIn ? "Logging in…" : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-300 text-xl font-semibold text-zinc-700">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-zinc-500">Logged in as</p>
              <h1 className="text-2xl font-semibold">{user.username}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 focus:ring-offset-white"
          >
            Log out
          </button>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-950">
                Your Playlists
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                disabled={isMutating}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                + New Playlist
              </button>
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
                      showLikeButton={playlist.owner !== user.username}
                      isLiked={likedPlaylistIds.has(playlist.id)}
                      onToggleLike={handleToggleLike}
                      isMutating={isMutating}
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
          isMutating={isMutating}
          onClose={closeModal}
          onAddSong={handleAddSongRequest}
          onRemoveSong={handleSongRemoved}
          onRemovePlaylist={handlePlaylistRemoved}
        />
      )}

      {playlistForAddSong && (
        <AddSongModal
          playlist={playlistForAddSong}
          onClose={closeAddSongModal}
          onSongSelect={(song) => handleSongAdded(playlistForAddSong.id, song)}
        />
      )}

      {isCreateModalOpen && (
        <CreatePlaylistModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePlaylist}
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
