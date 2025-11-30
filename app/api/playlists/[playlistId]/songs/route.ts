"use server";

import { NextResponse } from "next/server";

import { getDbPool } from "@/app/lib/db";

type RouteContext = {
  params: Promise<{
    playlistId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { playlistId: playlistIdParam } = await context.params;
  const playlistId = Number(playlistIdParam);

  if (!Number.isInteger(playlistId) || playlistId <= 0) {
    return NextResponse.json(
      { error: "Invalid playlist id provided" },
      { status: 400 },
    );
  }

  let body: { songId?: number } = {};
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (!body.songId || !Number.isInteger(body.songId) || body.songId <= 0) {
    return NextResponse.json(
      { error: "Invalid song id provided" },
      { status: 400 },
    );
  }

  try {
    const pool = await getDbPool();
    await pool.query(
      `
        INSERT INTO PLAYLIST_SONGS (playlist_id, song_id)
        VALUES (?, ?)
      `,
      [playlistId, body.songId],
    );

    return NextResponse.json(
      { success: true },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      `[POST /api/playlists/${playlistId}/songs] Failed to add song`,
      error,
    );
    return NextResponse.json(
      { error: "Failed to add song to playlist" },
      { status: 500 },
    );
  }
}

