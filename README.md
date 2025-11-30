## Environment setup

Create a `.env.local` file in the project root with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=music_share
```

Restart the dev server after adding or updating environment variables.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
