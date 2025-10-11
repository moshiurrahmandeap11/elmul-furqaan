import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Eye, Share2, Play, Clock } from "lucide-react";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";


const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [views, setViews] = useState(0);

  // Fetch video details
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/videos/${id}`);
        setVideo(res.data);
        
        // Simulate views (in real app, this would come from backend)
        setViews(Math.floor(Math.random() * 1000) + 100);
        
        // Fetch related videos
        const allVideosRes = await axiosInstance.get("/videos");
        const related = allVideosRes.data
          .filter(v => v._id !== id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setRelatedVideos(related);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching video details:", err);
        setError("Video not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideoDetails();
    }
  }, [id]);

  // Extract YouTube embed ID from videoUrl
  const getEmbedUrl = (videoUrl) => {
    if (videoUrl.includes("youtube.com/embed/")) {
      return videoUrl;
    }
    const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&showinfo=0&autoplay=1`;
    }
    return videoUrl;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share video
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="aspect-video bg-gray-300 rounded-xl mb-6"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Video Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The video you're looking for doesn't exist."}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors font-medium"
              >
                Go Back
              </button>
              <Link
                to="/videos"
                className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Browse All Videos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-red-700 hover:text-red-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-xl overflow-hidden shadow-lg mb-6">
              <div className="relative aspect-video">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(video.videoUrl)}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {video.title}
              </h1>

              {/* Video Meta */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  {/* <Eye className="h-4 w-4 mr-2" />
                  <span>{views.toLocaleString()} views</span> */}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(video.createdAt)}</span>
                </div>
                {video.duration && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{video.duration}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {video.description && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {video.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Video
                </button>
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Play className="h-5 w-5 mr-2 text-red-700" />
                Related Videos
              </h2>

              {relatedVideos.length > 0 ? (
                <div className="space-y-4">
                  {relatedVideos.map((relatedVideo) => (
                    <Link
                      key={relatedVideo._id}
                      to={`/videos/${relatedVideo._id}`}
                      className="block group"
                    >
                      <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          {relatedVideo.thumbnail ? (
                            <img
                              src={relatedVideo.thumbnail}
                              alt={relatedVideo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <Play className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 text-sm leading-tight group-hover:text-red-700 transition-colors line-clamp-2">
                            {relatedVideo.title}
                          </h3>
                          {relatedVideo.createdAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(relatedVideo.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No related videos found.</p>
              )}

              {/* View All Videos Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  to="/videos"
                  className="block w-full bg-red-700 text-white text-center py-3 rounded-lg hover:bg-red-800 transition-colors font-medium"
                >
                  View All Videos
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-6 w-6 text-red-700" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Islamic Education</h3>
            <p className="text-gray-600 text-sm">
              Learn about Islam through engaging video content from trusted scholars.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Regular Updates</h3>
            <p className="text-gray-600 text-sm">
              New videos added regularly to enrich your Islamic knowledge.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Share Knowledge</h3>
            <p className="text-gray-600 text-sm">
              Spread beneficial knowledge by sharing videos with family and friends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;