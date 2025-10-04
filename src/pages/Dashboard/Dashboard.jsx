import React, { useState } from "react";
import {
  Home,
  FileText,
  Video,
  Info,
  MessageCircle,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import SystemSettings from "./SystemSettings/SystemSettings";
import BannerAdmin from "./HomeAdmin/BannerAdmin/BannerAdmin";
import BannerTextAdmin from "./HomeAdmin/BannerAdmin/BannerTextAdmin/BannerTextAdmin";
import BlogsAdmin from "./BlogsAdmin/BlogsAdmin";
import VideosAdmin from "./VideosAdmin/VideosAdmin";
import AboutUsAdmin from "./AboutUsAdmin/AboutUsAdmin";
import QnaAdmin from "./QnaAdmin/QnaAdmin";

// ---------------- Pages ----------------
const HomePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Home Page</h1>
    <p className="text-gray-600">Welcome to your dashboard.</p>
  </div>
);

const BannerPage = () => (
  <div className="p-8">
    <BannerAdmin></BannerAdmin>
  </div>
);

const BannerTextPage = () => (
  <div className="p-8">
    <BannerTextAdmin></BannerTextAdmin>
  </div>
);

const BlogsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Blogs</h1>
    <p className="text-gray-600">Manage all blog posts here.</p>
  </div>
);

const VideosPage = () => (
  <div className="p-8">
    <VideosAdmin></VideosAdmin>
  </div>
);

const AboutPage = () => (
  <div className="p-8">
    <AboutUsAdmin></AboutUsAdmin>
  </div>
);

const QNAPage = () => (
  <div className="p-8">
    <QnaAdmin></QnaAdmin>
  </div>
);

const SystemSettingsPage = () => (
  <div className="p-8">
    <SystemSettings></SystemSettings>
  </div>
);

// ---------------- Menu Items ----------------
const menuItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    component: HomePage,
    subItems: [
      { id: "banner", label: "Banner", component: BannerPage },
      { id: "banner-text", label: "Banner Text", component: BannerTextPage },
    ],
  },
  { id: "blogs", label: "Blogs", icon: FileText, component: BlogsAdmin },
  { id: "videos", label: "Videos", icon: Video, component: VideosPage },
  { id: "about", label: "About Us", icon: Info, component: AboutPage },
  { id: "qna", label: "QNA", icon: MessageCircle, component: QNAPage },
  {
    id: "system-settings",
    label: "System Settings",
    icon: Settings,
    component: SystemSettingsPage,
  },
];

// ---------------- Main Dashboard ----------------
const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ActiveComponent =
    menuItems
      .flatMap((item) => [item, ...(item.subItems || [])])
      .find((item) => item.id === activePage)?.component || HomePage;

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleMenuClick = (item) => {
    if (item.subItems && item.subItems.length > 0) {
      toggleMenu(item.id);
      // If menu has subitems, don't change active page, just expand
    } else {
      setActivePage(item.id);
      setMobileMenuOpen(false);
    }
  };

  const handleSubItemClick = (subId) => {
    setActivePage(subId);
    setMobileMenuOpen(false);
  };

  const getPageTitle = () => {
    const allItems = menuItems.flatMap((item) => [
      item,
      ...(item.subItems || []),
    ]);
    return (
      allItems.find((item) => item.id === activePage)?.label || "Dashboard"
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden lg:flex flex-col`}
      >
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus[item.id];
            const isActive = activePage === item.id;

            return (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={!sidebarOpen ? item.label : ""}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} />
                    {sidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                  {sidebarOpen && hasSubItems && (
                    <span className="text-gray-400">
                      {isExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </span>
                  )}
                </button>

                {/* SubItems */}
                {sidebarOpen && hasSubItems && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubItemClick(sub.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                          activePage === sub.id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        {sidebarOpen && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
            <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <aside className="fixed top-0 left-0 h-screen w-64 bg-white z-50 lg:hidden flex flex-col shadow-xl">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedMenus[item.id];

                return (
                  <div key={item.id} className="mb-1">
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        activePage === item.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {hasSubItems && (
                        <span className="text-gray-400">
                          {isExpanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </span>
                      )}
                    </button>

                    {hasSubItems && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleSubItemClick(sub.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                              activePage === sub.id
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
              <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
              <User size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
