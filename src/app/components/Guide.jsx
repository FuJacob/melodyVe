import React from "react";

const Guide = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center">How does it work?</h1>
      <div className="flex flex-row gap-6">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="font-black text-3xl">Step 1</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
          </div>
          <figure>
            <img
              src="default-playlist.png"
              alt="Shoes"
              className="w-96 h-56 object-cover"
            />
          </figure>
        </div>
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="font-black text-3xl">Step 2</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
          </div>
          <figure>
            <img
              src="default-playlist.png"
              alt="Shoes"
              className="w-96 h-56 object-cover"
            />
          </figure>
        </div>
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="font-black text-3xl">Step 3</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
          </div>
          <figure>
            <img
              src="default-playlist.png"
              alt="Shoes"
              className="w-96 h-56 object-cover"
            />
          </figure>
        </div>
      </div>
    </>
  );
};

export default Guide;
