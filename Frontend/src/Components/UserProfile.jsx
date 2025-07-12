import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import Logout from "./logout";

function UserProfile() {
  const [authUser] = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!authUser) return null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-full p-2 pr-4 hover:bg-white/20 transition-all duration-300 border border-white/20"
      >
        <img
          src={authUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.fullname)}&background=10b981&color=fff&size=40&rounded=true`}
          alt={authUser.fullname}
          className="w-10 h-10 rounded-full border-2 border-white/30"
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {authUser.fullname}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {authUser.email}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={authUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.fullname)}&background=10b981&color=fff&size=48&rounded=true`}
                  alt={authUser.fullname}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">{authUser.fullname}</p>
                  <p className="text-sm text-gray-600">{authUser.email}</p>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <a href="/profile" className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>My Profile</span>
              </a>
              
              <a href="/my-books" className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>My Books</span>
              </a>
              
              <a href="/course" className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Browse Books</span>
              </a>
              
              <a href="/library" className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Digital Library</span>
              </a>
              
              <a href="/open-library" className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Free Books</span>
              </a>
              
              <div className="border-t border-gray-100 mt-2 pt-2">
                <div className="px-4">
                  <Logout />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}

export default UserProfile;