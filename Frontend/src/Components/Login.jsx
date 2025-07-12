import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
  const dialogRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post("http://localhost:4001/user/login", userInfo);
      if (res.data) {
        toast.success("Welcome back! 🎉", {
          style: { background: '#10B981', color: 'white', borderRadius: '12px' }
        });
        localStorage.setItem("Users", JSON.stringify(res.data.user));
        
        if (dialogRef.current && dialogRef.current.open) {
          dialogRef.current.close();
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        style: { background: '#EF4444', color: 'white', borderRadius: '12px' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <dialog ref={dialogRef} id="my_modal_3" className="modal">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="modal-box max-w-4xl w-full h-[600px] p-0 bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex h-full">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-8 mx-auto backdrop-blur-xl">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                  <p className="text-xl opacity-90 leading-relaxed">
                    Continue your reading journey with thousands of books at your fingertips
                  </p>
                </motion.div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
              {/* Close Button */}
              <form method="dialog" className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h3>
                  <p className="text-gray-600">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email"
                        }
                      })}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-2 ml-1"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      {...register("password", { required: "Password is required" })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-6.415-6.414M14.121 14.121l2.122 2.122M14.121 14.121L16.95 16.95M14.121 14.121l-4.243-4.243m6.415 6.414L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                    <AnimatePresence>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-2 ml-1"
                        >
                          {errors.password.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>

                  {/* Signup Link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                        onClick={() => dialogRef.current?.close()}
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </dialog>
    </div>
  );
}

export default Login;