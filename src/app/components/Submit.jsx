"use client";
import React, { useState } from "react";

const Submit = () => {
  const [inputValues, setInputValues] = useState(["", ""]); // Two inputs for two usernames
  const [users, setUsers] = useState([]); // Array to store data for multiple users
  const [loading, setLoading] = useState(false);

  // Update the corresponding input value
  const handleInputChange = (index, value) => {
    const updatedInputs = [...inputValues];
    updatedInputs[index] = value;
    setInputValues(updatedInputs);
  };

  // Fetch user data and playlists
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

  // Handle button click
  const handleButtonClick = async () => {
    if (inputValues.some((value) => !value)) {
      alert("Please enter usernames for both users");
      return;
    }

    setLoading(true);

    try {
      const fetchedUsers = await Promise.all(
        inputValues.map((username) => fetchUserData(username))
      );

      setUsers(fetchedUsers); // Update state with fetched user data
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

      {/* Render user profiles and playlists */}
      {users.map((user, index) => (
        <div key={index} className="w-full mb-8">
          {user.error ? (
            <p className="text-red-500">{user.error}</p>
          ) : (
            <>
              <div className="w-full flex justify-center mb-8">
                <div className="max-w-xs w-full flex flex-col justify-center items-center space-y-3 p-8 border rounded-3xl shadow-lg bg-gray-50">
                  <img
                    src={user.userData.images[0]?.url || "user.png"}
                    className="w-42 h-42 rounded-full"
                    alt="User Profile"
                  />
                  <h3 className="text-3xl font-black text-secondary">
                    {user.userData.display_name}
                  </h3>
                  <div className="flex justify-between w-full">
                    <span className="font-medium">Followers:</span>
                    <span>{user.userData.followers.total}</span>
                  </div>
                  <a
                    href={user.userData.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-xl font-semibold bg-secondary rounded-full p-3 "
                  >
                    View Profile
                  </a>
                </div>
              </div>

              <div className="w-full">
                <h1 className="text-2xl font-semibold mb-4">
                  {user.userData.display_name}'s Playlists
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {user.playlistsData.items.map((playlist, idx) => (
                    <div
                      key={playlist.id || idx}
                      className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md"
                    >
                      <h2 className="font-semibold text-lg">
                        {playlist.name}
                      </h2>
                      <p className="text-sm">
                        Tracks: {playlist.tracks.total}
                      </p>
                      <img
                        src={playlist.images[0]?.url || "/default-image.png"}
                        alt={playlist.name}
                        className="mt-2 w-full h-auto aspect-square object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Submit;
