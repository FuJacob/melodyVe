require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');

// MongoDB Schema
const reportSchema = new mongoose.Schema(
	{
		users: { type: [mongoose.Schema.Types.Mixed], required: true },
		userID: { type: String, required: true },
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
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

reportSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	next();
});

const Report = mongoose.model('Report', reportSchema);

// Spotify token management
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
let spotifyToken = null;
let tokenExpiryTime = null;

const fetchSpotifyToken = async () => {
	try {
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
		tokenExpiryTime = Date.now() + response.data.expires_in * 100;
	} catch (error) {
		console.error(
			'Error fetching Spotify token:',
			error.response?.data || error.message
		);
		throw new Error('Failed to retrieve access token');
	}
};

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

// Helper function
const truncateTracks = (tracks, maxLength) => {
	const tracksString = tracks.join(', ');
	if (tracksString.length <= maxLength) {
		return tracksString;
	}
	return `${tracksString.substring(0, maxLength - 20)}... (truncated)`;
};

// Routes
router.get('/getSpotifyToken', async (req, res) => {
	try {
		await fetchSpotifyToken();
		res.json({ token: spotifyToken });
	} catch (error) {
		res.status(500).json({ error: 'Failed to retrieve access token' });
	}
});

router.get('/getUserData', ensureSpotifyToken, async (req, res) => {
	const { username } = req.query;
	if (!username) {
		return res.status(400).json({ error: 'Username is required' });
	}
	try {
		const response = await axios.get(
			`https://api.spotify.com/v1/users/${username}`,
			{
				headers: { Authorization: `Bearer ${spotifyToken}` },
			}
		);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({ error: 'Failed to get Spotify user data' });
	}
});

router.get('/getUserPlaylists', ensureSpotifyToken, async (req, res) => {
	const { username } = req.query;
	if (!username) {
		return res.status(400).json({ error: 'Username is required' });
	}
	try {
		const response = await axios.get(
			`https://api.spotify.com/v1/users/${username}/playlists`,
			{
				headers: { Authorization: `Bearer ${spotifyToken}` },
			}
		);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({ error: 'Failed to get Spotify user playlist data' });
	}
});

router.get('/getPlaylistItems', ensureSpotifyToken, async (req, res) => {
	const { playlist_id } = req.query;
	if (!playlist_id) {
		return res.status(400).json({ error: 'Playlist id is required' });
	}
	try {
		const response = await axios.get(
			`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
			{
				headers: { Authorization: `Bearer ${spotifyToken}` },
			}
		);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({ error: 'Failed to get playlist items data' });
	}
});

router.post('/sendToGroq', async (req, res) => {
	try {
		const { userTracks } = req.body;
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

		let content = response.data.choices[0].message.content;
		content = content
			.replace(/```json/gi, '')
			.replace(/```/g, '')
			.trim();
		const analysisResult = JSON.parse(content);
		res.status(200).json(analysisResult);
	} catch (error) {
		res.status(500).json({ error: error.response?.data || error.message });
	}
});

router.post('/save-report', async (req, res) => {
	try {
		const report = new Report(req.body);
		const result = await report.save();
		res.status(200).json({
			success: true,
			message: 'Report saved!',
			result,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to save report.',
		});
	}
});

router.get('/get-reports', async (req, res) => {
	const { userID } = req.query;
	if (!userID) {
		return res.status(400).json({ error: 'User ID is required' });
	}
	try {
		const reports = await Report.find({ userID: userID });
		res.status(200).json(reports);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch reports' });
	}
});

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB database');
	})
	.catch((err) => {
		console.log('MongoDB connection failed:', err);
	});

module.exports = router;
