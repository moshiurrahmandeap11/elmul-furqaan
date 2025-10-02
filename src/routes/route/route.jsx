import { createBrowserRouter } from "react-router";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Home from "../../pages/Home/Home";
import Blogs from "../../pages/Blogs/Blogs";
import Videos from "../../pages/Videos/Videos";
import AboutUs from "../../pages/AboutUs/AboutUs";
import ContactUs from "../../pages/ContactUs/ContactUs";


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
        path: "/videos",
        element: <Videos></Videos>
      },
      {
        path: "/about",
        element: <AboutUs></AboutUs>
      },
      {
        path: "/contact",
        element: <ContactUs></ContactUs>
      }
    ],
  },
]);
