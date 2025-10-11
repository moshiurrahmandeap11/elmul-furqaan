import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../components/sharedItems/Navbar/Navbar";
import Footer from "../../components/sharedItems/Footer/Footer";

const MainLayout = () => {
  return (
    <div className="bg-[#f1ead7]">
      <nav className="sticky top-0 z-50">
        <Navbar></Navbar>
      </nav>
      <main>
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default MainLayout;
