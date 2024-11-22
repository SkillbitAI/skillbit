"use client";

import React from "react";
import logo from "../../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Image from "next/image";

const WaitingRoom = ({ params }: { params: { id: string } }) => {
  return (
    <div className="text-white bg-slate-900 graphPaper flex flex-col justify-between h-screen">
      <div className="flex flex-col items-center justify-center flex-grow px-6 max-w-7xl mx-auto">
        <div className="flex justify-center ">
          <Image src={logo} alt="logo" width={200} height={200} />
        
        </div>
        <div className="text-center">
          <h1 className="text-7xl mt-4">Welcome to the Test Pre-Screen</h1>
          <h2 className="text-lg font-semibold my-12">Instructions:</h2>
          <p>
            Please take a moment to read the instructions carefully before
            proceeding.
          </p>
          <div className="mt-8 max-w">
            <ol className="text-center mb-8">
              <li className="mb-4">
                <span className="text-white">&#8226;</span> Ensure you have a
                stable internet connection.
              </li>
              <li className="mb-4">
                <span className="text-white">&#8226;</span> Find a quiet and
                comfortable place to take the test.
              </li>
              <li className="mb-4">
                <span className="text-white">&#8226;</span> Have any necessary
                materials, such as a pen and scratch paper, ready.
              </li>
              <li className="mb-4">
                <span className="text-white">&#8226;</span> Do not refresh or
                navigate away from this page until instructed to do so.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 flex flex-col justify-between h-screen">
      <div className="flex flex-col items-center justify-center flex-grow px-6 max-w-7xl mx-auto">
          <h1 className="text-6xl">Ready to start the test?</h1>
          <p className="mt-4">Click the button below to begin.</p>
          <button
            className="bg-white bg-opacity-10 px-6 py-3 rounded-lg mt-12"
            onClick={() => (window.location.href = `/tests/${params.id}`)}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
