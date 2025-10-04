import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Edit2, Trash2, Loader2, ChevronLeft, X } from 'lucide-react';
import Swal from "sweetalert2";
import axiosInstance from '../../../hooks/axiosIntance/AxiosIntance';

const QnaAdmin = () => {
  const navigate = useNavigate();
  const [qnas, setQnas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newQna, setNewQna] = useState({ question: "", answer: "" });
  const [editQna, setEditQna] = useState({ question: "", answer: "" });
  const [formErrors, setFormErrors] = useState({});

  // Fetch all Q&A
  useEffect(() => {
    const fetchQnas = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/qna");
        setQnas(res.data);
      } catch (err) {
        console.error("Error fetching Q&A:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load Q&A.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQnas();
  }, []);

  // Add new Q&A
  const handleAddQna = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newQna.question.trim()) errors.question = "Question is required";
    if (!newQna.answer.trim()) errors.answer = "Answer is required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitLoading(true);
    try {
      await axiosInstance.post("/qna", {
        question: newQna.question.trim(),
        answer: newQna.answer.trim()
      });
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Q&A added successfully.",
        timer: 1500,
      });
      setNewQna({ question: "", answer: "" });
      setFormErrors({});
      setShowAddForm(false);
      const res = await axiosInstance.get("/qna");
      setQnas(res.data);
    } catch (err) {
      console.error("Error adding Q&A:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add Q&A.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Start editing
  const startEdit = (qna) => {
    setEditingId(qna._id);
    setEditQna({ question: qna.question, answer: qna.answer || "" });
    setFormErrors({});
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditQna({ question: "", answer: "" });
    setFormErrors({});
  };

  // Save edit
  const saveEdit = async () => {
    const errors = {};
    if (!editQna.answer.trim()) errors.answer = "Answer is required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axiosInstance.put(`/qna/${editingId}`, { 
        answer: editQna.answer.trim(),
        question: editQna.question.trim() 
      });
      
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Answer updated successfully.",
        timer: 1500,
      });
      
      const res = await axiosInstance.get("/qna");
      setQnas(res.data);
      cancelEdit();
    } catch (err) {
      console.error("Error updating Q&A:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to update Q&A.",
      });
    }
  };

  // Delete Q&A
  const handleDelete = async (qnaId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the Q&A!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      setDeleteLoading((prev) => ({ ...prev, [qnaId]: true }));
      try {
        await axiosInstance.delete(`/qna/${qnaId}`);
        setQnas((prev) => prev.filter((qna) => qna._id !== qnaId));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Q&A deleted successfully.",
          timer: 1500,
        });
      } catch (err) {
        console.error("Error deleting Q&A:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete Q&A.",
        });
      } finally {
        setDeleteLoading((prev) => ({ ...prev, [qnaId]: false }));
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <span className="text-lg text-gray-600">Loading Q&A...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Q&A</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          {showAddForm ? (
            <>
              <X className="h-5 w-5 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Add Q&A
            </>
          )}
        </button>
      </div>

      {/* Add Form - Responsive */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Q&A</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newQna.question}
                onChange={(e) => setNewQna({ ...newQna, question: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="3"
                placeholder="Enter the question..."
              />
              {formErrors.question && (
                <p className="mt-1.5 text-sm text-red-500">{formErrors.question}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newQna.answer}
                onChange={(e) => setNewQna({ ...newQna, answer: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="4"
                placeholder="Enter the answer..."
              />
              {formErrors.answer && (
                <p className="mt-1.5 text-sm text-red-500">{formErrors.answer}</p>
              )}
            </div>
            <button
              onClick={handleAddQna}
              disabled={submitLoading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {submitLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Adding...
                </span>
              ) : (
                'Add Q&A'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Q&A List - Card View for Mobile, Table for Desktop */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Answer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {qnas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <p className="text-lg font-medium mb-2">No Q&A available</p>
                      <p className="text-sm">Add your first Q&A using the button above!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                qnas.map((qna) => (
                  <tr key={qna._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs">
                        {qna.question}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === qna._id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editQna.answer}
                            onChange={(e) => setEditQna({ ...editQna, answer: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Edit answer..."
                          />
                          {formErrors.answer && (
                            <p className="text-sm text-red-500">{formErrors.answer}</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 max-w-md">
                          {qna.answer ? (
                            <span>{qna.answer}</span>
                          ) : (
                            <span className="text-orange-500 italic">No answer yet</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(qna.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => startEdit(qna)}
                          disabled={editingId === qna._id}
                          className="flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
                          title={qna.answer ? "Edit Answer" : "Add Answer"}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(qna._id)}
                          disabled={deleteLoading[qna._id]}
                          className="flex items-center text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                          title="Delete"
                        >
                          {deleteLoading[qna._id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {qnas.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-lg font-medium mb-2">No Q&A available</p>
              <p className="text-sm">Add your first Q&A using the button above!</p>
            </div>
          ) : (
            qnas.map((qna) => (
              <div key={qna._id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  {/* Question */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Question</h4>
                    <p className="text-sm font-medium text-gray-900">{qna.question}</p>
                  </div>

                  {/* Answer */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Answer</h4>
                    {editingId === qna._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editQna.answer}
                          onChange={(e) => setEditQna({ ...editQna, answer: e.target.value })}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          rows="3"
                          placeholder="Edit answer..."
                        />
                        {formErrors.answer && (
                          <p className="text-sm text-red-500">{formErrors.answer}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {qna.answer ? (
                          qna.answer
                        ) : (
                          <span className="text-orange-500 italic">No answer yet</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(qna.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(qna)}
                        disabled={editingId === qna._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        <Edit2 className="h-4 w-4" />
                        {qna.answer ? "Edit" : "Add"}
                      </button>
                      <button
                        onClick={() => handleDelete(qna._id)}
                        disabled={deleteLoading[qna._id]}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        {deleteLoading[qna._id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QnaAdmin;