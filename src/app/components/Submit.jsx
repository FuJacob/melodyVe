"use client";
import React, { useState } from "react";

const Submit = () => {
  const [inputValue1, setInputValue1] = useState("");
  const [result, setResult] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setInputValue1(event.target.value);
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
      console.error(error.message);
      return { error: error.message };
    }
  };
  
  const handleButtonClick = async () => {
    if (!inputValue1) {
      alert("Please enter a username");
      return;
    }
  
    setLoading(true);
  
    try {
      const { userData, playlistsData, error } = await fetchUserData(inputValue1);
  
      if (error) {
        throw new Error(error);
      }
  
      setResult(userData);
      setPlaylists(playlistsData);
    } catch (error) {
      setResult({ error: error.message });
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        <div className="max-w-md space-y-6 bg-white p-6 rounded-3xl shadow-xl bg-gray-50">
          <input
            type="text"
            placeholder="Enter the first person's username"
            value={inputValue1}
            onChange={handleChange}
            className="input w-full text-center"
          />
          <input
            type="text"
            placeholder="Enter the second person's username"
            value={inputValue1}
            onChange={handleChange}
            className="input w-full text-center"
          />
        <button
          className="btn btn-secondary btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          onClick={handleButtonClick}
        >
          Match!
        </button>
        </div>

        {loading && <p>Loading...</p>}

        {result && (
          <div className="w-full">
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : (
              <>
                <div className="w-full flex justify-center mb-8">
                  <div className="max-w-xs w-full flex flex-col justify-center items-center space-y-3 p-8 border rounded-3xl shadow-lg bg-gray-50">
                    <div className="flex justify-center">
                      <img
                        src={result.images[0]?.url || "user.png"}
                        className="w-42 h-42 rounded-full"
                        alt="User Profile"
                      />
                    </div>
                    <h3 className="text-3xl font-black text-secondary">
                      {result.display_name}
                    </h3>
                    <div className="flex justify-between w-full">
                      <span className="font-medium">Followers:</span>
                      <span>{result.followers.total}</span>
                    </div>
                    <div className="flex justify-center w-full">
                      <a
                        href={result.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-xl font-semibold bg-secondary rounded-full p-3 "
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <h1 className="text-2xl font-semibold mb-4">
                    User's Playlists
                  </h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {playlists.items.map((playlist, index) => (
                      <div
                        key={playlist.id || index}
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
        )}
      </div>
    </>
  );
};

export default Submit;
