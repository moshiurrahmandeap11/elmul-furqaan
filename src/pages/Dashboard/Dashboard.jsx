import React, { useState } from "react";
import {
  Home,
  FileText,
  Video,
  Info,
  MessageCircle,
  Menu,
  X,
  Settings,
} from "lucide-react";
import HomeAdmin from "./HomeAdmin/HomeAdmin";
import NavbarAdmin from "./NavbarAdmin/NavbarAdmin";
import SystemSettings from "./SystemSettings/SystemSettings";

// Page Components

const NavbarPage = () => (
  <div>
    <NavbarAdmin></NavbarAdmin>
  </div>
)

const HomePage = () => (
  <div className="p-4">
    <HomeAdmin></HomeAdmin>
  </div>
);

const BlogsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Blogs</h1>
    <p className="text-gray-600">Explore our latest blog posts and articles.</p>
  </div>
);

const VideosPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Videos</h1>
    <p className="text-gray-600">Watch our video content and tutorials.</p>
  </div>
);

const AboutPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">About Us</h1>
    <p className="text-gray-600">Learn more about our company and mission.</p>
  </div>
);

const QNAPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Q&A</h1>
    <p className="text-gray-600">Find answers to frequently asked questions.</p>
  </div>
);

const SystemSettingsPage = () => (
  <div>
    <SystemSettings />
  </div>
)

const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {id: "navbar", label: "Navbar", icon: Home, component: NavbarPage },
    { id: "home", label: "Home", icon: Home, component: HomePage },
    { id: "blogs", label: "Blogs", icon: FileText, component: BlogsPage },
    { id: "videos", label: "Videos", icon: Video, component: VideosPage },
    { id: "about", label: "About Us", icon: Info, component: AboutPage },
    { id: "qna", label: "QNA", icon: MessageCircle, component: QNAPage },
    { id: "system-settings", label: "System Settings", icon: Settings, component: SystemSettingsPage },
  ];

  const ActiveComponent =
    menuItems.find((item) => item.id === activePage)?.component || HomePage;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
          <nav>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activePage === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h3 className="ml-4 text-xl font-semibold text-gray-800">
            {menuItems.find((item) => item.id === activePage)?.label}
          </h3>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-white m-4 rounded-lg shadow">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
