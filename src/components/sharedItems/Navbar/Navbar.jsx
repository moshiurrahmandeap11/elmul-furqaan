import React, { useState, useEffect, useRef } from "react";
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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Popular search suggestions
  const popularSearches = [
    "Quran", "Hadith", "Prayer", "Islamic History", "Fiqh", 
    "Prophet Muhammad", "Salah", "Zakat", "Hajj", "Ramadan"
  ];

  useEffect(() => {
    fetchLogo();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  // Fetch suggestions when typing
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = popularSearches.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (searchTerm && !popularSearches.includes(searchTerm)) {
        filtered.unshift(searchTerm);
      }
      
      setSuggestions(filtered.slice(0, 4));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = async (e, term = searchTerm) => {
    e?.preventDefault();
    if (!term.trim()) return;

    setSearchLoading(true);
    try {
      const response = await axiosInstance.get(`/search?q=${encodeURIComponent(term)}`);
      setSearchResults(response.data);
      setShowSuggestions(false);
      
      navigate('/search', { 
        state: { 
          searchData: response.data,
          searchTerm: term 
        } 
      });
      
      setSearchTerm("");
      setSearchOpen(false);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(null, suggestion);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchTerm.length > 1) {
      setShowSuggestions(true);
    }
  };

  const quickSearch = (term) => {
    setSearchTerm(term);
    handleSearch(null, term);
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

          {/* Desktop Menu with Search */}
          <div className="hidden md:flex space-x-8 items-center flex-1 max-w-3xl mx-8">
            {/* Navigation Links */}
            <div className="flex space-x-8">
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

            {/* Search Bar - Desktop */}
            <div className="relative flex-1 max-w-xs ml-8" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder="Search..."
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-sm bg-gray-50"
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm("");
                            setShowSuggestions(false);
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <button 
                      type="submit"
                      className="text-gray-400 hover:text-red-700 flex-shrink-0"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 border-b border-gray-200 last:border-b-0 transition-colors duration-200 flex items-center text-sm text-gray-700 hover:text-red-700"
                      >
                        <Search className="h-3 w-3 text-gray-400 mr-3" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Mobile Search Bar - Visible on small screens */}
          <div className="md:hidden flex-1 max-w-xs mx-4" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Search..."
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-sm bg-gray-50"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setShowSuggestions(false);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Suggestions Dropdown for Mobile */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 border-b border-gray-200 last:border-b-0 transition-colors duration-200 flex items-center text-sm text-gray-700 hover:text-red-700"
                    >
                      <Search className="h-3 w-3 text-gray-400 mr-3" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
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
    </nav>
  );
};

export default Navbar;