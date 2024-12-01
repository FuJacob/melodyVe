"use client";
import { ClipLoader } from "react-spinners";
import React, { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import Guide from "./Guide";
import { Typewriter } from "react-simple-typewriter";

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
  const [groqResponse, setGroqResponse] = useState(null);

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
        .filter((item) => item.track)
        .map((item) => item.track.name);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error.message);
      return [];
    }
  };

  const sendToGroqAI = async (userTracks) => {
    try {
      const tracks = [userTracks[1] || [], userTracks[2] || []];

      const response = await fetch("http://localhost:4000/sendToGroq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userTracks: tracks }),
      });

      if (!response.ok) {
        throw new Error("Failed to send tracks to Groq");
      }

      const result = await response.json();
      setGroqResponse(result);
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
        inputValues.map(async (username) => fetchUserData(username))
      );

      setUsers(fetchedUsers);

      const userTracks = {};

      await Promise.all(
        fetchedUsers.map(async (user, userIndex) => {
          const key = userIndex + 1;
          userTracks[key] = [];

          if (user.playlistsData?.items) {
            for (const playlist of user.playlistsData.items) {
              const trackNames = await fetchPlaylistTracks(playlist.id);
              userTracks[key].push(...trackNames);
            }
          }
        })
      );
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
    <>
      <div className="flex flex-col items-center space-y-12 bg-base-200">
        <div className="flex flex-col justify-center place-items-center min-h-screen gap-10 w-full">
          <img src="melodyve.svg" className="w-96" />
          <div className="bg-accent text-white rounded-3xl shadow-xl py-4 w-2/5 text-center font-semibold text-xl">
            <Typewriter
              words={[
                "discover the harmony in your favorite songs",
                "find the melody that brings you closer",
                "let the music reveal how connected you truly are",
                "feel the rhythm of your compatibility",
                "let your music bring your connection to light",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={80}
              deleteSpeed={50}
              delaySpeed={5000}
            />
          </div>
          <div className="w-96">
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
                className="btn btn-secondary w-full text-white"
                onClick={handleButtonClick}
              >
                let's start
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="spinner-container flex justify-center items-center w-full">
            <ClipLoader size={50} color="#3498db" loading={loading} />
          </div>
        )}

        {showPopup && <ValidationPopup onClose={() => setShowPopup(false)} />}

        {groqResponse && users && (
          <div className="flex justify-center w-full min-h-screen">
              <div className="bg-white rounded-3xl shadow-xl w-3/4 space-y-8">
              <div className="bg-secondary text-center text-white text-3xl font-black p-5 rounded-t-3xl">Report</div>

              <div className="p-10">
                <div className="flex flex-col-flow gap-16 text-center justify-center mb-12">
                  <div className="flex flex-col items-center justify-center gap-4 bg-accent text-white text-2xl font-bold rounded-3xl shadow-xl w-64 h-64">
                    <img
                      src={users[0].userData?.images[0]?.url}
                      className="w-36 h-36 rounded-full"
                      alt="User 1 Profile Pic"
                    />
                      <a
                        href={users[0]?.userData?.external_urls.spotify}
                        target="_blank"
                      >
                        {users[0]?.userData?.display_name}
                      </a>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-5">
                    <img src="melodyve.svg" alt="melodyve" className="w-96" />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 bg-accent text-white text-2xl font-bold rounded-3xl shadow-xl w-64 h-64">
                    <img
                      src={users[1].userData?.images[0]?.url}
                      className="w-36 h-36 rounded-full"
                      alt="User 1 Profile Pic"
                    />
                      <a
                        href={users[1]?.userData?.external_urls.spotify}
                        target="_blank"
                      >
                        {users[1]?.userData?.display_name}
                      </a>
                  </div>
                </div>
  
                <div className="grid grid-cols-2 gap-6">
                  {/* Genre Compatibility */}
                  <div className="bg-base-100 p-6 rounded-2xl shadow-lg p-12">
                    <div className="flex flex-inline gap-x-5 font-semibold">
                      <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center">
                        {groqResponse.genreCompatibility.score}/10
                      </div>
                      <h3 className="text-2xl mb-7 mt-2">Genre Compatibility</h3>
                    </div>
                    <ul class="list-disc space-y-2">
                      {groqResponse.genreCompatibility.explanation.map(
                        (item, index) => (
                          <li key={index} className="font-xl">
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                    </div>
  
                  {/* Mood Compatibility */}
                  <div className="bg-base-100 p-6 rounded-2xl shadow-lg p-12">
                    <div className="flex flex-inline gap-x-5 font-semibold">
                      <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center">
                        {groqResponse.mood.score}/10
                      </div>
                      <h3 className="text-2xl mb-7 mt-2">Mood Compatibility</h3>
                    </div>
                    <ul class="list-disc space-y-2">
                      {groqResponse.mood.explanation.map((item, index) => (
                        <li key={index} className="font-xl">
                          {item}
                        </li>
                      ))}
                    </ul>
                    </div>
  
                  {/* Instrumental Preference */}
                  <div className="bg-base-100 p-6 rounded-2xl shadow-lg p-12">
                    <div className="flex flex-inline gap-x-5 font-semibold">
                      <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center">
                        {groqResponse.instrumentalVocalPreference.score}/10
                      </div>
                      <h3 className="text-2xl mb-7 mt-2">
                        Instrumental Preference
                      </h3>
                    </div>
                    <ul class="list-disc space-y-2">
                      {groqResponse.instrumentalVocalPreference.explanation.map(
                        (item, index) => (
                          <li key={index} className="font-xl">
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                    </div>
  
                  {/* Song Narrative */}
                  <div className="bg-base-100 p-6 rounded-2xl shadow-lg p-12">
                    <div className="flex flex-inline gap-x-5 font-semibold">
                      <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center">
                        {groqResponse.songStories.score}/10
                      </div>
                      <h3 className="text-2xl mb-7 mt-2">Song Narrative</h3>
                    </div>
                    <ul class="list-disc space-y-2">
                      {groqResponse.songStories.explanation.map((item, index) => (
                        <li key={index} className="font-xl">
                          {item}
                        </li>
                      ))}
                    </ul>
                    </div>
  
                  {/* Artist Overlap */}
                  <div className="bg-base-100 p-6 rounded-2xl shadow-lg p-12">
                    <div className="flex flex-inline gap-x-5 font-semibold">
                      <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center">
                        {groqResponse.artistOverlap.score}/10
                      </div>
                      <h3 className="text-2xl mb-7 mt-2">Artist Overlap</h3>
                    </div>
                    <ul class="list-disc space-y-2">
                      {groqResponse.artistOverlap.explanation.map(
                        (item, index) => (
                          <li key={index} className="font-xl">
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                    </div>
  
                  {/* Dancibility */}
                  <div className="bg-base-100 p-6 rounded-2xl shadow-lg p-12">
                    <div className="flex flex-inline gap-x-5 font-semibold">
                      <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center">
                        {groqResponse.dancibility.score}/10
                      </div>
                      <h3 className="text-2xl mb-7 mt-2">Dancibility</h3>
                    </div>
                    <ul class="list-disc space-y-2">
                      {groqResponse.dancibility.explanation.map((item, index) => (
                        <li key={index} className="font-xl">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
  
                  {/* Total MelodyVe Score */}
                </div>
                <div className="bg-secondary text-white p-8 rounded-2xl text-center">
                  <h3 className="text-3xl font-bold mb-4">MelodyVe Rating</h3>
                  <p className="text-5xl font-extrabold mb-4">
                    {groqResponse.totalMelodyveScore.score}
                  </p>
                  <p className="text-xl italic">
                    {groqResponse.totalMelodyveScore.finalRemarks}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Guide />
      </div>
    </>
  );
};

export default Submit;
