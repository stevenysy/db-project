"use client";

import type { Playlist } from "../types";

type PlaylistCardProps = {
  playlist: Playlist;
  variant: "user" | "popular";
  onSelect: (playlist: Playlist) => void;
};

const variantStyles = {
  user: {
    borderHover: "hover:border-sky-400",
    ring: "focus:ring-sky-400",
    likesText: "text-sky-600",
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
}: PlaylistCardProps) {
  const styles = variantStyles[variant];

  const isPopular = variant === "popular";

  return (
    <button
      type="button"
      onClick={() => onSelect(playlist)}
      className={`flex w-full flex-col gap-2 rounded-2xl border border-zinc-200 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${styles.borderHover} ${styles.ring}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-zinc-950">
          {playlist.title}
        </span>
        <span className={`text-sm ${styles.likesText}`}>
          {playlist.likes} likes
        </span>
      </div>
      {isPopular ? (
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>By {playlist.owner}</span>
          <span>{playlist.songs.length} songs</span>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">{playlist.songs.length} songs</p>
      )}
    </button>
  );
}

