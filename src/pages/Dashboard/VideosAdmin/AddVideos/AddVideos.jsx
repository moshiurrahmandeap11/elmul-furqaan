import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Video, Image as ImageIcon } from 'lucide-react';
import Swal from "sweetalert2";
import axiosInstance from '../../../../hooks/axiosIntance/AxiosIntance';


const AddVideos = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoUrl: "",
    tags: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
      // Preview
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
    if (!formData.videoUrl.trim()) errors.videoUrl = "Video URL is required";
    if (!formData.tags.trim()) errors.tags = "Tags are required";
    return errors;
  };

  // Handle form submission
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

    setIsLoading(true);
    try {
      let thumbnailUrl = formData.thumbnail;
      if (formData.imageFile) {
        // Upload new image
        thumbnailUrl = await uploadImageToImgBB(formData.imageFile);
      }

      // Prepare video data
      const videoData = {
        title: formData.title,
        description: formData.description,
        thumbnail: thumbnailUrl,
        videoUrl: formData.videoUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      // Post to backend
      await axiosInstance.post("/videos", videoData);

      // Success
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Video added successfully!",
      });

      // Reset form and navigate back
      setFormData({
        title: "",
        description: "",
        thumbnail: "",
        videoUrl: "",
        tags: ""
      });
      setImagePreview(null);
      setFormErrors({});
      document.getElementById('imageInput').value = ''; // Clear file input
      navigate(-1); // Navigate back to admin after success

    } catch (err) {
      console.error("Error adding video:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add video. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back to videos admin
  const handleBack = () => {
    navigate('/videos-admin');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-red-700 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Videos
        </button>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Add New Video
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        {/* Thumbnail Image */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
            Thumbnail Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.thumbnail && (
            <p className="mt-1 text-sm text-red-500">{formErrors.thumbnail}</p>
          )}
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
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
            placeholder="Enter video title"
          />
          {formErrors.title && (
            <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
          )}
        </div>

        {/* Video URL */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Video className="h-4 w-4 mr-2 text-gray-500" />
            Video URL <span className="text-red-500">*</span> (YouTube embed or direct link)
          </label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.videoUrl ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://www.youtube.com/embed/VIDEO_ID or direct video URL"
          />
          {formErrors.videoUrl && (
            <p className="mt-1 text-sm text-red-500">{formErrors.videoUrl}</p>
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
            placeholder="Enter video description. Use **text** for bold, - for bullet points, 1. for numbered lists."
            rows="6"
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
            placeholder="e.g., islamic, lecture, quran"
          />
          {formErrors.tags && (
            <p className="mt-1 text-sm text-red-500">{formErrors.tags}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-red-700 text-white rounded-lg shadow-md hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:bg-red-400"
        >
          {isLoading ? (
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
              Adding Video...
            </span>
          ) : (
            "Add Video"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddVideos;