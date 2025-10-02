import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Dummy submit action
    setSuccess("Your message has been sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(""), 5000);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-red-700 text-center mb-10">
        Contact Us
      </h2>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800">Get in Touch</h3>
          <p className="text-gray-600">
            Have questions or want to collaborate? Fill out the form and we'll get back to you as soon as possible.
          </p>

          <div className="space-y-4">
            <p className="text-gray-700"><span className="font-semibold">Email:</span> info@elmulfurqaan.com</p>
            <p className="text-gray-700"><span className="font-semibold">Phone:</span> +880 1234 567890</p>
            <p className="text-gray-700"><span className="font-semibold">Address:</span> Dhaka, Bangladesh</p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-50 p-8 rounded-xl shadow-lg"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
          <button
            type="submit"
            className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition"
          >
            Send Message
          </button>
          {success && <p className="text-green-600 mt-2">{success}</p>}
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
