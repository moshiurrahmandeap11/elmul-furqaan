import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";


const Navbar = () => {
  const [open, setOpen] = useState(false);
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
      return <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>;
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
          className="h-14 w-auto object-contain"
        />
      );
    }

    return <span className="text-2xl font-bold text-red-700">Elmul Furqaan</span>;
  };

  return (
    <nav className="shadow-md bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {renderLogo()}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {[
              { path: "/", label: "Home" },
              { path: "/blogs", label: "Islamic Content" },
              { path: "/videos", label: "Islamic Video" },
              { path: "/questions", label: "QNA" },
              { path: "/about", label: "About Us" },
            ].map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                end
                className={({ isActive }) =>
                  `relative font-medium transition-colors group ${
                    isActive
                      ? "text-red-700"
                      : "text-gray-700 hover:text-red-700"
                  }`
                }
              >
                {item.label}
                <span
                  className={`
          absolute  
          ${
            window.location.pathname === item.path
              ? "w-1/2"
              : "w-0 group-hover:w-1/2"
          }
        `}
                ></span>
              </NavLink>
            ))}
          </div>

          {/* Contact Us Button */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setOpen(!open)}>
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-4 pt-2 pb-4 space-y-2">
          <Link to="/" className="block hover:text-red-700">
            Home
          </Link>
          <Link to="/blogs" className="block hover:text-red-700">
            Blogs
          </Link>
          <Link to="/videos" className="block hover:text-red-700">
            Videos
          </Link>
          <Link to="/about" className="block hover:text-red-700">
            About Us
          </Link>
          <Link to="/questions" className="block hover:text-red-700">
            Q & A
          </Link>
          <Link
            to="/contact"
            className="block bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition text-center"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;