import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router";
import { Search, ArrowLeft, MessageCircle, Mail } from "lucide-react";
import axiosInstance from "../../../../hooks/axiosIntance/AxiosIntance";


const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchData, searchTerm: initialSearchTerm } = location.state || {};
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchDataState, setSearchDataState] = useState(searchData);

  // Popular search suggestions
  const popularSearches = [
    "Quran", "Hadith", "Prayer", "Islamic History", "Fiqh", 
    "Prophet Muhammad", "Salah", "Zakat", "Hajj", "Ramadan",
    "Islamic Finance", "Muslim Family", "Tawhid", "Sunnah"
  ];

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      // Filter popular searches based on current input
      const filtered = popularSearches.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Add current search term if not in popular searches
      if (searchTerm && !popularSearches.includes(searchTerm)) {
        filtered.unshift(searchTerm);
      }
      
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e, term = searchTerm) => {
    e?.preventDefault();
    if (!term.trim()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/search?q=${encodeURIComponent(term)}`);
      setSearchDataState(response.data);
      setShowSuggestions(false);
      
      // Update URL without page reload
      navigate('/search', { 
        state: { 
          searchData: response.data,
          searchTerm: term 
        },
        replace: true
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
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
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  if (!searchDataState && !initialSearchTerm) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder="Search blogs, videos, Q&A..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !searchTerm.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? "..." : "Search"}
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors duration-200 flex items-center"
                    >
                      <Search className="h-4 w-4 text-gray-400 mr-3" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Popular Searches */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-3">Popular Searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.slice(0, 8).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-3 py-1 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-full text-sm transition-colors duration-200 border border-gray-300 hover:border-red-300"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Initial State */}
          <div className="text-center py-12">
            <Search className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Islamic Content</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Find answers to your questions about Islam, browse educational content, and discover valuable resources.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { results, totalResults } = searchDataState || {};

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="Search blogs, videos, Q&A..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-lg"
              />
              <button
                type="submit"
                disabled={loading || !searchTerm.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? "..." : "Search"}
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors duration-200 flex items-center"
                  >
                    <Search className="h-4 w-4 text-gray-400 mr-3" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Search Results for "{searchTerm}"
          </h1>
          <p className="text-gray-600 text-lg">
            Found {totalResults || 0} result{totalResults !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
            <p className="text-gray-600 mt-4">Searching...</p>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <>
            {/* Blogs Results */}
            {results?.blogs && results.blogs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  📚 Islamic Content ({results.blogs.length})
                </h2>
                <div className="space-y-4">
                  {results.blogs.map((blog) => (
                    <Link
                      key={blog._id}
                      to={`/blogs/${blog._id}`}
                      className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-red-300"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {blog.title}
                      </h3>
                      {blog.content && (
                        <p className="text-gray-600 line-clamp-2">
                          {blog.content.substring(0, 150)}...
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Videos Results */}
            {results?.videos && results.videos.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  📹 Islamic Videos ({results.videos.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {results.videos.map((video) => (
                    <Link
                      key={video._id}
                      to={`/videos/${video._id}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 hover:border-red-300"
                    >
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Q&A Results */}
            {results?.qna && results.qna.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  ❓ Q&A ({results.qna.length})
                </h2>
                <div className="space-y-4">
                  {results.qna.map((qna) => (
                    <div
                      key={qna._id}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-800 mb-3">
                        <span className="text-red-700">Q:</span> {qna.question}
                      </h3>
                      {qna.answer ? (
                        <p className="text-gray-700 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                          <strong className="text-green-700">A:</strong> {qna.answer}
                        </p>
                      ) : (
                        <p className="text-gray-500 italic bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                          ⏳ Waiting for answer from our scholars...
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No Results Found */}
            {totalResults === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <Search className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Nothing found with your query
                </h2>
                <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                  We couldn't find any content matching "<strong>{searchTerm}</strong>". 
                  Try different keywords or ask our scholars directly.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center justify-center bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors duration-200 font-medium"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contact Our Scholars
                  </Link>
                  
                  <Link 
                    to="/questions" 
                    className="inline-flex items-center justify-center bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors duration-200 font-medium"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Ask a Question
                  </Link>
                </div>

                <div className="border-t pt-6">
                  <p className="text-gray-600 mb-4">Try these popular searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularSearches.slice(0, 6).map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(term)}
                        className="px-4 py-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-lg text-sm transition-colors duration-200 border border-gray-300 hover:border-red-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-red-700 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;