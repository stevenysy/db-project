"use client";

import { useState } from "react";

type CreatePlaylistModalProps = {
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
};

export function CreatePlaylistModal({
  onClose,
  onSubmit,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Please enter a playlist name.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(trimmed);
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the playlist.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
        aria-labelledby="create-playlist-modal-title"
        className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
      >
        <h3
          id="create-playlist-modal-title"
          className="text-xl font-semibold text-zinc-950"
        >
          Create a new playlist
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Give your playlist a name. You can add songs after creating it.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="playlist-name"
              className="block text-sm font-medium text-zinc-700"
            >
              Playlist name
            </label>
            <input
              id="playlist-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              maxLength={50}
              className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:cursor-not-allowed disabled:bg-zinc-100"
              placeholder="e.g. Finals Study Jams"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isSubmitting ? "Creating…" : "Create Playlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

