import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Edit3, Eye, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";


const VideosAdmin = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState({}); // Track delete loading per video

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch videos. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Handle delete video
  const handleDelete = async (videoId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the video!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setDeleteLoading((prev) => ({ ...prev, [videoId]: true }));
      try {
        await axiosInstance.delete(`/videos/${videoId}`);
        setVideos((prev) => prev.filter((video) => video._id !== videoId));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Video deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error deleting video:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete video. Please try again.",
        });
      } finally {
        setDeleteLoading((prev) => ({ ...prev, [videoId]: false }));
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-red-700 mr-3" />
          <span className="text-lg text-gray-600">Loading videos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Manage Videos</h2>
        <button
          onClick={() => navigate("/add-video")}
          className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Video
        </button>
      </div>

      {/* Videos Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thumbnail
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No videos available yet.
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {video.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-500 max-w-xs truncate" title={video.description}>
                        {video.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(video.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/edit-video/${video._id}`)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(video._id)}
                        disabled={deleteLoading[video._id]}
                        className="text-red-600 hover:text-red-900 flex items-center disabled:opacity-50"
                        title="Delete"
                      >
                        {deleteLoading[video._id] ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        {deleteLoading[video._id] ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {videos.length === 0 && !loading && (
        <div className="text-center py-12 mt-8">
          <p className="text-gray-500 text-lg mb-4">No videos available yet.</p>
          <button
            onClick={() => navigate("/add-video")}
            className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition shadow-md"
          >
            Add Your First Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideosAdmin;