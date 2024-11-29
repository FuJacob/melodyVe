"use client";
import { ClipLoader } from "react-spinners";
import React, { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import { marked } from "marked";
import Guide from "./Guide";
const ValidationPopup = ({ onClose }) => (
  <div className="fixed inset-0 flex justify-center items-center z-50">
    <ErrorPopup onClose={onClose} />
  </div>
);

const Submit = () => {
  const [inputValues, setInputValues] = useState(["", ""]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [groqResponse, setGroqResponse] = useState(null); // State for storing the Groq response

  const handleInputChange = (index, value) => {
    const updatedInputs = [...inputValues];
    updatedInputs[index] = value;
    setInputValues(updatedInputs);
  };

  const fetchUserData = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:4000/getUserData?username=${username}`
      );
      const playlistsResponse = await fetch(
        `http://localhost:4000/getUserPlaylists?username=${username}`
      );

      if (!response.ok || !playlistsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const userData = await response.json();
      const playlistsData = await playlistsResponse.json();

      return { userData, playlistsData };
    } catch (error) {
      return { error: error.message };
    }
  };

  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/getPlaylistItems?playlist_id=${playlistId}`
      );
      if (!response.ok) throw new Error("Failed to fetch playlist tracks");

      const playlistData = await response.json();
      return playlistData.items
        .filter((item) => item.track) // Avoid null tracks
        .map((item) => item.track.name);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error.message);
      return [];
    }
  };

  const sendToGroqAI = async (userTracks) => {
    try {
      // Ensure userTracks is an array of two arrays (for two users)
      const tracks = [userTracks[1] || [], userTracks[2] || []]; // Map to the 1-based keys

      const response = await fetch("http://localhost:4000/sendToGroq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userTracks: tracks }), // Send the formatted tracks array
      });

      if (!response.ok) {
        throw new Error("Failed to send tracks to Groq");
      }

      const result = await response.json();
      setGroqResponse(result); // Set the Groq response to state
    } catch (error) {
      console.error("Error sending tracks to Groq:", error.message);
    }
  };

  const handleButtonClick = async () => {
    if (inputValues.filter((value) => value).length < 2) {
      setShowPopup(true);
      return;
    }

    setLoading(true);

    try {
      const fetchedUsers = await Promise.all(
        inputValues.map((username) => fetchUserData(username))
      );

      setUsers(fetchedUsers);

      // Create an object to store tracks for each user
      const userTracks = {};

      await Promise.all(
        fetchedUsers.map(async (user, userIndex) => {
          const key = userIndex + 1; // Use 1-based index as the key
          userTracks[key] = []; // Initialize an array for the user in the object

          if (user.playlistsData?.items) {
            for (const playlist of user.playlistsData.items) {
              const trackNames = await fetchPlaylistTracks(playlist.id);
              userTracks[key].push(...trackNames); // Add the tracks to this user's array
            }
          }
        })
      );

      console.log("User tracks:", userTracks); // Debug output

      // Send the tracks for both users to the backend
      if (userTracks[1] && userTracks[2]) {
        await sendToGroqAI(userTracks);
      } else {
        console.error("Error: Missing tracks for one or both users");
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-12 bg-base-200">
      <div className="flex items-center min-h-screen">
        <div className="space-y-6 bg-white p-6 rounded-3xl shadow-xl bg-gray-50">
          {inputValues.map((value, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Enter username ${index + 1}`}
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="input w-full text-center"
            />
          ))}
          <button
            className="btn btn-secondary w-full text-white btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            onClick={handleButtonClick}
          >
            let's start
          </button>
        </div>
      </div>

      {loading && (
        <div className="spinner-container">
          <ClipLoader size={50} color="#3498db" loading={loading} />
        </div>
      )}

      {showPopup && <ValidationPopup onClose={() => setShowPopup(false)} />}

      {/* Display Groq response */}
      {groqResponse && (
        <div className="flex justify-center min-h-screen">
          <div className="bg-base-100 p-5 rounded-3xl shadow-xl w-1/2">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(groqResponse.choices[0].message.content),
              }}
            />
          </div>
        </div>
      )}
      <Guide />
    </div>
  );
};

export default Submit;
