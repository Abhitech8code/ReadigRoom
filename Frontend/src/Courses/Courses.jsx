import React from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Course from "../Components/Course";
import Footer from "../Components/Footer";

function Courses() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-24 pb-12 bg-gradient-to-r from-blue-600 to-purple-700 text-white"
      >
        <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Explore Our
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Book Collection
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
          >
            Discover thousands of books across every genre imaginable
          </motion.p>
        </div>
      </motion.section>

      <Course />
      <Footer />
    </div>
  );
}

export default Courses;
