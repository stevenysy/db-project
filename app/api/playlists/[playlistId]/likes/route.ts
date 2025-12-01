"use server";

import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type RouteContext = {
  params: Promise<{
    playlistId: string;
  }>;
};

type PlaylistRow = RowDataPacket & {
  uploader_id: number | null;
  number_of_likes: number;
};

type LikePayload = {
  userId?: number;
};

async function getValidatedIds(
  context: RouteContext,
  request: Request,
): Promise<{ playlistId: number; userId: number }> {
  const { playlistId: playlistIdParam } = await context.params;
  const playlistId = Number(playlistIdParam);

  if (!Number.isInteger(playlistId) || playlistId <= 0) {
    throw NextResponse.json(
      { error: "Invalid playlist id provided" },
      { status: 400 },
    );
  }

  let body: LikePayload;
  try {
    body = await request.json();
  } catch (error) {
    throw NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const userId = Number(body.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw NextResponse.json(
      { error: "Invalid user id provided" },
      { status: 400 },
    );
  }

  return { playlistId, userId };
}

async function fetchPlaylist(
  playlistId: number,
): Promise<PlaylistRow | null> {
  const pool = await getDbPool();
  const [rows] = await pool.query<PlaylistRow[]>(
    `
      SELECT uploader_id, number_of_likes
      FROM PLAYLIST
      WHERE playlist_id = ?
    `,
    [playlistId],
  );

  return rows[0] ?? null;
}

export async function POST(request: Request, context: RouteContext) {
  let ids: { playlistId: number; userId: number };

  try {
    ids = await getValidatedIds(context, request);
  } catch (response) {
    return response as NextResponse;
  }

  const { playlistId, userId } = ids;

  try {
    const playlistRow = await fetchPlaylist(playlistId);
    if (!playlistRow) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 },
      );
    }

    if (playlistRow.uploader_id === userId) {
      return NextResponse.json(
        { error: "You cannot like your own playlist" },
        { status: 400 },
      );
    }

    const pool = await getDbPool();

    try {
      await pool.query<ResultSetHeader>(
        `
          INSERT INTO PLAYLIST_LIKES (playlist_id, user_id)
          VALUES (?, ?)
        `,
        [playlistId, userId],
      );
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ER_DUP_ENTRY"
      ) {
        const [countRows] = await pool.query<RowDataPacket[]>(
          `
            SELECT number_of_likes
            FROM PLAYLIST
            WHERE playlist_id = ?
          `,
          [playlistId],
        );

        const likes =
          countRows[0]?.number_of_likes ?? playlistRow.number_of_likes;

        return NextResponse.json({ likes }, { status: 200 });
      }
      throw error;
    }

    await pool.query(
      `
        UPDATE PLAYLIST
        SET number_of_likes = number_of_likes + 1
        WHERE playlist_id = ?
      `,
      [playlistId],
    );

    const [countRows] = await pool.query<RowDataPacket[]>(
      `
        SELECT number_of_likes
        FROM PLAYLIST
        WHERE playlist_id = ?
      `,
      [playlistId],
    );

    const likes = countRows[0]?.number_of_likes ?? playlistRow.number_of_likes + 1;

    return NextResponse.json({ likes }, { status: 201 });
  } catch (error) {
    console.error(
      `[POST /api/playlists/${playlistId}/likes] Failed to add like`,
      error,
    );
    return NextResponse.json(
      { error: "Failed to like playlist" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  let ids: { playlistId: number; userId: number };

  try {
    ids = await getValidatedIds(context, request);
  } catch (response) {
    return response as NextResponse;
  }

  const { playlistId, userId } = ids;

  try {
    const playlistRow = await fetchPlaylist(playlistId);
    if (!playlistRow) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 },
      );
    }

    const pool = await getDbPool();

    const [result] = await pool.query<ResultSetHeader>(
      `
        DELETE FROM PLAYLIST_LIKES
        WHERE playlist_id = ? AND user_id = ?
      `,
      [playlistId, userId],
    );

    if (result.affectedRows === 0) {
      const [countRows] = await pool.query<RowDataPacket[]>(
        `
          SELECT number_of_likes
          FROM PLAYLIST
          WHERE playlist_id = ?
        `,
        [playlistId],
      );

      const likes = countRows[0]?.number_of_likes ?? playlistRow.number_of_likes;

      return NextResponse.json({ likes }, { status: 200 });
    }

    await pool.query(
      `
        UPDATE PLAYLIST
        SET number_of_likes = CASE
          WHEN number_of_likes > 0 THEN number_of_likes - 1
          ELSE 0
        END
        WHERE playlist_id = ?
      `,
      [playlistId],
    );

    const [countRows] = await pool.query<RowDataPacket[]>(
      `
        SELECT number_of_likes
        FROM PLAYLIST
        WHERE playlist_id = ?
      `,
      [playlistId],
    );

    const likes = countRows[0]?.number_of_likes ?? 0;

    return NextResponse.json({ likes });
  } catch (error) {
    console.error(
      `[DELETE /api/playlists/${playlistId}/likes] Failed to remove like`,
      error,
    );
    return NextResponse.json(
      { error: "Failed to remove like from playlist" },
      { status: 500 },
    );
  }
}

