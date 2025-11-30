"use client";

import { useState } from "react";

import type { ApiSong, Playlist } from "../types";

type AddSongModalProps = {
  playlist: Playlist;
  onClose: () => void;
  onSongSelect: (song: ApiSong) => void;
};

export function AddSongModal({
  playlist,
  onClose,
  onSongSelect,
}: AddSongModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApiSong[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const response = await fetch(`/api/songs/search?q=${encodeURIComponent(query.trim())}`);
      if (!response.ok) {
        throw new Error("Failed to search songs");
      }

      const data: { songs: ApiSong[] } = await response.json();
      setResults(data.songs);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Something went wrong while searching songs"
      );
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSongSelect = (song: ApiSong) => {
    onSongSelect(song);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-song-modal-title"
        className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl"
      >
        <h3
          id="add-song-modal-title"
          className="text-xl font-semibold text-zinc-950"
        >
          Add a song to {playlist.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Search for tracks by title. We’ll hook this up to a real action soon.
        </p>

        <form onSubmit={handleSearch} className="mt-6 flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="flex-1 rounded-2xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Search songs (e.g. Memories)"
          />
          <button
            type="submit"
            className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="mt-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!error && !isSearching && query && results.length === 0 && (
            <p className="text-sm text-zinc-500">No songs found. Try another search.</p>
          )}
          {results.length > 0 && (
            <ul className="mt-2 flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
              {results.map((song) => (
                <li
                  key={song.id}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {song.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {song.artist} · {song.genre}
                    </p>
                    {song.releaseDate && (
                      <p className="text-xs text-zinc-400">
                        Released {song.releaseDate}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSongSelect(song)}
                    className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-50"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 focus:ring-offset-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

