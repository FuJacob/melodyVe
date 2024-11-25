import React from "react";

const Guide = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-6 text-4xl font-black text-center mb-12 bg-white rounded-3xl shadow-xl px-8 py-5">
          <h1>How does</h1>
          <img src="melodyve.svg" className="w-36" />
          <h1>work?</h1>
        </div>
        <div className="flex flex-row gap-6">
          <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body flex place-items-center">
              <h2 className="font-black text-3xl mb-5">step 1</h2>
              <ul className="list-disc font-medium space-y-4">
                <li>enter your Spotify IDs</li>
                <li>melodyVe connects to Spotify’s API.</li>
                <li>your unique musical data is ready.</li>
              </ul>
            </div>
            <figure>
              <img
                src="spotify.png"
                alt="Shoes"
                className="w-96 h-56 object-cover"
              />
            </figure>
          </div>
          <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body flex place-items-center">
              <h2 className="font-black text-3xl mb-5">step 2</h2>
              <ul className="list-disc font-medium space-y-4">
                <li>melodyVe listens to your music with AI</li>
                <li>
                  it finds patterns and shared interests
                </li>
                <li>your bond is explored through music</li>
              </ul>
            </div>
            <figure>
              <img
                src="audio.png"
                alt="Shoes"
                className="w-96 h-56 object-cover"
              />
            </figure>
          </div>
          <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body flex place-items-center">
              <h2 className="font-black text-3xl mb-5">final step</h2>
              <ul className="list-disc font-medium space-y-4">
                <li>melodyVe presents its findings</li>
                <li>see how your music matches</li>
                <li>find the harmony between your songs</li>
              </ul>
            </div>
            <figure>
              <img
                src="love-song.png"
                alt="Shoes"
                className="w-96 h-56 object-cover"
              />
            </figure>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guide;
