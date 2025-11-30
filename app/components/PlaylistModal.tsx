"use client";

import type { Playlist } from "../types";

type PlaylistModalProps = {
  playlist: Playlist;
  isOwner: boolean;
  onClose: () => void;
  onAddSong: (playlist: Playlist) => void;
};

export function PlaylistModal({
  playlist,
  isOwner,
  onClose,
  onAddSong,
}: PlaylistModalProps) {
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
        aria-labelledby="playlist-modal-title"
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="playlist-modal-title"
              className="text-xl font-semibold text-zinc-950"
            >
              {playlist.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {playlist.likes} likes · Curated by {playlist.owner}
            </p>
          </div>
          {isOwner ? (
            <button
              type="button"
              onClick={() => onAddSong(playlist)}
              className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
            >
              Add Song
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
            >
              Close
            </button>
          )}
        </div>

        <ul className="mt-6 flex flex-col gap-3">
          {playlist.songs.map((song, index) => (
            <li
              key={song.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {index + 1}. {song.title}
                </p>
                <p className="text-xs text-zinc-500">{song.artist}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
