import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";


const Footer = () => {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const res = await axiosInstance.get("/logo");
      setLogo(res.data);
    } catch (error) {
      console.error("Error fetching logo:", error);
      // Fallback to default logo if API fails
      setLogo({ type: 'text', text: 'Elmul Furqaan' });
    } finally {
      setLoading(false);
    }
  };

  const renderLogo = () => {
    if (loading) {
      return <div className="h-8 w-32 bg-gray-700 animate-pulse rounded"></div>;
    }

    if (!logo) {
      return <span className="text-2xl font-bold text-red-700">Elmul Furqaan</span>;
    }

    if (logo.type === 'text') {
      return <span className="text-2xl font-bold text-red-700">{logo.text}</span>;
    }

    if (logo.type === 'image') {
      return (
        <img 
          src={logo.url} 
          alt="Logo" 
          className="h-10 w-auto object-contain"
        />
      );
    }

    return <span className="text-2xl font-bold text-red-700">Elmul Furqaan</span>;
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Logo + Description */}
        <div>
          <div className="mb-3">
            {renderLogo()}
          </div>
          <p className="text-sm leading-relaxed">
            Dedicated to spreading knowledge and values. Learn, grow, and stay
            connected with our latest blogs, videos, and resources.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-red-700">
                Home
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-red-700">
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/videos" className="hover:text-red-700">
                Videos
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-red-700">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <p className="text-sm">Email: elmulfurqaan@gmail.com</p>
          <p className="text-sm mb-3">Phone: +966 50 373 9142</p>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://facebook.com/elmulforqaan"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-700"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/wakil.al?igsh=bzZ1emlwbDF3MTVk"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-700"
            >
              <Instagram size={20} />
            </a>
            <a
              href="mailto:elmulfurqaan@gmail.com"
              className="hover:text-red-700"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-700 py-4 text-center flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto text-sm text-gray-400 px-4">
        {/* Left Side */}
        <p>© {new Date().getFullYear()} <span className="font-bold text-white">Elmul Furqaan</span>. All Rights Reserved.</p>

        {/* Right Side */}
        <p>
          Developed By{" "}
          <a
            href="https://moshiurrahman.online"
            target="_blank"
            rel="noreferrer"
            className="text-red-600 hover:text-red-700 font-medium relative group"
          >
            Moshiur Rahman
            <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-red-700 transition-all group-hover:w-full"></span>
          </a>{" "}
          via{" "}
          <a
            href="https://projuktisheba.com"
            target="_blank"
            rel="noreferrer"
            className="text-red-600 hover:text-red-700 font-medium relative group"
          >
            Projukti Sheba
            <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-red-700 transition-all group-hover:w-full"></span>
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;