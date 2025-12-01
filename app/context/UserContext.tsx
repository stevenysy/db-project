"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { User } from "@/app/types";

type UserContextValue = {
  user: User | null;
  login: (username: string) => Promise<User>;
  logout: () => void;
  isLoggingIn: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const STORAGE_KEY = "db-project:user";

function parseStoredUser(value: string | null): User | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as { id?: unknown }).id === "number" &&
      typeof (parsed as { username?: unknown }).username === "string"
    ) {
      return {
        id: (parsed as { id: number }).id,
        username: (parsed as { username: string }).username,
      };
    }
  } catch {
    // Ignore parsing errors and treat as missing.
  }

  return null;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = parseStoredUser(window.localStorage.getItem(STORAGE_KEY));
    if (stored) {
      setUser(stored);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (rawUsername: string) => {
    const username = rawUsername.trim();

    if (!username) {
      throw new Error("Please enter a username.");
    }

    if (username.length > 15) {
      throw new Error("Usernames must be 15 characters or fewer.");
    }

    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data: {
        user?: { id: number; username: string };
        error?: string;
      } = await response.json().catch(() => ({}));

      if (!response.ok || !data.user) {
        const message =
          data.error ||
          (response.status === 404
            ? "User not found."
            : "Failed to log in. Please try again.");
        throw new Error(message);
      }

      const nextUser: User = {
        id: data.user.id,
        username: data.user.username,
      };

      setUser(nextUser);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      }

      return nextUser;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      login,
      logout,
      isLoggingIn,
    }),
    [user, login, logout, isLoggingIn]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

