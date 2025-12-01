"use server";

import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

type LikedPlaylistRow = RowDataPacket & {
  playlist_id: number;
  name: string;
  number_of_likes: number;
  uploader_id: number | null;
  uploader_username: string | null;
};

export async function GET(_request: Request, context: RouteContext) {
  const { userId: userIdParam } = await context.params;
  const userId = Number(userIdParam);

  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json(
      { error: "Invalid user id provided" },
      { status: 400 }
    );
  }

  try {
    const pool = await getDbPool();

    const [rows] = await pool.query<LikedPlaylistRow[]>(
      `
        SELECT
          p.playlist_id,
          p.name,
          p.number_of_likes,
          p.uploader_id,
          u.username AS uploader_username
        FROM PLAYLIST_LIKES pl
        INNER JOIN PLAYLIST p ON p.playlist_id = pl.playlist_id
        LEFT JOIN USER u ON u.user_id = p.uploader_id
        WHERE pl.user_id = ?
        ORDER BY p.playlist_id ASC;
      `,
      [userId]
    );

    const likedPlaylists = rows.map((row) => ({
      id: row.playlist_id,
      name: row.name,
      likes: row.number_of_likes,
      uploaderId: row.uploader_id,
      uploader: row.uploader_username,
    }));

    return NextResponse.json({ likedPlaylists }, { status: 200 });
  } catch (error) {
    console.error(
      `[GET /api/users/${userId}/liked-playlists] Failed to fetch liked playlists`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch liked playlists" },
      { status: 500 }
    );
  }
}
