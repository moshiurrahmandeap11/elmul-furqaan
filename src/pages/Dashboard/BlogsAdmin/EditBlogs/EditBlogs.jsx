import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import Swal from "sweetalert2";
import axiosInstance from '../../../../hooks/axiosIntance/AxiosIntance';

const EditBlogs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    tags: ""
  });
  const [currentImage, setCurrentImage] = useState(null); // Current thumbnail URL
  const [imagePreview, setImagePreview] = useState(null); // New image preview
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/blogs/${id}`);
        const blog = res.data;
        setFormData({
          title: blog.title || "",
          description: blog.description || "",
          thumbnail: blog.thumbnail || "",
          tags: blog.tags ? blog.tags.join(', ') : ""
        });
        setCurrentImage(blog.thumbnail || null);
      } catch (err) {
        console.error("Error fetching blog:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load blog data.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview new image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Store file for upload
      setFormData((prev) => ({ ...prev, imageFile: file }));
    }
  };

  // Upload image to ImgBB
  const uploadImageToImgBB = async (file) => {
    const formDataImgBB = new FormData();
    formDataImgBB.append('image', file);
    const IMG_BB_API_KEY = 'b71e82bef4abc2fc5b5954901bf3cde4';

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`,
        {
          method: 'POST',
          body: formDataImgBB,
        }
      );
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw error;
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.imageFile && !formData.thumbnail) errors.thumbnail = "Thumbnail image is required";
    if (!formData.tags.trim()) errors.tags = "Tags are required";
    return errors;
  };

  // Handle form submission (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill out all required fields.",
      });
      return;
    }

    setSubmitLoading(true);
    try {
      let thumbnailUrl = formData.thumbnail;
      if (formData.imageFile) {
        // Upload new image
        thumbnailUrl = await uploadImageToImgBB(formData.imageFile);
      }

      // Prepare blog data
      const blogData = {
        title: formData.title,
        description: formData.description,
        thumbnail: thumbnailUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      // Update via backend (PUT)
      await axiosInstance.put(`/blogs/${id}`, blogData);

      // Success
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Blog updated successfully!",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate('/blogs'); // Redirect to blogs list after success
      });

    } catch (err) {
      console.error("Error updating blog:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update blog. Please try again.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle back to blogs list
  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <span className="ml-3 text-lg">Loading blog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-red-700 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Blogs
        </button>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Edit Blog
        </h2>
      </div>

            <form
  onSubmit={handleSubmit}
  onKeyDown={(e) => {
    // Prevent Enter key from submitting form unless user presses Ctrl+Enter
    if (e.key === 'Enter' && e.target.tagName === 'TEXTAREA' && !e.ctrlKey) {
      e.stopPropagation();
    }
  }}
  className="bg-white p-6 rounded-xl shadow-lg space-y-6"
>
        {/* Thumbnail Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail Image <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Current Image */}
            {currentImage && (
              <div className="flex-shrink-0">
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <img
                  src={currentImage}
                  alt="Current thumbnail"
                  className="w-48 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            {/* New Image Upload */}
            <div className="flex-1">
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                  <img
                    src={imagePreview}
                    alt="New preview"
                    className="w-48 h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
          {formErrors.thumbnail && (
            <p className="mt-1 text-sm text-red-500">{formErrors.thumbnail}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter blog title"
          />
          {formErrors.title && (
            <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
          )}
        </div>

        {/* Description - Basic Textarea */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your blog description. Use **text** for bold, - for bullet points, 1. for numbered lists."
            rows="8"
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Tip: Use simple markdown like **bold**, *italic*, - bullet points for formatting.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags <span className="text-red-500">*</span> (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.tags ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., islam, quran, sunnah"
          />
          {formErrors.tags && (
            <p className="mt-1 text-sm text-red-500">{formErrors.tags}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitLoading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:bg-blue-400"
        >
          {submitLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating Blog...
            </span>
          ) : (
            "Update Blog"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditBlogs;