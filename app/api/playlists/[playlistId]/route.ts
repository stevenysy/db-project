"use server";

import { NextResponse } from "next/server";

import { getDbPool } from "@/app/lib/db";

type RouteContext = {
  params: Promise<{
    playlistId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { playlistId: playlistIdParam } = await context.params;
  const playlistId = Number(playlistIdParam);

  if (!Number.isInteger(playlistId) || playlistId <= 0) {
    return NextResponse.json(
      { error: "Invalid playlist id provided" },
      { status: 400 }
    );
  }

  try {
    const pool = await getDbPool();
    await pool.query(
      `
        DELETE FROM PLAYLIST
        WHERE playlist_id = ?
      `,
      [playlistId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      `[DELETE /api/playlists/${playlistId}] Failed to remove playlist`,
      error
    );
    return NextResponse.json(
      { error: "Failed to remove playlist" },
      { status: 500 }
    );
  }
}
