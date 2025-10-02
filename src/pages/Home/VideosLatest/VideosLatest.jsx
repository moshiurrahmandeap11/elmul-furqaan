import React from "react";

const VideosLatest = () => {
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

  // Last 6 videos
  const latestVideos = videosData.slice(-6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-red-700 mb-8 text-center">
        Latest Videos
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestVideos.map((video) => (
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
              <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideosLatest;
