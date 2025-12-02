"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent } from "react";

import { SongCard } from "./SongCard";
import type { Playlist } from "../types";

type PlaylistModalProps = {
  playlist: Playlist;
  isOwner: boolean;
  isMutating: boolean;
  onClose: () => void;
  onAddSong: (playlist: Playlist) => void;
  onRemoveSong: (playlist: Playlist, song: Playlist["songs"][number]) => void;
  onRemovePlaylist: (playlist: Playlist) => void;
  onRenamePlaylist: (
    playlist: Playlist,
    title: string,
  ) => Promise<void>;
};

export function PlaylistModal({
  playlist,
  isOwner,
  isMutating,
  onClose,
  onAddSong,
  onRemoveSong,
  onRemovePlaylist,
  onRenamePlaylist,
}: PlaylistModalProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(playlist.title);
  const [titleError, setTitleError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleDraft(playlist.title);
  }, [playlist.title]);

  useEffect(() => {
    setIsEditingTitle(false);
    setTitleError(null);
    setTitleDraft(playlist.title);
  }, [playlist.id]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (titleError) {
      setTitleError(null);
    }
  }, [titleDraft]);

  const handleTitleClick = () => {
    if (!isOwner || isMutating) {
      return;
    }
    setIsEditingTitle(true);
    setTitleDraft(playlist.title);
  };

  const handleCancelRename = () => {
    setIsEditingTitle(false);
    setTitleDraft(playlist.title);
    setTitleError(null);
  };

  const handleConfirmRename = async () => {
    if (isMutating) {
      return;
    }

    const nextTitle = titleDraft.trim();

    if (!nextTitle) {
      setTitleError("Playlist name cannot be empty.");
      titleInputRef.current?.focus();
      return;
    }

    if (nextTitle.length > 50) {
      setTitleError("Playlist name must be 50 characters or fewer.");
      titleInputRef.current?.focus();
      return;
    }

    if (nextTitle === playlist.title) {
      setIsEditingTitle(false);
      setTitleError(null);
      return;
    }

    try {
      await onRenamePlaylist(playlist, nextTitle);
      setTitleDraft(nextTitle);
      setIsEditingTitle(false);
      setTitleError(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to rename playlist.";
      setTitleError(message);
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  };

  const handleTitleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleConfirmRename();
  };

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancelRename();
    }
  };

  const trimmedDraft = titleDraft.trim();
  const inlineValidationMessage =
    trimmedDraft.length > 50
      ? "Playlist name must be 50 characters or fewer."
      : null;
  const displayedTitleError = titleError ?? inlineValidationMessage;
  const isSaveDisabled =
    isMutating ||
    trimmedDraft === playlist.title ||
    trimmedDraft.length === 0 ||
    inlineValidationMessage !== null;

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
          <div className="flex-1">
            <div className="relative inline-block">
              <h3
                id="playlist-modal-title"
                className={`text-xl font-semibold text-zinc-950 ${
                  isOwner && isEditingTitle ? "invisible" : ""
                }`}
              >
                {isEditingTitle ? titleDraft : playlist.title}
              </h3>
              {isOwner && !isEditingTitle ? (
                <button
                  type="button"
                  onClick={handleTitleClick}
                  disabled={isMutating}
                  className="absolute inset-0 rounded focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed"
                  aria-label="Rename playlist"
                  title="Click to rename playlist"
                />
              ) : null}
            </div>

            {isOwner && isEditingTitle ? (
              <form
                onSubmit={handleTitleSubmit}
                className="mt-2 flex flex-wrap items-center gap-2"
              >
                <label htmlFor="playlist-title-input" className="sr-only">
                  Playlist name
                </label>
                <input
                  id="playlist-title-input"
                  ref={titleInputRef}
                  type="text"
                  value={titleDraft}
                  onChange={(event) => setTitleDraft(event.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-base text-zinc-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
                  disabled={isMutating}
                  aria-invalid={displayedTitleError ? "true" : "false"}
                />
                <button
                  type="submit"
                  disabled={isSaveDisabled}
                  className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-sky-300"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelRename}
                  disabled={isMutating}
                  className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:text-zinc-300"
                >
                  Cancel
                </button>
              </form>
            ) : null}

            {displayedTitleError ? (
              <p className="mt-2 text-sm text-red-500">
                {displayedTitleError}
              </p>
            ) : null}

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
            <SongCard
              key={song.id}
              song={song}
              index={index}
              action={
                isOwner ? (
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
                ) : undefined
              }
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
