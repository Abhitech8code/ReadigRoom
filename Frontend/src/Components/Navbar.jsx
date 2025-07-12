import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Login from "./Login";
import UserProfile from "./UserProfile";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [authUser] = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [sticky, setSticky] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const element = document.documentElement;
    const body = document.body;
    if (theme === "dark") {
      element.classList.add("dark");
      body.classList.add("dark");
    } else {
      element.classList.remove("dark");
      body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);



  const navItems = ["Home", "Course", "Contact", "About"].map((item) => (
    <li key={item}>
      <a
        href={`/${item.toLowerCase()}`}
        className="transition hover:text-emerald-500 duration-300"
      >
        {item}
      </a>
    </li>
  ));

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        sticky
          ? "bg-white/90 shadow-md backdrop-blur-md dark:bg-gray-900/80"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-3 flex justify-between items-center">
        {/* Logo - Clickable to Home */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group hover:scale-105 transition duration-300 cursor-pointer"
          title="Go to Home"
        >
          <div className="relative">
            <img
              src="/reading-book.png"
              alt="ReadingRoom Logo"
              className="h-12 w-12 object-contain animate-pulse"
            />
            <span className="absolute -inset-1 bg-emerald-300 opacity-20 blur-xl rounded-full group-hover:opacity-30"></span>
          </div>
          <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 bg-clip-text text-transparent tracking-tight">
            ReadingRoom
          </span>
        </div>

        {/* Nav Links */}
        <ul className="hidden lg:flex gap-6 text-base font-medium items-center ml-8">
          {navItems}
          <li>
            <motion.a
              href="/open-library"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 group"
            >
              <div className="relative">
                <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <span>Free Books</span>
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                FREE
              </span>
            </motion.a>
          </li>
        </ul>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4 relative">
          {/* Desktop Search Bar */}
          <div className="hidden lg:block">
            <SearchBar className="mx-2" />
          </div>
          
          {/* Mobile Search Bar */}
          <div className="lg:hidden">
            <SearchBar isMobile={true} className="w-48" />
          </div>

          {/* Dark Mode */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-xl p-2 hover:bg-gray-200 dark:hover:bg-emerald-800 rounded-full transition"
          >
            {theme === "light" ? "☀️" : "🌙"}
          </button>

          {/* Auth Section */}
          {authUser ? (
            <UserProfile />
          ) : (
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById("my_modal_3").showModal()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign In
              </motion.button>
              <Login />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow bg-white rounded-box w-52 dark:bg-gray-800 dark:text-white"
          >
            {navItems}
            <li>
              <a
                href="/open-library"
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg px-3 py-2 font-semibold mt-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Free Books</span>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  FREE
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
