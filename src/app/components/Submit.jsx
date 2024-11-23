"use client"
import React, { useState } from 'react';

const Submit = () => {
  const [inputValue, setInputValue] = useState(''); // Initialize state for input

  const handleChange = (event) => {
    setInputValue(event.target.value); // Update state when input changes
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        <input
          type="text"
          placeholder="Type here"
          value={inputValue}
          onChange={handleChange}
          className="input input-bordered input-secondary w-full max-w-xs"
        />
        <button className="btn btn-secondary btn-xs sm:btn-sm md:btn-md lg:btn-lg">
          Match!
        </button>

      </div>
    </>
  );
};

export default Submit;
