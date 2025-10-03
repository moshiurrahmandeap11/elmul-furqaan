import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../../hooks/axiosIntance/AxiosIntance";
import Swal from "sweetalert2";
import { Image, Type, Link } from "lucide-react"; // Using Lucide icons

const BannerTextAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    image: "",
    heading: "",
    subheading: "",
    button1Text: "",
    button1Link: "",
    button2Text: "",
    button2Link: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/banner");
        setBanners(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching banners", err);
        setError("Failed to fetch banners. Please try again.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch banners. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    // Only enforce required fields for POST (when not editing)
    if (!editingId) {
      if (!formData.image) errors.image = "Image URL is required";
      else if (!isValidUrl(formData.image)) errors.image = "Please enter a valid URL";
      if (!formData.heading) errors.heading = "Heading is required";
      if (!formData.subheading) errors.subheading = "Subheading is required";
      if (!formData.button1Text) errors.button1Text = "Button 1 Text is required";
      if (!formData.button2Text) errors.button2Text = "Button 2 Text is required";
    } else {
      // For edit, only validate image URL if provided
      if (formData.image && !isValidUrl(formData.image)) {
        errors.image = "Please enter a valid URL";
      }
    }
    return errors;
  };

  // URL validation helper
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill out all required fields correctly.",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingId) {
        // Update existing banner
        await axiosInstance.put(`/banner/${editingId}`, formData);
        setBanners(
          banners.map((banner) =>
            banner._id === editingId ? { ...banner, ...formData } : banner
          )
        );
        setEditingId(null);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Banner updated successfully!",
        });
      } else {
        // Add new banner
        const res = await axiosInstance.post("/banner", formData);
        setBanners([...banners, { _id: res.data.insertedId, ...formData }]);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Banner added successfully!",
        });
      }
      // Reset form
      setFormData({
        image: "",
        heading: "",
        subheading: "",
        button1Text: "",
        button1Link: "",
        button2Text: "",
        button2Link: "",
      });
      setError(null);
      setFormErrors({});
    } catch (err) {
      console.error("Error saving banner", err);
      setError("Failed to save banner. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save banner. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (banner) => {
    setFormData({
      image: banner.image || "",
      heading: banner.heading || "",
      subheading: banner.subheading || "",
      button1Text: banner.button1Text || "",
      button1Link: banner.button1Link || "",
      button2Text: banner.button2Text || "",
      button2Link: banner.button2Link || "",
    });
    setEditingId(banner._id);
    setFormErrors({});
  };

  // Handle delete button click with confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the banner!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await axiosInstance.delete(`/banner/${id}`);
        setBanners(banners.filter((banner) => banner._id !== id));
        setError(null);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Banner deleted successfully!",
        });
      } catch (err) {
        console.error("Error deleting banner", err);
        setError("Failed to delete banner. Please try again.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete banner. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
        Manage Banner Content
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Form for adding/editing banners */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL {editingId ? "" : <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Image
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className={`pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  formErrors.image ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com/image.jpg"
                aria-describedby={formErrors.image ? "image-error" : undefined}
              />
            </div>
            {formErrors.image && (
              <p id="image-error" className="mt-1 text-sm text-red-500">
                {formErrors.image}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="heading"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Heading (use \n for line breaks) {editingId ? "" : <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Type
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                className={`pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  formErrors.heading ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., بسم الله الرحمن الرحيم\nWelcome to Elmufurqaan"
                aria-describedby={formErrors.heading ? "heading-error" : undefined}
              />
            </div>
            {formErrors.heading && (
              <p id="heading-error" className="mt-1 text-sm text-red-500">
                {formErrors.heading}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="subheading"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subheading {editingId ? "" : <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Type
                className="absolute left-3 top-4 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <textarea
                id="subheading"
                name="subheading"
                value={formData.subheading}
                onChange={handleInputChange}
                className={`pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  formErrors.subheading ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter a brief description for the banner"
                rows="4"
                aria-describedby={formErrors.subheading ? "subheading-error" : "subheading-description"}
              />
            </div>
            {formErrors.subheading ? (
              <p id="subheading-error" className="mt-1 text-sm text-red-500">
                {formErrors.subheading}
              </p>
            ) : (
              <p id="subheading-description" className="mt-1 text-sm text-gray-500">
                Optional description to appear below the heading when editing.
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="button1Text"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Button 1 Text {editingId ? "" : <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Type
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                id="button1Text"
                name="button1Text"
                value={formData.button1Text}
                onChange={handleInputChange}
                className={`pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  formErrors.button1Text ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Explore Blogs"
                aria-describedby={formErrors.button1Text ? "button1Text-error" : undefined}
              />
            </div>
            {formErrors.button1Text && (
              <p id="button1Text-error" className="mt-1 text-sm text-red-500">
                {formErrors.button1Text}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="button1Link"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Button 1 Link
            </label>
            <div className="relative">
              <Link
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                id="button1Link"
                name="button1Link"
                value={formData.button1Link}
                onChange={handleInputChange}
                className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., /blogs"
              />
            </div>
          </div>
          <div className="relative">
            <label
              htmlFor="button2Text"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Button 1 Text {editingId ? "" : <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Type
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                id="button2Text"
                name="button2Text"
                value={formData.button2Text}
                onChange={handleInputChange}
                className={`pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  formErrors.button2Text ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Watch Videos"
                aria-describedby={formErrors.button2Text ? "button2Text-error" : undefined}
              />
            </div>
            {formErrors.button2Text && (
              <p id="button2Text-error" className="mt-1 text-sm text-red-500">
                {formErrors.button2Text}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="button2Link"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Button 2 Link
            </label>
            <div className="relative">
              <Link
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                id="button2Link"
                name="button2Link"
                value={formData.button2Link}
                onChange={handleInputChange}
                className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., /videos"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
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
              Saving...
            </span>
          ) : editingId ? (
            "Update Banner"
          ) : (
            "Add Banner"
          )}
        </button>
      </form>

      {/* List of banners */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Existing Banners
        </h3>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : banners.length === 0 ? (
          <p className="text-gray-500 text-center">No banners found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Image
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Heading
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Subheading
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Buttons
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt="Banner"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {banner.heading ? banner.heading.replace("\n", " | ") : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {banner.subheading || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {banner.button1Text ? (
                        <span>
                          {banner.button1Text} ({banner.button1Link || "N/A"})
                        </span>
                      ) : (
                        "N/A"
                      )}
                      <br />
                      {banner.button2Text ? (
                        <span>
                          {banner.button2Text} ({banner.button2Link || "N/A"})
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerTextAdmin;