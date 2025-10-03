import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";
import axiosInstance from "../../../../hooks/axiosIntance/AxiosIntance";

const BannerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const imgbbApiKey = "b71e82bef4abc2fc5b5954901bf3cde4";

  // 🔹 Fetch all banners
  const fetchBanners = async () => {
    try {
      const res = await axiosInstance.get("/banner");
      setBanners(res.data);
    } catch (err) {
      console.error("Error fetching banners", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 🔹 Handle file change + validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      Swal.fire("Invalid file!", "Only PNG, JPG, JPEG allowed", "error");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      Swal.fire("File too large!", "Max size is 3MB", "error");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // 🔹 Upload banner
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      Swal.fire("No image selected", "Please select an image", "warning");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // Upload to imgbb
      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await imgbbRes.json();

      if (data.success) {
        const newBanner = { image: data.data.url };

        await axiosInstance.post("/banner", newBanner);

        Swal.fire("Success!", "Banner uploaded successfully", "success");
        setImageFile(null);
        setPreview(null);
        fetchBanners();
      } else {
        Swal.fire("Error", "Failed to upload image", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete banner
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This banner will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/banner/${id}`);
          Swal.fire("Deleted!", "Your banner has been deleted.", "success");
          fetchBanners();
        } catch  {
          Swal.fire("Error", "Failed to delete banner", "error");
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Banner Admin</h1>

      {/* Add Banner Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleFileChange}
            className="border p-2 rounded w-full md:w-1/2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-20 object-cover rounded shadow"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      {/* Banner List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Banners</h2>
        {banners.length === 0 ? (
          <p className="text-gray-600">No banners found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="relative group border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={banner.image}
                  alt="Banner"
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerAdmin;
