"use server";

import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type PopularPlaylistRow = RowDataPacket & {
  playlist_id: number;
  playlist_name: string;
  number_of_likes: number;
  uploader_id: number | null;
  uploader_username: string | null;
  song_id: number | null;
  song_name: string | null;
  artist_name: string | null;
};

export async function GET() {
  try {
    const pool = await getDbPool();

    const [rows] = await pool.query<PopularPlaylistRow[]>(
      `
        WITH top_playlists AS (
          SELECT
            p.playlist_id,
            p.name AS playlist_name,
            p.number_of_likes,
            p.uploader_id,
            u.username AS uploader_username
          FROM PLAYLIST p
          LEFT JOIN USER u ON u.user_id = p.uploader_id
          ORDER BY p.number_of_likes DESC, p.playlist_id ASC
          LIMIT 10
        )
        SELECT
          tp.playlist_id,
          tp.playlist_name,
          tp.number_of_likes,
          tp.uploader_id,
          tp.uploader_username,
          s.song_id,
          s.name AS song_name,
          a.name AS artist_name
        FROM top_playlists tp
        LEFT JOIN PLAYLIST_SONGS ps ON ps.playlist_id = tp.playlist_id
        LEFT JOIN SONG s ON s.song_id = ps.song_id
        LEFT JOIN ARTIST a ON a.artist_id = s.artist_id
        ORDER BY tp.number_of_likes DESC, tp.playlist_id ASC, ps.song_id ASC;
      `
    );

    const playlistMap = new Map<
      number,
      {
        id: number;
        name: string;
        likes: number;
        uploader: string;
        uploaderId: number | null;
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
            name: row.playlist_name,
            likes: row.number_of_likes,
            uploader: row.uploader_username ?? "Unknown Student",
            uploaderId: row.uploader_id,
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
      name: playlist.name,
      likes: playlist.likes,
      uploader: playlist.uploader,
      uploaderId: playlist.uploaderId,
      songs: playlist.songs.map((song) => ({
        id: song.id,
        title: song.name,
        artist: song.artist ?? "Unknown Artist",
      })),
    }));

    return NextResponse.json({ playlists }, { status: 200 });
  } catch (error) {
    console.error(
      "[GET /api/playlists/popular] Failed to fetch playlists",
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch popular playlists" },
      { status: 500 }
    );
  }
}
