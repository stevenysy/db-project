"use server";

import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type UserPlaylistRow = RowDataPacket & {
  playlist_id: number;
  number_of_likes: number;
  uploader_id: number;
  uploader_username: string;
  song_id: number | null;
  song_name: string | null;
  artist_name: string | null;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> }
) {
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

    const [rows] = await pool.query<UserPlaylistRow[]>(
      `
        SELECT
          p.playlist_id,
          p.number_of_likes,
          p.uploader_id,
          u.username AS uploader_username,
          s.song_id,
          s.name AS song_name,
          a.name AS artist_name
        FROM PLAYLIST p
        INNER JOIN USER u ON u.user_id = p.uploader_id
        LEFT JOIN PLAYLIST_SONGS ps ON ps.playlist_id = p.playlist_id
        LEFT JOIN SONG s ON s.song_id = ps.song_id
        LEFT JOIN ARTIST a ON a.artist_id = s.artist_id
        WHERE p.uploader_id = ?
        ORDER BY p.playlist_id ASC, ps.song_id ASC;
      `,
      [userId]
    );

    const playlistMap = new Map<
      number,
      {
        id: number;
        likes: number;
        uploaderId: number;
        uploader: string;
        songs: { id: number; name: string; artist: string | null }[];
      }
    >();

    for (const row of rows) {
      const existing = playlistMap.get(row.playlist_id);
      const playlist =
        existing ??
        (() => {
          const created = {
            id: row.playlist_id,
            likes: row.number_of_likes,
            uploaderId: row.uploader_id,
            uploader: row.uploader_username,
            songs: [] as { id: number; name: string; artist: string | null }[],
          };
          playlistMap.set(row.playlist_id, created);
          return created;
        })();

      if (row.song_id) {
        playlist.songs.push({
          id: row.song_id,
          name: row.song_name ?? `Song ${row.song_id}`,
          artist: row.artist_name,
        });
      }
    }

    const playlists = Array.from(playlistMap.values()).map((playlist) => ({
      id: playlist.id,
      name: `Playlist ${playlist.id}`,
      likes: playlist.likes,
      uploaderId: playlist.uploaderId,
      uploader: playlist.uploader,
      songs: playlist.songs.map((song) => ({
        id: song.id,
        title: song.name,
        artist: song.artist ?? "Unknown Artist",
      })),
    }));

    return NextResponse.json({ playlists }, { status: 200 });
  } catch (error) {
    console.error(
      `[GET /api/users/${userId}/playlists] Failed to fetch playlists`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch playlists for user" },
      { status: 500 }
    );
  }
}
