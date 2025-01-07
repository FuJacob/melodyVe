// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Define the authentication options
export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID, // Spotify Client ID from your environment variables
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Spotify Client Secret from your environment variables
    }),
  ],
  pages: {
    signIn: "../../../signin",
  },
};

export const handler = NextAuth(authOptions);

// Export GET and POST methods for handling the requests
export { handler as GET, handler as POST };


  // pages: {
  //   signIn: "../../auth/signin",
  // }