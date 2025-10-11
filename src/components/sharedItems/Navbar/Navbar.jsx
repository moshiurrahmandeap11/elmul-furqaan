import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Menu, X, Search, X as CloseIcon } from "lucide-react";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const res = await axiosInstance.get("/logo");
      setLogo(res.data);
    } catch (error) {
      console.error("Error fetching logo:", error);
      setLogo({ type: 'text', text: 'Elmul Furqaan' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearchLoading(true);
    try {
      const response = await axiosInstance.get(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchResults(response.data);
      
      // সার্চ রেজাল্ট পেজে নেভিগেট করুন
      navigate('/search', { 
        state: { 
          searchData: response.data,
          searchTerm: searchTerm 
        } 
      });
      
      setSearchOpen(false);
      setSearchTerm("");
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const quickSearch = (term) => {
    setSearchTerm(term);
    // অটো সার্চ ট্রিগার করতে চাইলে এখান থেকে handleSearch কল করতে পারেন
  };

  const renderLogo = () => {
    if (loading) {
      return <div className="h-8 w-32 animate-pulse bg-gray-300 rounded"></div>;
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
          <Link to="/" className="flex items-center flex-shrink-0">
            {renderLogo()}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
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
                  `relative font-medium transition-colors duration-200 group ${
                    isActive
                      ? "text-red-700"
                      : "text-gray-700 hover:text-red-700"
                  }`
                }
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all duration-200 ${
                    window.location.pathname === item.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-red-700 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Contact Us Button */}
            <Link
              to="/contact"
              className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors duration-200 font-medium"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-red-700 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button 
              onClick={() => setOpen(!open)}
              className="p-2 text-gray-600 hover:text-red-700 transition-colors duration-200"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-4 pt-2 pb-4 space-y-3">
          {[
            { path: "/", label: "Home" },
            { path: "/blogs", label: "Islamic Content" },
            { path: "/videos", label: "Islamic Video" },
            { path: "/questions", label: "QNA" },
            { path: "/about", label: "About Us" },
          ].map((item, idx) => (
            <Link 
              key={idx}
              to={item.path} 
              className="block py-2 px-3 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="block bg-red-700 text-white px-4 py-3 rounded-lg hover:bg-red-800 transition-colors duration-200 text-center font-medium mt-2"
            onClick={() => setOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Search</h3>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchTerm("");
                  setSearchResults(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <CloseIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search blogs, videos, Q&A..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                  autoFocus
                />
              </div>
              
              {/* Quick Search Suggestions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["Quran", "Hadith", "Prayer", "Islamic History", "Fiqh"].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => quickSearch(term)}
                    className="px-3 py-1 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-full text-sm transition-colors duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={searchLoading || !searchTerm.trim()}
                className="w-full mt-4 bg-red-700 text-white py-3 rounded-lg hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;