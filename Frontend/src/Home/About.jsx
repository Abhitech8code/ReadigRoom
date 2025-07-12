import React from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-24 pb-12 bg-gradient-to-r from-purple-600 to-blue-700 text-white"
      >
        <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            About
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Reading Room
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto"
          >
            Your gateway to timeless knowledge, new adventures, and limitless imagination
          </motion.p>
        </div>
      </motion.section>
      
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-20">
        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 mb-16"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Our Story
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                At Reading Room, we believe in the transformative power of books. Founded with a passion for literature and learning, we've created a digital sanctuary where book lovers can discover, explore, and connect with stories that matter.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                From timeless classics to contemporary bestsellers, our carefully curated collection spans every genre imaginable. We're not just a bookstore – we're a community of readers, dreamers, and lifelong learners.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <iframe
                src="https://lottie.host/embed/fd64b1b5-ce80-489c-8303-21be51bec040/4Z9Mo8ijM3.lottie"
                title="About us illustration"
                className="rounded-2xl w-full h-[400px] object-contain"
                loading="lazy"
              ></iframe>
            </motion.div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: "🌟",
              title: "Our Mission",
              description: "To cultivate a culture of curiosity and continuous learning by making books accessible to everyone, everywhere."
            },
            {
              icon: "👁️",
              title: "Our Vision",
              description: "To become the world's most trusted platform for book discovery and literary community building."
            },
            {
              icon: "💎",
              title: "Our Values",
              description: "Quality, accessibility, community, and the unwavering belief that every book has the power to change a life."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {item.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-r from-purple-600 to-blue-700 rounded-3xl p-12 text-white"
        >
          <h3 className="text-4xl font-bold mb-6">Ready to Start Reading?</h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who have discovered their next favorite book with us
          </p>
          <motion.a
            href="/course"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore Our Collection
          </motion.a>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default About;