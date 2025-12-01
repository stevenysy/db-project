"use client";

import { SongCard } from "./SongCard";
import type { Playlist } from "../types";

type RecommendationsModalProps = {
  songs: Playlist["songs"];
  isLoading: boolean;
  error: string | null;
  message: string | null;
  topGenres: string[];
  onRetry: () => void;
  onClose: () => void;
};

export function RecommendationsModal({
  songs,
  isLoading,
  error,
  message,
  topGenres,
  onRetry,
  onClose,
}: RecommendationsModalProps) {
  const showSongs = !isLoading && !error && songs.length > 0;
  const showMessage = !isLoading && (message || (!showSongs && !error));

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
        aria-labelledby="recommendations-modal-title"
        className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="recommendations-modal-title"
              className="text-xl font-semibold text-zinc-950"
            >
              Recommended Songs
            </h3>
            {topGenres.length > 0 && (
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400">
                Based on your top genres: {topGenres.join(", ")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRetry}
              disabled={isLoading}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:text-zinc-300"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-white"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-6 min-h-[200px]">
          {isLoading && (
            <p className="text-sm text-zinc-500">Finding songs you may like…</p>
          )}

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {showMessage && message && (
            <p className="text-sm text-zinc-500">{message}</p>
          )}

          {showSongs && (
            <ul className="flex flex-col gap-3">
              {songs.map((song, index) => (
                <SongCard key={song.id} song={song} index={index} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

