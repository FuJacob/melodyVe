import { NextResponse } from 'next/server';

export async function GET() {
  const userId = '313axjyg2di2n3tsjflaxht2ilzy';  // Replace with actual Spotify user ID

  try {
    // Fetch the access token using the Client Credentials Flow
    const authResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.SPOTIFY_BASE64_ENCODED_CREDENTIALS}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    // If the request failed, throw an error
    if (!authResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const authData = await authResponse.json();
    const token = authData.access_token;  // Extract the access token from the response

    // Now use the access token to fetch the user's playlists
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Use the access token for authentication
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();  // Parse the response as JSON

    return NextResponse.json(data);  // Return the playlists data as a JSON response
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.error();  // Return an error response if something goes wrong
  }
}
