import React, { useState, useEffect } from "react";
import axiosInstance from "../../../hooks/axiosIntance/AxiosIntance";


const NavbarAdmin = () => {
  const [logo, setLogo] = useState("");
  const [navItems, setNavItems] = useState([]);
  const [buttonText, setButtonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch current navbar config on mount
  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const res = await axiosInstance.get("/navbar");
        const { logo, navItems, buttonText } = res.data;
        setLogo(logo?.value || "");
        setNavItems(navItems || []);
        setButtonText(buttonText || "Get Started");
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch navbar");
      }
    };
    fetchNavbar();
  }, []);

  const toggleVisibility = (index) => {
    const updated = [...navItems];
    updated[index].visible = !updated[index].visible;
    setNavItems(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      await axiosInstance.put("/navbar", {
        logo: { type: "url", value: logo },
        navItems,
        buttonText,
      });
      setMessage("✅ Navbar updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update navbar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Preview Navbar */}
      <nav className="flex items-center justify-between bg-gray-800 text-white px-6 py-3 rounded-lg shadow-md">
        {/* Logo */}
        {logo && <img src={logo} alt="Logo" className="h-10 w-auto" />}

        {/* Nav Items */}
        <ul className="hidden md:flex space-x-6">
          {navItems.map(
            (item, i) =>
              item.visible && (
                <li key={i} className="hover:text-blue-400 cursor-pointer">
                  {item.name}
                </li>
              )
          )}
        </ul>

        {/* Button */}
        <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          {buttonText}
        </button>
      </nav>

      {/* Control Panel */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">⚙️ Navbar Control Panel</h2>

        {/* Logo Control */}
        <div className="mb-4">
          <label className="block font-medium">Logo URL:</label>
          <input
            type="text"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* Nav Items Control */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Nav Items Visibility:</h3>
          {navItems.map((item, i) => (
            <label key={i} className="flex items-center space-x-2 mb-1">
              <input
                type="checkbox"
                checked={item.visible}
                onChange={() => toggleVisibility(i)}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>

        {/* Button Text Control */}
        <div className="mb-4">
          <label className="block font-medium">Get Started Button Text:</label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>

        {/* Message */}
        {message && <p className="mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default NavbarAdmin;
