import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import bannerImg from "/Banner.jpg";
import { motion } from "framer-motion";

function Banner() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError(emailRegex.test(value) ? "" : "Enter a valid email");
  };

  return (
    <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
      {/* === Left Content === */}
      <motion.div
        className="w-full md:w-1/2 space-y-8 mt-12"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
          Empower Your Mind with{" "}
          <span className="text-emerald-500">Books & Ideas</span>
        </h1>

        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">
          Discover a world of learning at your fingertips. From
          thought-provoking classics to trending bestsellers, our collection
          brings wisdom and wonder to every reader. Start your journey now—read,
          grow, and transform.
        </p>

        {/* === Email Input === */}
        <div>
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="h-5 w-5 text-emerald-500 dark:text-emerald-400 transition"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Your email address"
              className="grow bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
              aria-label="Email"
            />
          </label>
          {error && (
            <p className="text-sm mt-1 text-red-500 transition-opacity duration-200">
              {error}
            </p>
          )}
        </div>

        {/* === CTA Button === */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <NavLink
            to="/course"
            className="inline-block px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold rounded-full shadow-md hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </NavLink>
        </motion.div>
      </motion.div>

      {/* === Right Side Image === */}
      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
       <div className=" rounded-xl ">
  <iframe
    src="https://lottie.host/embed/d040274e-7acc-4b15-b5f5-bcb90854ba55/XiiGgsp5ms.lottie"
    title="Learning Banner"
    className="w-full h-[450px] scale-[1.3] -translate-y-10 object-cover transition-transform duration-500 hover:scale-[1.35] dark:brightness-90 dark:contrast-110"
    style={{ transformOrigin: "top center" }}
    loading="lazy"
  ></iframe>
</div>

      </motion.div>
    </div>
  );
}

export default Banner;
