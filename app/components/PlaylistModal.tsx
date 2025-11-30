"use client";

import type { Playlist } from "../types";

type PlaylistModalProps = {
  playlist: Playlist;
  isOwner: boolean;
  isMutating: boolean;
  onClose: () => void;
  onAddSong: (playlist: Playlist) => void;
  onRemoveSong: (playlist: Playlist, song: Playlist["songs"][number]) => void;
  onRemovePlaylist: (playlist: Playlist) => void;
};

export function PlaylistModal({
  playlist,
  isOwner,
  isMutating,
  onClose,
  onAddSong,
  onRemoveSong,
  onRemovePlaylist,
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAddSong(playlist)}
                disabled={isMutating}
                className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-sky-300"
              >
                Add Song
              </button>
              <button
                type="button"
                onClick={() => onRemovePlaylist(playlist)}
                disabled={isMutating}
                className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:border-red-100 disabled:text-red-300"
              >
                Remove Playlist
              </button>
            </div>
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
              {isOwner && (
                <button
                  type="button"
                  onClick={() => onRemoveSong(playlist, song)}
                  disabled={isMutating}
                  className="rounded-full p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
                  aria-label={`Remove ${song.title} from playlist`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M6 2a2 2 0 0 0-2 2v1H2.75a.75.75 0 0 0 0 1.5h.52l.58 8.12A2.75 2.75 0 0 0 6.59 17.2l.27.03h6.28a2.75 2.75 0 0 0 2.74-2.54l.58-8.2h.52a.75.75 0 0 0 0-1.5H16V4a2 2 0 0 0-2-2H6Zm7.5 3.5h-7l.5 8.5a1.25 1.25 0 0 0 1.25 1.16h3.5a1.25 1.25 0 0 0 1.25-1.16l.5-8.5ZM12 4v1.5H8V4h4Z" />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
