## Running the app

### Prerequisites

- Install Node.js 20 or newer (we recommend using [`nvm`](https://github.com/nvm-sh/nvm)).
- Enable pnpm via Corepack (`corepack enable pnpm`) or install it globally (`npm install -g pnpm`).
- Install Docker Desktop (or Docker Engine + Docker Compose) and keep it running.

### First-time setup

1. Create the `.env.local` file in the project root with the following credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=music_share
```

2. Install dependencies: `pnpm install`.

### Start the app in dev mode

1. Start the database container: `docker compose up -d`.
2. Run the Next.js dev server: `pnpm dev`.
3. Visit <http://localhost:3000> once the server reports it is ready.

### Shut everything down

- Stop the dev server with `Ctrl+C`.
- Stop the database container when you are done: `docker compose down`.

## SQL queries

The source code for creating and populating tables is in [/app/project.sql](/app/project.sql)

Since we created a user interface, our queries are not in an SQL
file, but instead in our API endpoints. Here is how you can find the query
for each function we listed in our project report:

### 1. Upload_Playlist

See line 46 of [/app/api/playlists/route.ts](./app/api/playlists/route.ts) for query to create playlists.

### 2. Update_playlist

See line 43 of [/app/api/playlists/[playlistId]/songs/route.ts](./app/api/playlists/[playlistId]/songs/route.ts) for query to add songs to a playlist.

See line 37 of [/app/api/playlists/[playlistId]/songs/[songId]/route.ts](./app/api/playlists/[playlistId]/songs/[songId]/route.ts) for query to delete songs from playlists.

### 3. Remove_Playlist

See line 120 of [/app/api/playlists/[playlistId]/route.ts](./app/api/playlists/[playlistId]/route.ts) for query to delete playlists.

### 4. Most_Popular_Playlist

See line 25 of [/app/api/playlists/popular/route.ts](./app/api/playlists/popular/route.ts) for query to fetch the most popular playlists.

### 5. Songs_You_May_Like

We broke this query into multiple subqueries. See the GET function of [/app/api/users/[userId]/recommendations/route.ts](./app/api/users/[userId]/recommendations/route.ts) for the queries and logic.

### 6. User_Like_Count

See line 50 of [/app/api/users/[userId]/likes/route.ts](./app/api/users/[userId]/likes/route.ts) for the query to count the number of likes a user has.
