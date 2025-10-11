import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../components/sharedItems/Navbar/Navbar";
import Footer from "../../components/sharedItems/Footer/Footer";

const MainLayout = () => {
  return (
    <div className="bg-[#f1ead7] min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50">
        <Navbar></Navbar>
      </nav>
      <main className="flex-1">
        <Outlet></Outlet>
      </main>
      <footer className="mt-auto">
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default MainLayout;