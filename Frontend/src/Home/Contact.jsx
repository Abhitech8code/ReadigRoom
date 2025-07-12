import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Enter a valid email";
    if (!formData.message.trim()) newErrors.message = "Message can't be empty";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      toast.success("Message sent successfully!", {
        style: { background: '#10B981', color: 'white', borderRadius: '12px' }
      });
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-24 pb-12 bg-gradient-to-r from-emerald-600 to-teal-700 text-white"
      >
        <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Get In
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Touch
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8"
          >
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              ← Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.section>
      
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-20">
        {/* Contact Form */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Form Section */}
            <div className="lg:w-1/2 p-12">
              <div className="mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                  Send us a Message
                </h2>
                <p className="text-gray-600 text-lg">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300 text-gray-800"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300 text-gray-800"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">Your Message</label>
                  <textarea
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300 text-gray-800 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-2">{errors.message}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitted}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {submitted ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </div>
                  ) : "Send Message"}
                </motion.button>
              </form>
            </div>

            {/* Contact Info Section */}
            <div className="lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 p-12 text-white">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-8">Get in Touch</h3>
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Email Us</h4>
                      <p className="opacity-90">support@readingroom.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Call Us</h4>
                      <p className="opacity-90">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Visit Us</h4>
                      <p className="opacity-90">123 Book Street, Reading City</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  <iframe
                    src="https://lottie.host/embed/4dbcdc0e-576e-408f-823b-c71a330b3090/Fds1cjdPSY.lottie"
                    className="w-full h-64 opacity-50"
                    title="Contact Animation"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;