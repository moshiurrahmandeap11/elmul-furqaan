import React, { useState } from "react";

const Videos = () => {
  // Dummy video data (YouTube IDs)
  const videosData = [
    { id: "dQw4w9WgXcQ", title: "Islamic Lecture 1" },
    { id: "V-_O7nl0Ii0", title: "Islamic Lecture 2" },
    { id: "3JZ_D3ELwOQ", title: "Islamic Lecture 3" },
    { id: "L_jWHffIx5E", title: "Islamic Lecture 4" },
    { id: "eVTXPUF4Oz4", title: "Islamic Lecture 5" },
    { id: "kXYiU_JCYtU", title: "Islamic Lecture 6" },
    { id: "e-ORhEE9VVg", title: "Islamic Lecture 7" },
    { id: "CevxZvSJLk8", title: "Islamic Lecture 8" },
    { id: "9bZkp7q19f0", title: "Islamic Lecture 9" },
    { id: "RgKAFK5djSk", title: "Islamic Lecture 10" },
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videosData.slice(indexOfFirstVideo, indexOfLastVideo);

  const totalPages = Math.ceil(videosData.length / videosPerPage);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-red-700 mb-10 text-center">
        Latest Videos
      </h1>

      {/* Video Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-800">{video.title}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md text-sm hover:bg-red-700 hover:text-white disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 border rounded-md text-sm ${
              currentPage === idx + 1
                ? "bg-red-700 text-white"
                : "hover:bg-red-700 hover:text-white"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md text-sm hover:bg-red-700 hover:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Videos;
