"use client";
import React, { useState } from "react";
import ErrorPopup from "./ErrorPopup";
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
      console.log("Tracks fetched for playlist:", playlistId, playlistData);

      // Extract track names
      return playlistData.items
        .filter((item) => item.track) // Avoid null tracks
        .map((item) => item.track.name);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error.message);
      return [];
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

      // Fetch tracks for each playlist
      const tracksData = {};
      await Promise.all(
        fetchedUsers.map(async (user, userIndex) => {
          if (user.playlistsData?.items) {
            const userTracks = {};
            for (const playlist of user.playlistsData.items) {
              const trackNames = await fetchPlaylistTracks(playlist.id);
              userTracks[playlist.id] = trackNames;
            }
            tracksData[userIndex] = userTracks;
          }
        })
      );
      console.log("Tracks data:", tracksData); // Debugging output
      setPlaylistTracks(tracksData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-12">
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
          Start MelodyMatch
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {showPopup && <ValidationPopup onClose={() => setShowPopup(false)} />}

      <Guide />

      {users.length > 0 && (
        <div className="flex justify-between w-full mt-8 gap-8">
          {users.map((user, userIndex) => (
            <div key={userIndex} className="w-1/2 space-y-6">
              <div className="flex flex-col justify-center h-96 p-6 border rounded-xl shadow-lg bg-gray-50">
                <div className="flex justify-center">
                  <img
                    src={user.userData?.images[0]?.url || "user.png"}
                    className="w-64 h-64 rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-blue-500 mb-2 text-center">
                  {user.userData?.display_name}
                </h3>
                <div className="flex justify-between">
                  <span className="font-medium">Followers:</span>
                  <span>{user.userData?.followers.total}</span>
                </div>
                <div className="flex justify-center w-full">
                  <a
                    href={user.userData?.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-xl font-semibold bg-secondary rounded-full p-3 "
                  >
                    View Profile
                  </a>
                </div>
              </div>

              <h2 className="text-xl font-bold text-center mt-4">
                User {userIndex + 1} Playlists
              </h2>
              <div className="grid grid-cols-2 gap-y-6 place-items-center">
                {user.playlistsData?.items.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex flex-col w-fit items-center bg-gray-100 p-8 rounded-xl shadow-md"
                  >
                    <h3 className="font-semibold text-lg">{playlist.name}</h3>
                    <p className="text-sm">Tracks: {playlist.tracks.total}</p>
                    <img
                      src={playlist.images[0]?.url || "default-playlist.png"}
                      alt={playlist.name}
                      className="mt-2 w-64 h-auto rounded-xl"
                    />
                    <div className="mt-4 space-y-1 text-center">
                      <h4 className="font-medium">Tracks:</h4>
                      <ul className="text-sm">
                        {playlistTracks[userIndex]?.[playlist.id]?.length >
                        0 ? (
                          playlistTracks[userIndex][playlist.id].map(
                            (track, i) => <li key={i}>{track}</li>
                          )
                        ) : (
                          <li>No tracks available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Submit;
