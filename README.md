## Local development

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

1. Start the database container: `docker compose up -d mysql`.
2. Run the Next.js dev server: `pnpm dev`.
3. Visit <http://localhost:3000> once the server reports it is ready.

### Shut everything down

- Stop the dev server with `Ctrl+C`.
- Stop the database container when you are done: `docker compose down`.

## API routes

### `GET /api/playlists/popular`

Returns the 10 playlists with the highest `number_of_likes` ordered from most to least popular.

Example response:

```json
{
  "playlists": [
    {
      "id": 5,
      "name": "Playlist 5",
      "likes": 32,
      "uploader": "user_2",
      "uploaderId": 2
    }
  ]
}
```

All API routes run on the server, so they can safely access the database using the credentials specified in `.env.local`.

### `GET /api/users/:userId/playlists`

Returns every playlist uploaded by the specified user id (including the songs in each playlist).

Example response:

```json
{
  "playlists": [
    {
      "id": 1,
      "name": "Playlist 1",
      "likes": 10,
      "uploaderId": 1,
      "uploader": "user_1",
      "songs": [
        {
          "id": 1,
          "title": "No title",
          "artist": "Reol"
        }
      ]
    }
  ]
}
```

### `GET /api/songs/search?q=<query>`

Returns up to 20 songs whose names contain the provided query string.

Example response:

```json
{
  "songs": [
    {
      "id": 1,
      "title": "No title",
      "artist": "Reol",
      "genre": "J-Pop",
      "releaseDate": "2014-08-13"
    }
  ]
}
```

### `POST /api/playlists`

Creates a new playlist for the authenticated (or currently selected) user.

Request body:

```json
{
  "name": "Focus Beats",
  "uploaderId": 1
}
```

Returns HTTP 201 with the newly created playlist id.

### `POST /api/playlists/:playlistId/songs`

Adds an existing song to the specified playlist.

Request body:

```json
{
  "songId": 4
}
```

Returns HTTP 201 on success.

### `DELETE /api/playlists/:playlistId/songs/:songId`

Removes a song from the specified playlist. Returns HTTP 200 on success.

### `DELETE /api/playlists/:playlistId`

Deletes a playlist along with its associated songs. Returns HTTP 200 on success.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
