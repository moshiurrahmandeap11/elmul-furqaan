import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Calendar, Tag, Share2, Clock, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";
import { FaEnvelope, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const BlogsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/blogs/${id}`);
        setBlog(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/blogs");
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <div className="animate-ping absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full h-16 w-16 border-4 border-purple-300 opacity-20"></div>
          </div>
          <p className="text-lg font-medium text-gray-700 animate-pulse">Loading your story...</p>
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error || "Blog not found."}</p>
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto font-medium"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Blogs
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-16">
      {/* Floating Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg font-medium"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Blogs
        </button>
      </div>

      {/* Hero Section with Gradient Overlay */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-96 md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Title Overlay on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
              {blog.title}
            </h1>
            
            {/* Meta Info on Hero */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 mb-8">
          
          {/* Tags Section */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gray-200">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium hover:from-purple-200 hover:to-pink-200 transition-all duration-300 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className="mb-6 text-gray-700 leading-relaxed text-lg" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-12 mb-6" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="space-y-3 mb-6 ml-6" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="space-y-3 mb-6 ml-6" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-gray-700 leading-relaxed pl-2 relative before:content-['✨'] before:absolute before:-left-6 before:text-purple-400" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-gray-900 bg-yellow-100 px-1 rounded" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic text-purple-700" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="relative border-l-4 border-gradient-to-b from-purple-500 to-pink-500 pl-6 pr-6 py-4 my-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-r-2xl italic text-gray-700 shadow-md" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-1 rounded text-sm font-mono" {...props} />
                ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-6 rounded-2xl overflow-x-auto my-8 shadow-xl" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-purple-600 hover:text-pink-600 underline decoration-2 underline-offset-4 decoration-purple-300 hover:decoration-pink-300 transition-all duration-300 font-medium" {...props} />
                ),
                img: ({ node, ...props }) => (
                  <img className="rounded-2xl shadow-2xl my-8 w-full h-auto transform hover:scale-105 transition-transform duration-500" {...props} />
                ),
              }}
            >
              {blog.description}
            </ReactMarkdown>
          </div>
        </div>

        {/* Floating Share Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gray-50 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-gray-50 text-black rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Share2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl  font-bold">Love this article?</h3>
                  <p className="text-black text-sm">Share it with your friends!</p>
                </div>
              </div>
              
      <div className="flex gap-3">
        {/* Facebook */}
        <button className="group p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-[#1877F2]/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
          <FaFacebookF className="text-[#1877F2] text-2xl group-hover:scale-125 transition-transform duration-300" />
        </button>

        {/* Twitter/X */}
        <button className="group p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-black/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
          <FaXTwitter className="text-black text-2xl group-hover:scale-125 transition-transform duration-300" />
        </button>

        {/* LinkedIn */}
        <button className="group p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-[#0A66C2]/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
          <FaLinkedinIn className="text-[#0A66C2] text-2xl group-hover:scale-125 transition-transform duration-300" />
        </button>

        {/* Email */}
        <button className="group p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
          <FaEnvelope className="text-red-500 text-2xl group-hover:scale-125 transition-transform duration-300" />
        </button>
      </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsDetails;