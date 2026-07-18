import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Sidebar open on desktop, closed on mobile
  const [sidebar, setSidebar] = useState(window.innerWidth >= 768);

  // Automatically handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebar(true);
      } else {
        setSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return user ? (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="w-full h-14 px-6 flex items-center justify-between border-b border-gray-200 bg-white relative z-[60]">
        <img
          src={assets.logo}
          alt="logo"
          onClick={() => navigate("/")}
          className="cursor-pointer w-32"
        />

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebar(!sidebar)}
          className="md:hidden"
        >
          {sidebar ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </nav>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          sidebar={sidebar}
          setSidebar={setSidebar}
        />

        {/* Overlay */}
        {sidebar && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebar(false)}
          />
        )}

        {/* Page */}
        <main className="flex-1 overflow-y-auto bg-[#F4F7FB]">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
