require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
// MongoDB Schema

const reportSchema = new mongoose.Schema(
	{
		userID: { type: String, required: true }, // Store the user's ID (from session)

		genrePreferences: {
			score: { type: Number, required: true },
			explanation: { type: [String], required: true },
		},
		mood: {
			score: { type: Number, required: true },
			explanation: { type: [String], required: true },
		},
		artistOverlap: {
			score: { type: Number, required: true },
			explanation: { type: [String], required: true },
		},
		instrumentalVocalPreference: {
			score: { type: Number, required: true },
			explanation: { type: [String], required: true },
		},
		timePeriods: {
			score: { type: Number, required: true },
			explanation: { type: [String], required: true },
		},
		songMeanings: {
			score: { type: Number, required: true },
			explanation: { type: [String], required: true },
		},
		totalMelodyveScore: {
			score: { type: Number, required: true },
			finalRemarks: { type: String, required: true },
		},
		// Custom readable timestamp fields
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

// Middleware to automatically update the `updatedAt` field when document is modified
reportSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	next();
});

const Report = mongoose.model('Report', reportSchema);

// Store the token and its expiration time
let spotifyToken = null;
let tokenExpiryTime = null;

// Function to fetch a new Spotify access token
const fetchSpotifyToken = async () => {
	try {
		console.log('Client ID:', client_id);
		console.log('Client Secret:', client_secret);
		const authHeader =
			'Basic ' +
			Buffer.from(`${client_id}:${client_secret}`).toString('base64');

		const response = await axios.post(
			'https://accounts.spotify.com/api/token',
			new URLSearchParams({ grant_type: 'client_credentials' }),
			{
				headers: {
					Authorization: authHeader,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		spotifyToken = response.data.access_token;
		tokenExpiryTime = Date.now() + response.data.expires_in * 100; // Calculate token expiration time
	} catch (error) {
		console.error(
			'Error fetching Spotify token:',
			error.response?.data || error.message
		);
		throw new Error('Failed to retrieve access token');
	}
};

// Middleware to ensure a valid Spotify token
const ensureSpotifyToken = async (req, res, next) => {
	if (!spotifyToken || Date.now() >= tokenExpiryTime) {
		try {
			await fetchSpotifyToken();
		} catch (error) {
			return res.status(500).json({ error: 'Failed to refresh Spotify token' });
		}
	}
	next();
};

// Endpoint to manually refresh the Spotify token
app.get('/getSpotifyToken', async (req, res) => {
	try {
		await fetchSpotifyToken();
		res.json({ token: spotifyToken });
	} catch (error) {
		res.status(500).json({ error: 'Failed to retrieve access token' });
	}
});

// Route to handle the GET request for user data
app.get('/getUserData', ensureSpotifyToken, async (req, res) => {
	const { username } = req.query;

	if (!username) {
		return res.status(400).json({ error: 'Username is required' });
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
			'Error fetching Spotify user data:',
			error.response?.data || error.message
		);
		res.status(500).json({ error: 'Failed to get Spotify user data' });
	}
});

// Route to handle the GET request for user playlist data
app.get('/getUserPlaylists', ensureSpotifyToken, async (req, res) => {
	const { username } = req.query;

	if (!username) {
		return res.status(400).json({ error: 'Username is required' });
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
			'Error fetching Spotify user data:',
			error.response?.data || error.message
		);
		res.status(500).json({ error: 'Failed to get Spotify user playlist data' });
	}
});

// Route to get all playlist items from user playlist
app.get('/getPlaylistItems', ensureSpotifyToken, async (req, res) => {
	const { playlist_id } = req.query;

	if (!playlist_id) {
		return res.status(400).json({ error: 'Playlist id is required' });
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
			'Error fetching Spotify playlist items data:',
			error.response?.data || error.message
		);
		res.status(500).json({ error: 'Failed to get playlist items data' });
	}
});

