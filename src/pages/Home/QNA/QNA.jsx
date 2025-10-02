import React, { useState } from "react";

// Dummy questions data
const dummyQuestions = Array.from({ length: 23 }).map((_, idx) => ({
  id: idx + 1,
  name: idx % 3 === 0 ? null : `User${idx + 1}`, // some anonymous
  avatar: idx % 3 === 0 ? null : `https://i.pravatar.cc/150?img=${idx + 1}`,
  question: `This is a sample question number ${idx + 1}?`,
  reply: idx % 2 === 0 ? `Admin reply for question ${idx + 1}` : null,
  ip: `192.168.1.${idx + 1}`,
}));

const QNA = ({ user }) => {
  const [questions, setQuestions] = useState(dummyQuestions);
  const [currentPage, setCurrentPage] = useState(1);
  const [newQuestion, setNewQuestion] = useState("");

  const questionsPerPage = 6;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const questionObj = {
      id: questions.length + 1,
      name: user?.name || null,
      avatar: user?.avatar || null,
      question: newQuestion,
      reply: null,
      ip: "Anonymous",
    };

    setQuestions([questionObj, ...questions]);
    setNewQuestion("");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Section title */}
      <h2 className="text-3xl font-bold text-red-700 text-center mb-10">
        Q & A Section
      </h2>

      {/* Ask Question Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 max-w-3xl mx-auto flex flex-col gap-4"
      >
        <textarea
          className="border rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-700"
          rows={3}
          placeholder="Ask a question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button
          type="submit"
          className="self-end bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
        >
          Submit
        </button>
      </form>

      {/* Questions List */}
      <div className="space-y-6">
        {currentQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4 mb-2">
              <img
                src={
                  q.avatar ||
                  "https://ui-avatars.com/api/?name=Anonymous&background=ddd&color=555"
                }
                alt={q.name || "Anonymous"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {q.name || "Anonymous"}
                </h3>
                <p className="text-xs text-gray-400">
                  {q.name ? "" : `IP: ${q.ip}`}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-2">{q.question}</p>

            {q.reply && (
              <div className="bg-gray-50 border-l-4 border-red-700 p-3 rounded-lg ml-16">
                <p className="text-gray-800 font-semibold">Admin Reply:</p>
                <p className="text-gray-700">{q.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md text-sm hover:bg-red-700 hover:text-white disabled:opacity-50"
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
                : "hover:bg-red-700 hover:text-white"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md text-sm hover:bg-red-700 hover:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default QNA;
