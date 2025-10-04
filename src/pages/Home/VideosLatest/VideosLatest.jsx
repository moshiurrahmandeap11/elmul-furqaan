import React, { useState, useEffect } from "react";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";


const VideosLatest = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/videos");
        // Sort by createdAt descending and take first 6 (latest)
        const sortedVideos = res.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setVideos(sortedVideos);
        setError(null);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to fetch latest videos. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Extract YouTube embed ID from videoUrl
  const getEmbedUrl = (videoUrl) => {
    // If it's already an embed URL, return as is
    if (videoUrl.includes("youtube.com/embed/")) {
      return videoUrl;
    }
    // If it's a watch URL, extract video ID
    const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    // Fallback for direct links or invalid URLs
    return videoUrl; // Or handle error case
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <span className="ml-3 text-lg">Loading latest videos...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-red-600">
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-red-700 mb-8 text-center">
        Latest Videos
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                src={getEmbedUrl(video.videoUrl)}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Videos Message */}
      {videos.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No latest videos available yet.</p>
        </div>
      )}
    </section>
  );
};

export default VideosLatest;