import React from 'react';
import { Link } from 'react-router';

const AboutUs = () => {
  // Dummy data for sections (static for now)
  const sections = [
    {
      type: 'hero',
      data: {
        title: 'About Us',
        description: 'Elmul Furqaan is dedicated to spreading authentic Islamic knowledge through blogs, videos, and educational resources. Our mission is to guide people with clarity, wisdom, and modern presentation.'
      }
    },
    {
      type: 'mission',
      data: {
        title: 'Our Mission',
        description: 'To provide accessible and authentic Islamic knowledge in a modern and engaging way, empowering learners worldwide.'
      }
    },
    {
      type: 'vision',
      data: {
        title: 'Our Vision',
        description: 'To create a trusted platform where everyone can explore, learn, and grow spiritually with clarity and authenticity.'
      }
    },
    {
      type: 'cta',
      data: {
        title: 'Join Us on Our Journey',
        description: 'Explore our blogs, watch educational videos, and learn authentic Islamic knowledge with us.',
        buttonText: 'Explore More',
        buttonLink: '/blogs'
      }
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero */}
      {sections.find(s => s.type === 'hero')?.data && (
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              {sections.find(s => s.type === 'hero').data.title}
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              {sections.find(s => s.type === 'hero').data.description}
            </p>
          </div>
        </div>
      )}

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {sections.filter(s => s.type === 'mission' || s.type === 'vision').map((section, index) => {
            const isMission = section.type === 'mission';
            return (
              <div
                key={index}
                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isMission ? 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500' : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500'
                }`}
              >
                <h2 className={`text-3xl font-bold mb-4 ${isMission ? 'text-green-700' : 'text-yellow-700'}`}>
                  {section.data.title}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {section.data.description}
                </p>
                {isMission && (
                  <div className="mt-6 p-4 bg-white rounded-lg shadow-inner">
                    <p className="text-green-600 font-medium">Guiding with Authenticity</p>
                  </div>
                )}
                {!isMission && (
                  <div className="mt-6 p-4 bg-white rounded-lg shadow-inner">
                    <p className="text-yellow-600 font-medium">Empowering Spiritual Growth</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Features/Values (Eye-catching addition) */}
      <div className="max-w-7xl mx-auto px-6 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Guided by the principles of the Qur'an and Sunnah, we strive for excellence in every aspect of our work.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📖', title: 'Authentic Knowledge', desc: 'Rooted in primary Islamic sources for reliable guidance.' },
            { icon: '🌍', title: 'Global Reach', desc: 'Accessible to learners from all corners of the world.' },
            { icon: '💡', title: 'Modern Approach', desc: 'Engaging content with contemporary design and technology.' }
          ].map((value, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      {sections.find(s => s.type === 'cta')?.data && (
        <div className="max-w-7xl mx-auto px-6 py-16 text-center bg-gradient-to-r from-red-50 to-red-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {sections.find(s => s.type === 'cta').data.title}
            </h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              {sections.find(s => s.type === 'cta').data.description}
            </p>
            <Link
              to={sections.find(s => s.type === 'cta').data.buttonLink || '/blogs'}
              className="inline-flex items-center px-8 py-4 bg-red-700 text-white rounded-full text-lg font-semibold hover:bg-red-800 transition transform hover:scale-105 shadow-lg"
            >
              {sections.find(s => s.type === 'cta').data.buttonText || 'Explore More'}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutUs;