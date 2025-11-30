"use server";

import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type CreatePlaylistPayload = {
  name?: string;
  uploaderId?: number;
};

export async function POST(request: Request) {
  let body: CreatePlaylistPayload;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const name = body.name?.trim();
  const uploaderId = body.uploaderId;

  if (!name) {
    return NextResponse.json(
      { error: "Playlist name is required" },
      { status: 400 },
    );
  }

  if (!Number.isInteger(uploaderId) || (uploaderId ?? 0) <= 0) {
    return NextResponse.json(
      { error: "Invalid uploader id provided" },
      { status: 400 },
    );
  }

  try {
    const pool = await getDbPool();
    const [result] = await pool.query<ResultSetHeader>(
      `
        INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
        VALUES (?, 0, ?)
      `,
      [name, uploaderId],
    );

    return NextResponse.json(
      {
        playlist: {
          id: result.insertId,
          name,
          number_of_likes: 0,
          uploader_id: uploaderId,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/playlists] Failed to create playlist", error);
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 },
    );
  }
}

