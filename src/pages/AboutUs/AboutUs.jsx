import React from "react";

const AboutUs = () => {
  // Dummy team data
  const team = [
    {
      name: "Moshiur Rahman",
      role: "Founder & CEO",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Aliya Khan",
      role: "Content Manager",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Ahmed Siddiq",
      role: "Video Producer",
      image: "https://i.pravatar.cc/150?img=3",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-red-700 mb-4">
          About Us
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Elmul Furqaan is dedicated to spreading authentic Islamic knowledge
          through blogs, videos, and educational resources. Our mission is to
          guide people with clarity, wisdom, and modern presentation.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="bg-green-50 p-8 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">Our Mission</h2>
          <p className="text-gray-700">
            To provide accessible and authentic Islamic knowledge in a modern
            and engaging way, empowering learners worldwide.
          </p>
        </div>
        <div className="bg-yellow-50 p-8 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-yellow-700 mb-3">Our Vision</h2>
          <p className="text-gray-700">
            To create a trusted platform where everyone can explore, learn, and
            grow spiritually with clarity and authenticity.
          </p>
        </div>
      </div>

      {/* Team */}
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold text-red-700 mb-10">Our Team</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Join Us on Our Journey</h2>
        <p className="text-gray-600 mb-6">
          Explore our blogs, watch educational videos, and learn authentic Islamic knowledge with us.
        </p>
        <button className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition">
          Explore More
        </button>
      </div>
    </section>
  );
};

export default AboutUs;
