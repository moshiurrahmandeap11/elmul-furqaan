import React from "react";
import { Link } from "react-router";

const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/rptFGRxx/bg.jpg')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 bg-opacity-60"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center text-white">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          <span className="block text-green-300">بسم الله الرحمن الرحيم</span>
          <span className="mt-2 block">
            Welcome to{" "}
            <span className="text-red-500">Elmul Furqaan</span>
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
          A place to gain authentic Islamic knowledge, explore blogs, watch
          inspiring videos, and connect with guidance rooted in the Qur’an and
          Sunnah.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/blogs"
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Explore Blogs
          </Link>
          <Link
            to="/videos"
            className="px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition"
          >
            Watch Videos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
