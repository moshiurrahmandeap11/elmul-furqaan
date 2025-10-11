import { createBrowserRouter } from "react-router";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Home from "../../pages/Home/Home";
import Blogs from "../../pages/Blogs/Blogs";
import Videos from "../../pages/Videos/Videos";
import AboutUs from "../../pages/AboutUs/AboutUs";
import ContactUs from "../../pages/ContactUs/ContactUs";
import QNA from "../../pages/Home/QNA/QNA";
import DashboardLayout from "../../layouts/MainLayout/DashboardLayout/DashboardLayout";
import Dashboard from "../../pages/Dashboard/Dashboard";
import AddBlog from "../../pages/Dashboard/BlogsAdmin/AddBlog/AddBlog";
import BlogsDetails from "../../pages/Blogs/BlogsDetails/BlogsDetails";
import EditBlogs from "../../pages/Dashboard/BlogsAdmin/EditBlogs/EditBlogs";
import AddVideos from "../../pages/Dashboard/VideosAdmin/AddVideos/AddVideos";
import EditVideos from "../../pages/Dashboard/VideosAdmin/EditVideos/EditVideos";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import SearchResults from "../../components/sharedItems/Navbar/SearchResults/SearchResults";
import VideoDetails from "../../pages/Videos/VideosAdmin/VideosDetails";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/blogs",
        element: <Blogs></Blogs>
      },
      {
        path: "/blogs/:id",
        element: <BlogsDetails></BlogsDetails>
      },
      {
        path: "/videos",
        element: <Videos></Videos>
      },
      {

        path: "/videos/:id",
        element: <VideoDetails></VideoDetails>
      },
      {
        path: "/about",
        element: <AboutUs></AboutUs>
      },
      {
        path: "/questions",
        element: <QNA></QNA>
      },
      {
        path: "/contact",
        element: <ContactUs></ContactUs>
      },
      {
        path: "/search",
        element: <SearchResults></SearchResults>
      }
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute><DashboardLayout></DashboardLayout></ProtectedRoute>,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard></Dashboard>
      },
      {
        path: "/add-blogs",
        element: <AddBlog></AddBlog>
      },
      {
        path: "/edit-blogs/:id",
        element: <EditBlogs></EditBlogs>
      },
      {
        path: "/add-video",
        element: <AddVideos></AddVideos>
      },
      {
        path: "/edit-video/:id",
        element: <EditVideos></EditVideos>
      }
    ]
  }
]);
