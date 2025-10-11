import React, { useState } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Dummy subscribe action
    setMessage(`Subscribed successfully with ${email}`);
    setEmail("");
    setTimeout(() => setMessage(""), 5000); // clear message after 5s
  };

  return (
    <section className=" py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-red-700 mb-4">
          Subscribe to our Newsletter
        </h2>
        <p className="text-gray-600 mb-8">
          Get the latest updates, blogs, and videos directly to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-auto flex-1 px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
          >
            Subscribe
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-600 font-medium">{message}</p>
        )}
      </div>
    </section>
  );
};

export default NewsLetter;
