import React from "react";

const BlogsLatest = () => {
  // Dummy blogs data
  const blogsData = Array.from({ length: 25 }).map((_, idx) => ({
    id: idx + 1,
    title: `Blog Post ${idx + 1}`,
    description:
      "This is a short description for blog post. It will give a quick idea about the topic covered in the article.",
    image: `https://picsum.photos/seed/${idx + 1}/400/250`,
    date: "Sep 2025",
  }));

  // Last 6 blogs
  const latestBlogs = blogsData.slice(-6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-red-700 mb-8 text-center">
        Latest Blogs
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestBlogs.map((blog) => (
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{blog.description}</p>
              <p className="text-xs text-gray-400 mb-4">{blog.date}</p>
              <button className="text-red-700 font-medium hover:underline">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogsLatest;
