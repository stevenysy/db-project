"use server";

import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

type PlaylistRow = RowDataPacket & {
  playlist_id: number;
};

type PlaylistSongRow = RowDataPacket & {
  song_id: number;
  genre: string;
};

type RecommendedSongRow = RowDataPacket & {
  song_id: number;
  name: string;
  genre: string;
  artist_name: string | null;
};

export async function GET(_request: Request, context: RouteContext) {
  const { userId: userIdParam } = await context.params;
  const userId = Number(userIdParam);

  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json(
      { error: "Invalid user id provided." },
      { status: 400 }
    );
  }

  try {
    const pool = await getDbPool();

    const [playlists] = await pool.query<PlaylistRow[]>(
      "SELECT playlist_id FROM PLAYLIST WHERE uploader_id = ?;",
      [userId]
    );

    if (playlists.length === 0) {
      return NextResponse.json(
        {
          recommendations: [],
          message: "Upload at least one playlist to get recommendations.",
        },
        { status: 200 }
      );
    }

    const [playlistSongs] = await pool.query<PlaylistSongRow[]>(
      `
        SELECT ps.song_id, s.genre
        FROM PLAYLIST_SONGS ps
        INNER JOIN PLAYLIST p ON p.playlist_id = ps.playlist_id
        INNER JOIN SONG s ON s.song_id = ps.song_id
        WHERE p.uploader_id = ?;
      `,
      [userId]
    );

    if (playlistSongs.length === 0) {
      return NextResponse.json(
        {
          recommendations: [],
          message: "Add songs to your playlists to get recommendations.",
        },
        { status: 200 }
      );
    }

    const genreCounts = new Map<string, number>();
    const userSongIds = new Set<number>();

    for (const row of playlistSongs) {
      userSongIds.add(row.song_id);
      if (row.genre) {
        const count = genreCounts.get(row.genre) ?? 0;
        genreCounts.set(row.genre, count + 1);
      }
    }

    if (genreCounts.size === 0) {
      return NextResponse.json(
        {
          recommendations: [],
          message: "We could not determine your favorite genres yet.",
        },
        { status: 200 }
      );
    }

    const topGenres = Array.from(genreCounts.entries())
      .sort((a, b) => {
        const countDiff = b[1] - a[1];
        if (countDiff !== 0) {
          return countDiff;
        }
        return a[0].localeCompare(b[0]);
      })
      .slice(0, 5)
      .map(([genre]) => genre);

    if (topGenres.length === 0) {
      return NextResponse.json(
        {
          recommendations: [],
          message: "We could not determine your favorite genres yet.",
        },
        { status: 200 }
      );
    }

    const params: Array<readonly unknown[] | unknown> = [topGenres];
    let query = `
      SELECT
        s.song_id,
        s.name,
        s.genre,
        a.name AS artist_name
      FROM SONG s
      LEFT JOIN ARTIST a ON a.artist_id = s.artist_id
      WHERE s.genre IN (?)
    `;

    if (userSongIds.size > 0) {
      query += " AND s.song_id NOT IN (?)";
      params.push([...userSongIds]);
    }

    query += " ORDER BY s.song_id ASC LIMIT 10;";

    const [recommendedSongs] = await pool.query<RecommendedSongRow[]>(
      query,
      params
    );

    if (recommendedSongs.length === 0) {
      return NextResponse.json(
        {
          recommendations: [],
          message:
            "We couldn't find new songs in your favorite genres right now.",
        },
        { status: 200 }
      );
    }

    const recommendations = recommendedSongs.map((song) => ({
      id: song.song_id,
      title: song.name,
      artist: song.artist_name ?? "Unknown Artist",
      genre: song.genre,
    }));

    return NextResponse.json(
      {
        recommendations,
        favoriteGenres: topGenres,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `[GET /api/users/${userId}/recommendations] Failed to fetch recommendations`,
      error
    );
    return NextResponse.json(
      { error: "Failed to generate recommendations. Please try again." },
      { status: 500 }
    );
  }
}

