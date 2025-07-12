import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

function Logout() {
  const [authUser, setAuthUser] = useAuth();
  
  const handleLogout = () => {
    try {
      setAuthUser(null);
      localStorage.removeItem("Users");
      toast.success("Logged out successfully!", {
        style: { background: '#10B981', color: 'white', borderRadius: '12px' }
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Error logging out", {
        style: { background: '#EF4444', color: 'white', borderRadius: '12px' }
      });
    }
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Sign Out</span>
    </motion.button>
  );
}

export default Logout;
