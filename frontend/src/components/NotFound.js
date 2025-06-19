import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/404.jpg"; // Adjust the import path as necessary

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900 flex flex-col justify-between">
      {/* 404 Content */}
      <div className="relative flex-grow flex flex-col items-center justify-center">
        {/* Background Box Image */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10"
          style={{
            backgroundImage: `url(${backgroundImage})`, // Corrected syntax
          }}
        ></div>

        {/* Oops Line */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-blue-800 text-center px-4">
          Oops! Looks Like You Went Off the Supply Route.
        </h1>

        {/* Rest Things Statement */}
        <p className="mt-4 text-3xl font-semibold text-blue-600 text-center">
          To rest things on us,{" "}
          <Link to="/" className="text-blue-800 hover:underline">
            click here
          </Link>
          .
        </p>
      </div>

      {/* Additional Content */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-6xl font-extrabold text-blue-800 mt-4">404 ERROR</h1>
      </div>
    </div>
  );
}