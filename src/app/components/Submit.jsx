"use client";
import React, { useState } from "react";
import ErrorPopup from "./ErrorPopup";

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

  const handleButtonClick = async () => {
    if (inputValues.filter((value) => value).length < 2) {
      setShowPopup(true); // Show the pop-up when any input is empty
      return;
    }

    setLoading(true);

    try {
      const fetchedUsers = await Promise.all(
        inputValues.map((username) => fetchUserData(username))
      );

      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="max-w-md space-y-6 bg-white p-6 rounded-3xl shadow-xl bg-gray-50">
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
          className="btn btn-secondary btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          onClick={handleButtonClick}
        >
          Match!
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* Show pop-up if input is empty */}
      {showPopup && <ValidationPopup onClose={() => setShowPopup(false)} />}

      {/* Display users and playlists */}
      {users.length > 0 && (
        <div className="flex justify-between w-full mt-8 gap-8">
          {/* User 1's Playlists */}

          <div className="w-1/2 space-y-6">
            <div className="flex flex-col justify-center h-96 p-6 border rounded-xl shadow-lg bg-gray-50">
              <div className="flex justify-center">
                <img
                  src={users[0]?.userData?.images[0]?.url || "user.png"}
                  className="w-64 h-64 rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-blue-500 mb-2 text-center">
                {users[0]?.userData?.display_name}
              </h3>
              <div className="flex justify-between">
                <span className="font-medium">Followers:</span>
                <span>{users[0]?.userData?.followers.total}</span>
              </div>
              <div className="flex justify-center w-full">
                <a
                  href={users[0]?.userData?.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xl font-semibold bg-secondary rounded-full p-3 "
                >
                  View Profile
                </a>
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mt-4">
              User 1 Playlists
            </h2>
            <div className="grid grid-cols-2 gap-y-6 place-items-center">
              {users[0]?.playlistsData?.items.map((playlist) => (
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
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/2 space-y-6">
            <div className="flex flex-col justify-center h-96 p-6 border rounded-3xl shadow-lg bg-gray-50">
              <div className="flex justify-center">
                <img
                  src={users[1]?.userData?.images[0]?.url || "user.png"}
                  className="w-64 h-64 rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-blue-500 mb-2 text-center">
                {users[1]?.userData?.display_name}
              </h3>
              <div className="flex justify-between">
                <span className="font-medium">Followers:</span>
                <span>{users[1]?.userData?.followers.total}</span>
              </div>
              <div className="flex justify-center w-full">
                <a
                  href={users[1]?.userData?.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xl font-semibold bg-secondary rounded-full p-3 "
                >
                  View Profile
                </a>
              </div>
            </div>

            {/* User 2's Playlists */}
            <h2 className="text-xl font-bold text-center mt-4">
              User 2 Playlists
            </h2>
            <div className="grid grid-cols-2 gap-y-6 place-items-center">
              {users[1]?.playlistsData?.items.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex flex-col w-fit items-center bg-gray-100 p-8 rounded-xl shadow-md"
                >
                  <h3 className="font-semibold text-lg">{playlist.name}</h3>
                  <p className="text-sm">Tracks: {playlist.tracks.total}</p>
                  <img
                    src={playlist.images[1]?.url || "default-playlist.png"}
                    alt={playlist.name}
                    className="mt-2 w-64 h-auto rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submit;
