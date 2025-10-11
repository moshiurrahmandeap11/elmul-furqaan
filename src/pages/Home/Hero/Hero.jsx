import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosInstance.get("/banner");
        setBanners(res.data);
      } catch (err) {
        console.error("Error fetching banners", err);
      }
    };
    fetchBanners();
  }, []);

  // Auto slide every 5s
  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  // Manual slide
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  // Get the current banner
  const currentBanner = banners[current] || {};

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Images */}
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${banner.image})` }}
        ></div>
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Left Button */}
      {banners.length > 1 && (
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Right Button */}
      {banners.length > 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center text-white h-full flex flex-col justify-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          {currentBanner.heading ? (
            currentBanner.heading.split("\n").map((line, index) => (
              <span
                key={index}
                className={`block ${index === 0 ? "text-white" : ""}`}
              >
                {line}
              </span>
            ))
          ) : (
            <>
              <span className="block text-green-300">
                بسم الله الرحمن الرحيم
              </span>
              <span className="mt-2 block">
                Welcome to <span className="text-red-500">Elmul Furqaan</span>
              </span>
            </>
          )}
        </h1>

        <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
          {currentBanner.subheading ||
            "A place to gain authentic Islamic knowledge, explore blogs, watch inspiring videos, and connect with guidance rooted in the Qur’an and Sunnah."}
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to={currentBanner.button1Link || "/blogs"}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            {currentBanner.button1Text || "Explore Blogs"}
          </Link>
          <Link
            to={currentBanner.button2Link || "/videos"}
            className="px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition"
          >
            {currentBanner.button2Text || "Watch Videos"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;