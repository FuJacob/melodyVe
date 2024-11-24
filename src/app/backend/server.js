require("dotenv").config({ path: ".env.local" });
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");

app.use(cors());
app.use(express.json()); // This middleware allows your Express server to accept JSON requests

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// Store the token and its expiration time
let spotifyToken = null;
let tokenExpiryTime = null;

// Function to fetch a new Spotify access token
const fetchSpotifyToken = async () => {
  try {
    console.log("Client ID:", client_id);
    console.log("Client Secret:", client_secret);
    const authHeader =
      "Basic " +
      Buffer.from(`${client_id}:${client_secret}`).toString("base64");

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000; // Calculate token expiration time
  } catch (error) {
    console.error(
      "Error fetching Spotify token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to retrieve access token");
  }
};

// Middleware to ensure a valid Spotify token
const ensureSpotifyToken = async (req, res, next) => {
  if (!spotifyToken || Date.now() >= tokenExpiryTime) {
    try {
      await fetchSpotifyToken();
    } catch (error) {
      return res.status(500).json({ error: "Failed to refresh Spotify token" });
    }
  }
  next();
};

// Endpoint to manually refresh the Spotify token
app.get("/getSpotifyToken", async (req, res) => {
  try {
    await fetchSpotifyToken();
    res.json({ token: spotifyToken });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve access token" });
  }
});

// Route to handle the GET request for user data
app.get("/getUserData", ensureSpotifyToken, async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/users/${username}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching Spotify user data:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to get Spotify user data" });
  }
});

// Route to handle the GET request for user playlist data
app.get("/getUserPlaylists", ensureSpotifyToken, async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/users/${username}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching Spotify user data:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to get Spotify user playlist data" });
  }
});

// Route to get all playlist items from user playlist
app.get("/getPlaylistItems", ensureSpotifyToken, async (req, res) => {
  const { playlist_id } = req.query;

  if (!playlist_id) {
    return res.status(400).json({ error: "Playlist id is required" });
  }
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching Spotify playlist items data:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to get playlist items data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
