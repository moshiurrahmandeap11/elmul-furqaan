import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Swal from "sweetalert2";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";

const QNA = ({ user }) => { // user prop for logged-in info (optional)
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const questionsPerPage = 6;

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/qna");
        setQuestions(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching Q&A:", err);
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // Submit new question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitLoading(true);
    try {
      await axiosInstance.post("/qna", {
        question: newQuestion.trim(),
        userName: user?.name || "Anonymous",
        userEmail: user?.email || null,
        userIp: "Client IP", // Can get from backend if needed
      });
      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Your question has been posted. We'll reply soon!",
        timer: 2000,
      });
      setNewQuestion("");
      // Refresh list
      const res = await axiosInstance.get("/qna");
      setQuestions(res.data);
    } catch (err) {
      console.error("Error submitting question:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit question. Please try again.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <span className="ml-3 text-lg">Loading questions...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-red-600">
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 ">
      {/* Section title */}
      <h2 className="text-4xl font-bold text-red-700 text-center mb-12">
        Q & A Section
      </h2>

      {/* Ask Question Form */}
      <form onSubmit={handleSubmit} className="mb-12 max-w-3xl mx-auto  rounded-xl shadow-lg p-6">
        <div className="flex items-start gap-4">
          <img
            src={user?.avatar || "https://ui-avatars.com/api/?name=Anonymous&background=ddd&color=555"}
            alt={user?.name || "Anonymous"}
            className="w-12 h-12 rounded-full flex-shrink-0 mt-1"
          />
          <div className="flex-1">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent resize-none"
              rows={4}
              placeholder="Ask your question here... (We'll reply soon!)"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              disabled={submitLoading}
            />
            <button
              type="submit"
              disabled={submitLoading || !newQuestion.trim()}
              className="mt-3 px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Question'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Questions List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {currentQuestions.map((q) => (
          <div
            key={q._id}
            className="bg-white/40 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Question */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <img
                  src={q.userName === "Anonymous" ? "https://ui-avatars.com/api/?name=Anonymous&background=ddd&color=555" : (q.userAvatar || `https://ui-avatars.com/api/?name=${q.userName}&background=ddd&color=555`)}
                  alt={q.userName}
                  className="w-12 h-12 rounded-full flex-shrink-0 mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">{q.userName}</h3>
                    <span className="text-xs text-gray-500">· {formatDate(q.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{q.question}</p>
                </div>
              </div>
            </div>

            {/* Reply (if exists) */}
            {q.answer && (
              <div className=" p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800">Admin Reply</h4>
                    <span className="text-xs text-red-600">{formatDate(q.updatedAt)}</span>
                  </div>
                </div>
                <p className="text-gray-800 leading-relaxed bg-white p-4 rounded-lg shadow-sm">
                  {q.answer}
                </p>
              </div>
            )}

            {!q.answer && (
              <div className="p-6 bg-gray-50 text-center">
                <p className="text-gray-500 italic">Awaiting admin reply...</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Questions Message */}
      {questions.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-xl mb-4">No questions yet. Be the first to ask!</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-red-700 hover:text-white disabled:opacity-50 transition"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === idx + 1
                  ? "bg-red-700 text-white"
                  : "border-gray-300 hover:bg-red-700 hover:text-white"
              } transition`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-red-700 hover:text-white disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default QNA;