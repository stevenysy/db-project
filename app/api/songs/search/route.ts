"use server";

import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type SongSearchRow = RowDataPacket & {
  song_id: number;
  song_name: string;
  artist_name: string | null;
  genre: string;
  release_date: Date | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Missing song query parameter `q`" },
      { status: 400 }
    );
  }

  try {
    const pool = await getDbPool();
    const likeQuery = `%${query}%`;

    const [rows] = await pool.query<SongSearchRow[]>(
      `
        SELECT
          s.song_id,
          s.name AS song_name,
          s.genre,
          s.release_date,
          a.name AS artist_name
        FROM SONG s
        LEFT JOIN ARTIST a ON a.artist_id = s.artist_id
        WHERE s.name LIKE ? OR a.name LIKE ?
        ORDER BY s.name ASC
        LIMIT 20;
      `,
      [likeQuery, likeQuery]
    );

    return NextResponse.json({
      songs: rows.map((row) => ({
        id: row.song_id,
        title: row.song_name,
        artist: row.artist_name ?? "Unknown Artist",
        genre: row.genre,
        releaseDate: row.release_date
          ? row.release_date.toISOString().split("T")[0]
          : null,
      })),
    });
  } catch (error) {
    console.error("[GET /api/songs/search] Failed to search songs", error);
    return NextResponse.json(
      { error: "Failed to search songs" },
      { status: 500 }
    );
  }
}
