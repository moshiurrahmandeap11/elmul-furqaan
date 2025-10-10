import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";


const BlogsLatest = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/blogs");
        // Sort by createdAt descending and take last 6 (latest)
        const sortedBlogs = res.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setBlogs(sortedBlogs);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to fetch latest blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Navigate to blog detail
  const handleReadMore = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <div>.</div>
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
        Islamic Content
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-48 object-cover flex-shrink-0"
            />
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
                {blog.description.substring(0, 100)}{blog.description.length > 100 ? "..." : ""}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <p className="text-xs text-gray-400">
                  {formatDate(blog.createdAt)}
                </p>
                <button
                  onClick={() => handleReadMore(blog._id)}
                  className="text-red-700 font-medium hover:underline text-sm"
                >
                  Read More →
                </button>
              </div>
              {/* Tags display (optional - show first 3 tags) */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {blog.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{blog.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Blogs Message */}
      {blogs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No latest blogs available yet.</p>
        </div>
      )}
    </section>
  );
};

export default BlogsLatest;