"use client";

import type { Playlist } from "../types";

type PlaylistCardProps = {
  playlist: Playlist;
  variant: "user" | "liked" | "popular";
  onSelect: (playlist: Playlist) => void;
  showLikeButton?: boolean;
  isLiked?: boolean;
  onToggleLike?: (playlist: Playlist) => void;
  isMutating?: boolean;
};

const variantStyles = {
  user: {
    borderHover: "hover:border-sky-400",
    ring: "focus:ring-sky-400",
    likesText: "text-sky-600",
  },
  liked: {
    borderHover: "hover:border-violet-400",
    ring: "focus:ring-violet-400",
    likesText: "text-violet-500",
  },
  popular: {
    borderHover: "hover:border-emerald-400",
    ring: "focus:ring-emerald-400",
    likesText: "text-emerald-500",
  },
} as const;

export function PlaylistCard({
  playlist,
  variant,
  onSelect,
  showLikeButton = false,
  isLiked = false,
  onToggleLike,
  isMutating = false,
}: PlaylistCardProps) {
  const styles = variantStyles[variant];

  const showOwnerDetails = variant !== "user";

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(playlist);
    }
  };

  return (
    <div
      onClick={() => onSelect(playlist)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`flex w-full cursor-pointer flex-col gap-2 rounded-2xl border border-zinc-200 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${styles.borderHover} ${styles.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-base font-medium text-zinc-950">
            {playlist.title}
          </span>
          <span className={`text-sm ${styles.likesText}`}>
            {playlist.likes} {playlist.likes === 1 ? "like" : "likes"}
          </span>
        </div>
        {showLikeButton && onToggleLike && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (isMutating) return;
              onToggleLike(playlist);
            }}
            disabled={isMutating}
            className={`rounded-full p-2 transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white ${
              isLiked
                ? "text-emerald-500 hover:text-emerald-600"
                : "text-zinc-300 hover:text-emerald-400"
            } disabled:cursor-not-allowed disabled:text-zinc-200`}
            aria-label={
              isLiked ? "Remove like from playlist" : "Like this playlist"
            }
          >
            {isLiked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M11.645 20.91a.75.75 0 0 0 .71 0c1.258-.69 2.4-1.55 3.497-2.428 1.456-1.18 2.82-2.444 3.977-3.916 1.148-1.46 2.171-3.153 2.171-5.1 0-2.815-2.205-5-4.996-5-1.676 0-3.083.904-3.994 2.09-.911-1.186-2.318-2.09-3.994-2.09-2.79 0-4.996 2.185-4.996 5 0 1.947 1.023 3.641 2.17 5.1 1.158 1.472 2.522 2.736 3.978 3.916 1.097.879 2.24 1.739 3.497 2.428Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M16.5 3.75c-1.676 0-3.083.904-3.994 2.09-.911-1.186-2.318-2.09-3.994-2.09-2.79 0-4.996 2.185-4.996 5 0 1.947 1.023 3.641 2.17 5.1 1.158 1.472 2.522 2.736 3.978 3.916 1.097.879 2.24 1.739 3.497 2.428a.75.75 0 0 0 .71 0c1.258-.69 2.4-1.55 3.497-2.428 1.456-1.18 2.82-2.444 3.977-3.916 1.148-1.46 2.171-3.153 2.171-5.1 0-2.815-2.205-5-4.996-5Z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {showOwnerDetails ? (
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>By {playlist.owner}</span>
          <span>{playlist.songs.length} songs</span>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">{playlist.songs.length} songs</p>
      )}
    </div>
  );
}
