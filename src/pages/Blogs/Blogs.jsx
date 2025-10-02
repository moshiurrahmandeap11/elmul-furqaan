import React, { useState } from "react";

const Blogs = () => {
  // Dummy blogs data
  const blogsData = Array.from({ length: 25 }).map((_, idx) => ({
    id: idx + 1,
    title: `Blog Post ${idx + 1}`,
    description:
      "This is a short description for blog post. It will give a quick idea about the topic covered in the article.",
    image: `https://picsum.photos/seed/${idx + 1}/400/250`,
    date: "Sep 2025",
  }));

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogsData.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogsData.length / blogsPerPage);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center text-red-700 mb-10">
        Latest Blogs
      </h1>

      {/* Blog Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm mb-3">{blog.description}</p>
              <p className="text-xs text-gray-400 mb-4">{blog.date}</p>
              <button className="text-red-700 cursor-pointer font-medium hover:underline">
                Read More →
              </button>
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md text-sm hover:bg-red-700 hover:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Blogs;
