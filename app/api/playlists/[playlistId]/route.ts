"use server";

import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type RouteContext = {
  params: Promise<{
    playlistId: string;
  }>;
};

type UpdatePlaylistPayload = {
  name?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { playlistId: playlistIdParam } = await context.params;
  const playlistId = Number(playlistIdParam);

  if (!Number.isInteger(playlistId) || playlistId <= 0) {
    return NextResponse.json(
      { error: "Invalid playlist id provided" },
      { status: 400 }
    );
  }

  let body: UpdatePlaylistPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json(
      { error: "Playlist name is required" },
      { status: 400 }
    );
  }

  if (name.length > 50) {
    return NextResponse.json(
      { error: "Playlist name must be 50 characters or fewer" },
      { status: 400 }
    );
  }

  try {
    const pool = await getDbPool();
    const [result] = await pool.query<ResultSetHeader>(
      `
        UPDATE PLAYLIST
        SET name = ?
        WHERE playlist_id = ?
      `,
      [name, playlistId]
    );

    if (result.affectedRows === 0) {
      const [rows] = await pool.query<RowDataPacket[]>(
        `
          SELECT playlist_id
          FROM PLAYLIST
          WHERE playlist_id = ?
        `,
        [playlistId]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Playlist not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        playlist: {
          id: playlistId,
          name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `[PATCH /api/playlists/${playlistId}] Failed to rename playlist`,
      error
    );
    return NextResponse.json(
      { error: "Failed to rename playlist" },
      { status: 500 }
    );
  }
}

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
