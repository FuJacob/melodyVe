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
    tokenExpiryTime = Date.now() + response.data.expires_in * 100; // Calculate token expiration time
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

const truncateTracks = (tracks, maxLength) => {
  // Join tracks into a single string
  const tracksString = tracks.join(", ");

  // If the length is within the limit, return it as is
  if (tracksString.length <= maxLength) {
    return tracksString;
  }

  // Truncate and add a note
  return `${tracksString.substring(0, maxLength - 20)}... (truncated)`;
};

// Route to send tracks to Groq API
app.post("/sendToGroq", async (req, res) => {
  try {
    const { userTracks } = req.body; // Tracks array sent from frontend

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        messages: [
          {
            role: "system",
            content: `
          You are a music compatibility expert tasked with performing a deep, nuanced analysis of two Spotify user profiles. Your goal is to provide an objective, insightful comparison of their musical tastes, uncovering both similarities and unique characteristics.          
          You will output EXACTLY the following:

          1. Genre Compatibility (0-10 points)
          - Identify shared and unique genres
          - Analyze genre diversity
          - Assess cross-genre musical exploration
          
          2. Mood (0-10 points)
          - Compare emotional tone of playlists
          - Compare energy levels
          - Compare feelings
          
          3. Listening Habits (0-10 points)
          - Compare song length preferences
          - Compare release dates
          - Compare tempo and rhythmic preferences
          
          4. Artist Overlap (0-10 points)
          - Compare shared favorite artists
          - Highlight unique artist discoveries
          - Analyze artist connection depth
          
          5. Acoustic Characteristics (0-10 points)
          - Compare instrumentation
          - Assess sound complexity
          - Evaluate production style similarities
          
          
          **MelodyVe Score (WITH SCORE, EACH CATEGORY IS WEIGHTED 20%**
          - 2 sentences to conclude the analysis, final remarks, things to think upon.
          .`,
          },
          {
            role: "user",
            content: `This is the first user's tracks: ${truncateTracks(
              userTracks[0],
              4000
            )}
            This is the second user's tracks: ${truncateTracks(
              userTracks[1],
              4000
            )}`,
          },
        ],
        model: "gemma-7b-it",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // Securely use the API key
        },
      }
    );

    res.status(200).json(response.data); // Send response back to the frontend
  } catch (error) {
    console.error(
      "Error interacting with Groq API:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
