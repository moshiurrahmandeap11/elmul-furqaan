import React from "react";
import { useLocation, Link } from "react-router";
import { Search, ArrowLeft, MessageCircle, Mail } from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const { searchData, searchTerm } = location.state || {};

  // Popular search suggestions for no results state
  const popularSearches = [
    "Quran", "Hadith", "Prayer", "Islamic History", "Fiqh", 
    "Prophet Muhammad", "Salah", "Zakat", "Hajj", "Ramadan"
  ];

  if (!searchData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Initial State */}
          <div className="text-center py-12">
            <Search className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Islamic Content</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Use the search bar in the navigation to find answers to your questions about Islam, browse educational content, and discover valuable resources.
            </p>
            
            <Link 
              to="/"
              className="inline-flex items-center bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { results, totalResults } = searchData;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Search Results for "{searchTerm}"
          </h1>
          <p className="text-gray-600 text-lg">
            Found {totalResults || 0} result{totalResults !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Results */}
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
                    <Link
                      key={index}
                      to="/"
                      className="px-4 py-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-lg text-sm transition-colors duration-200 border border-gray-300 hover:border-red-300"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>

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