const truncateTracks = (tracks, maxLength) => {
	// Join tracks into a single string
	const tracksString = tracks.join(', ');

	// If the length is within the limit, return it as is
	if (tracksString.length <= maxLength) {
		return tracksString;
	}

	// Truncate and add a note
	return `${tracksString.substring(0, maxLength - 20)}... (truncated)`;
};

// Route to send tracks to Groq API (now using OpenAI)
app.post('/sendToGroq', async (req, res) => {
	try {
		const { userTracks } = req.body; // Tracks array sent from frontend

		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-4o-mini',
				messages: [
					{
						role: 'system',
						content: `You are a music compatibility expert tasked with performing a deep, nuanced analysis of two Spotify user profiles. 
            Focus on providing precise, insightful, and objective analysis across these dimensions.
            Provide a structured JSON response with the following format. Do not provide anything else except for the JSON response.
            {
              "genrePreferences": {
                "score": 0-10,
                "explanation": [
                  "First bullet point explanation (keep explanation equal to 15 words)",
                  "Second bullet point explanation (keep explanation equal to 15 words)",
                  "Third bullet point explanation (keep explanation equal to 15 words)"
                ]
              },
              "mood": {
                "score": 0-10,
                "explanation": [
                 "First bullet point explanation (keep explanation equal to 15 words)",
                  "Second bullet point explanation (keep explanation equal to 15 words)",
                  "Third bullet point explanation (keep explanation equal to 15 words)"
                ]
              },
              "artistOverlap": {
                "score": 0-10,
                "explanation": [
                 "First bullet point explanation (keep explanation equal to 15 words)",
                  "Second bullet point explanation (keep explanation equal to 15 words)",
                  "Third bullet point explanation (keep explanation equal to 15 words)"
                ]
              },
              "instrumentalVocalPreference": {
                "score": 0-10,
                "explanation": [
                  "First bullet point explanation (keep explanation equal to 15 words)",
                  "Second bullet point explanation (keep explanation equal to 15 words)",
                  "Third bullet point explanation (keep explanation equal to 15 words)"
                ]
              },
              "timePeriods": {
                "score": 0-10,
                "explanation": [
                  "First bullet point explanation (keep explanation equal to 15 words)",
                  "Second bullet point explanation (keep explanation equal to 15 words)",
                  "Third bullet point explanation (keep explanation equal to 15 words)"
                ]
              },
              "songMeanings": {
                "score": 0-10,
                "explanation": [
               "First bullet point explanation (keep explanation equal to 15 words)",
                  "Second bullet point explanation (keep explanation equal to 15 words)",
                  "Third bullet point explanation (keep explanation equal to 15 words)"
                ]
              },
              "totalMelodyveScore": {
                "score": 0-100,
                "finalRemarks": "Provide an overall analysis of the compatibility between User 1 and User 2 based on their musical preferences."
              }
            }`,
					},
					{
						role: 'user',
						content: `This is the first user's tracks, with the first element being their name. When writing the report, address them by their name: ${truncateTracks(
							userTracks[0],
							4000
						)}
            This is the first user's tracks, with the first element being their name. When writing the report, address them by their name: ${truncateTracks(
							userTracks[1],
							4000
						)}`,
					},
				],
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
				},
			}
		);

		// Parse the JSON content from the API response
		let content = response.data.choices[0].message.content;
		console.log(content);
		content = content
			.replace(/```json/gi, '')
			.replace(/```/g, '')
			.trim();
		const analysisResult = JSON.parse(content);

		res.status(200).json(analysisResult);
	} catch (error) {
		console.error(
			'Error interacting with Groq API:',
			error.response?.data || error.message
		);
		res.status(500).json({ error: error.response?.data || error.message });
	}
});

// this is for saving the reports
app.post('/save-report', async (req, res) => {
	try {
		const report = new Report(req.body);
		const result = await report.save();
		res.status(200).json({
			success: true,
			message: 'Report saved!',
			result,
		});
	} catch (error) {
		console.error('Error saving report:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to save report.',
		});
	}
});
// Connect to MongoDB and start server
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
		console.log('connected to database YES');
	})
	.catch(() => {
		console.log('connection failed NO');
	});
