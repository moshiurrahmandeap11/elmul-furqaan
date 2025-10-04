import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Edit2, Trash2, Loader2, ChevronLeft } from 'lucide-react';
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
      // Refresh list
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
      // FIX: Correct path with /qna prefix
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
      
      // Refresh list
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

  // Handle back
  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-red-700 mr-3" />
          <span className="text-lg">Loading Q&A...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-red-700 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Manage Q&A</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Q&A'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Q&A</h3>
          <form onSubmit={handleAddQna} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newQna.question}
                onChange={(e) => setNewQna({ ...newQna, question: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                placeholder="Enter the question..."
              />
              {formErrors.question && <p className="mt-1 text-sm text-red-500">{formErrors.question}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newQna.answer}
                onChange={(e) => setNewQna({ ...newQna, answer: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Enter the answer..."
              />
              {formErrors.answer && <p className="mt-1 text-sm text-red-500">{formErrors.answer}</p>}
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:bg-green-400"
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
          </form>
        </div>
      )}

      {/* Q&A Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Answer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qnas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No Q&A available yet. Add your first one above!
                  </td>
                </tr>
              ) : (
                qnas.map((qna) => (
                  <tr key={qna._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-md">
                        {qna.question}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === qna._id ? (
                        <div>
                          <textarea
                            value={editQna.answer}
                            onChange={(e) => setEditQna({ ...editQna, answer: e.target.value })}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Edit answer..."
                          />
                          {formErrors.answer && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.answer}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 max-w-lg" title={qna.answer}>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => startEdit(qna)}
                          disabled={editingId === qna._id}
                          className="flex items-center text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          {qna.answer ? "Edit Answer" : "Add Answer"}
                        </button>
                        <button
                          onClick={() => handleDelete(qna._id)}
                          disabled={deleteLoading[qna._id]}
                          className="flex items-center text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteLoading[qna._id] ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QnaAdmin;