"use client";

import type { ReactNode } from "react";

import type { Playlist } from "../types";

type SongCardProps = {
  song: Playlist["songs"][number];
  index?: number;
  action?: ReactNode;
};

export function SongCard({ song, index, action }: SongCardProps) {
  const position =
    typeof index === "number" && Number.isFinite(index) ? index + 1 : null;

  return (
    <li className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-zinc-900">
          {position ? `${position}. ` : ""}
          {song.title}
        </p>
        <p className="text-xs text-zinc-500">{song.artist}</p>
      </div>
      {action}
    </li>
  );
}
