import React from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Banner from "../Components/Banner";
import Freebook from "../Components/Freebook";
import Footer from "../Components/Footer";
import FeaturedCollection from "../Components/FeaturedCollection";

function Home() {
  const items = [
    {
      image:
        "https://img.freepik.com/premium-photo/react-js-programming-language-with-laptop-code-script-screen_1020200-5413.jpg?uid=R157439276&ga=GA1.1.390215850.1702361898&semt=ais_items_boosted&w=740",
      name: "React Book",
      category: "Programming",
      title: "Learn React from Scratch",
      price: 29.99,
    },
    {
      image:
        "https://th.bing.com/th/id/OIP.xx3J_r1dWn6iU2G5mD3T4AHaJI?rs=1&pid=ImgDetMain",
      name: "Node.js Mastery",
      category: "Backend",
      title: "Deep Dive into Node.js",
      price: 34.99,
    },
    {
      image:
        "https://th.bing.com/th/id/OIP.kxUdl9oDP2fWpMl1V6n5UgHaJy?o=7rm=3&rs=1&pid=ImgDetMain",
      name: "JavaScript Basics",
      category: "Frontend",
      title: "Master JavaScript Fundamentals",
      price: 19.99,
    },
    {
      image:
        "https://1.bp.blogspot.com/-_gie8qAwZPY/X0HgTfDEoMI/AAAAAAAAIjk/KsZvNYbtGHU6Dq9wi7koZ-QYfSLa8MgYwCLcBGAsYHQ/s1600/touchmaster_1598152338675.jpeg",
      name: "Python",
      category: "AI & ML",
      title: "Intro to Python",
      price: 39.99,
    },
    {
      image:
        "https://th.bing.com/th/id/OIP.DvLwAkxUIwhj0o7vrahASgHaLG?rs=1&pid=ImgDetMain",
      name: "HTML&CSS",
      category: "WebDesign",
      title: "Responsive UI/UX",
      price: 14.99,
    },
    {
      image: "https://m.media-amazon.com/images/I/51a0slNQpoL.jpg",
      name: "Data Structures",
      category: "DSA",
      title: "DSA in Easy Steps",
      price: 24.99,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      <Banner />
      
      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl"
      >
        <div className="max-w-screen-2xl container mx-auto px-4 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Happy Readers" },
              { number: "500+", label: "Books Available" },
              { number: "50+", label: "Categories" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Freebook />

      <FeaturedCollection />

      {/* Newsletter Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="py-20 bg-gradient-to-r from-emerald-600 to-teal-700 text-white"
      >
        <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 text-center">
          <h3 className="text-4xl font-bold mb-6">Stay Updated</h3>
          <p className="text-xl mb-8 opacity-90">Get notified about new books and exclusive offers</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

export default Home;
