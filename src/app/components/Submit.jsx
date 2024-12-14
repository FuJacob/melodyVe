"use client";
import { BarLoader } from "react-spinners";
import React, { useState } from "react";
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
  const [showInputError, setshowInputError] = useState(false);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [groqResponse, setGroqResponse] = useState(null);

  const handleInputChange = (index, value) => {
    const updatedInputs = [...inputValues];
    updatedInputs[index] = value.replace("https://open.spotify.com/user/", "");
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
      setshowInputError(true);
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

  const sections = groqResponse && [
    { title: "Genre Compatibility", data: groqResponse.genreCompatibility },
    { title: "Mood Compatibility", data: groqResponse.mood },
    {
      title: "Instrumental Preference",
      data: groqResponse.instrumentalVocalPreference,
    },
    { title: "Song Narrative", data: groqResponse.songStories },
    { title: "Artist Overlap", data: groqResponse.artistOverlap },
    { title: "Dancibility", data: groqResponse.dancibility },
  ];

  return (
    <>
      <div
        className=" min-h-screen"
        style={{
          backgroundImage: "url('bg1.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-center space-y-12">
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
              <div className="space-y-6 bg-white p-6 rounded-3xl border shadow-xl bg-gray-50">
                {inputValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`enter user ${index + 1} link or id`}
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className={`input w-full text-center ${
                      showInputError ? "border-2 border-rose-500" : ""
                    }`}
                    onBlur={() => setshowInputError(false)}
                  />
                ))}
                <button
                  className="btn btn-secondary w-full text-white"
                  onClick={handleButtonClick}
                >
                  {loading ? (
                    <div className="flex justify-center">
                      <BarLoader size={100} color="#ffffff" loading={loading} />
                    </div>
                  ) : (
                    <p>get started</p>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {groqResponse && users && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex-col w-3/4">
            <div className="p-5">
              <div className="flex flex-col-flow gap-16 text-center justify-center">
                <div className="flex flex-col items-center justify-center gap-4 bg-accent text-white text-2xl font-bold rounded-3xl shadow-xl w-44 h-44">
                  <img
                    src={users[0].userData?.images[0]?.url || "user.png"}
                    className="w-24 h-24 rounded-full"
                    alt="User 1 Profile Pic"
                  />
                  <a
                    href={
                      users[0]?.userData?.external_urls.spotify || "user.png"
                    }
                    target="_blank"
                  >
                    {users[0]?.userData?.display_name}
                  </a>
                </div>
                <div className="flex flex-cols border shadow-xl p-5 space-y-12 w-1/2 rounded-2xl text-center">
                 
                <div>
                   <h3 className="text-xl font-semibold mb-4">melodyVe score</h3>
                  <p className="text-5xl font-black">
                    {groqResponse.totalMelodyveScore.score}/100
                  </p>
                   {groqResponse.totalMelodyveScore.finalRemarks}</div>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 bg-accent text-white text-2xl font-bold rounded-3xl shadow-xl w-44 h-44">
                  <img
                    src={users[1].userData?.images[0]?.url}
                    className="w-24 h-24 rounded-full"
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

              <div className="grid grid-cols-2 gap-6 m-6">
                {sections.map(
                  (section, index) =>
                    section.data && (
                      <div
                        key={index}
                        className="bg-base-100 rounded-2xl shadow-lg p-12 border"
                      >
                        <div className="flex gap-x-5 font-semibold">
                          <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center">
                            {section.data.score}/10
                          </div>
                          <h3 className="text-2xl mb-7 mt-2">
                            {section.title}
                          </h3>
                        </div>
                        <ul className="list-disc space-y-2">
                          {section.data.explanation?.map(
                            (item, explanationIndex) => (
                              <li key={explanationIndex}>{item}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )
                )}
                {/* Total MelodyVe Score */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Submit;
