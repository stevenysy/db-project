"use server";

import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { getDbPool } from "@/app/lib/db";

type UserRow = RowDataPacket & {
  user_id: number;
  username: string;
};

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Please send JSON." },
      { status: 400 }
    );
  }

  const username =
    typeof (payload as { username?: unknown }).username === "string"
      ? (payload as { username: string }).username.trim()
      : "";

  if (!username) {
    return NextResponse.json(
      { error: "Username is required." },
      { status: 400 }
    );
  }

  if (username.length > 15) {
    return NextResponse.json(
      { error: "Usernames must be 15 characters or fewer." },
      { status: 400 }
    );
  }

  try {
    const pool = await getDbPool();

    const [existing] = await pool.query<UserRow[]>(
      "SELECT user_id, username FROM USER WHERE username = ? LIMIT 1;",
      [username]
    );

    if (existing.length > 0) {
      const user = existing[0];
      return NextResponse.json(
        {
          user: {
            id: user.user_id,
            username: user.username,
          },
        },
        { status: 200 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO USER (username) VALUES (?);",
      [username]
    );

    const createdUserId = Number(result.insertId);

    return NextResponse.json(
      {
        user: {
          id: createdUserId,
          username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/users/login] Failed to log in user", error);
    return NextResponse.json(
      { error: "Failed to log in user. Please try again." },
      { status: 500 }
    );
  }
}
