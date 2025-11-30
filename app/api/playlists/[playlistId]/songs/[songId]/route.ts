"use server";

import { NextResponse } from "next/server";

import { getDbPool } from "@/app/lib/db";

type RouteContext = {
  params: Promise<{
    playlistId: string;
    songId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { playlistId: playlistIdParam, songId: songIdParam } =
    await context.params;

  const playlistId = Number(playlistIdParam);
  const songId = Number(songIdParam);

  if (
    !Number.isInteger(playlistId) ||
    playlistId <= 0 ||
    !Number.isInteger(songId) ||
    songId <= 0
  ) {
    return NextResponse.json(
      { error: "Invalid playlist or song id provided" },
      { status: 400 }
    );
  }

  try {
    const pool = await getDbPool();
    await pool.query(
      `
        DELETE FROM PLAYLIST_SONGS
        WHERE playlist_id = ? AND song_id = ?
      `,
      [playlistId, songId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      `[DELETE /api/playlists/${playlistId}/songs/${songId}] Failed to remove song`,
      error
    );
    return NextResponse.json(
      { error: "Failed to remove song from playlist" },
      { status: 500 }
    );
  }
}
