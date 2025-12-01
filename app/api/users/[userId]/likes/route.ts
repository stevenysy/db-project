"use server";

import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

type UserRow = RowDataPacket & {
  user_id: number;
};

type LikeCountRow = RowDataPacket & {
  totalLikes: number;
};

export async function GET(_request: Request, context: RouteContext) {
  const { userId: userIdParam } = await context.params;
  const userId = Number(userIdParam);

  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json(
      { error: "Invalid user id provided." },
      { status: 400 },
    );
  }

  try {
    const pool = await getDbPool();

    const [userRows] = await pool.query<UserRow[]>(
      "SELECT user_id FROM USER WHERE user_id = ? LIMIT 1;",
      [userId],
    );

    if (userRows.length === 0) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 },
      );
    }

    const [likeRows] = await pool.query<LikeCountRow[]>(
      `
        SELECT COUNT(*) AS totalLikes
        FROM PLAYLIST_LIKES AS pl
        INNER JOIN PLAYLIST AS p ON p.playlist_id = pl.playlist_id
        WHERE p.uploader_id = ?;
      `,
      [userId],
    );

    const totalLikes = likeRows[0]?.totalLikes ?? 0;

    return NextResponse.json({ totalLikes }, { status: 200 });
  } catch (error) {
    console.error(
      `[GET /api/users/${userId}/likes] Failed to fetch total likes`,
      error,
    );
    return NextResponse.json(
      { error: "Failed to load total likes. Please try again." },
      { status: 500 },
    );
  }
}


