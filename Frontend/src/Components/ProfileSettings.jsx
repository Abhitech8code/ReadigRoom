import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ProfileSettings() {
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: authUser?.fullname || "",
    email: authUser?.email || "",
    avatar: authUser?.avatar || ""
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = { ...authUser, ...profileData };
    setAuthUser(updatedUser);
    localStorage.setItem("Users", JSON.stringify(updatedUser));
    setIsEditing(false);
    toast.success("Profile updated successfully!", {
      style: { background: '#10B981', color: 'white', borderRadius: '12px' }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <Navbar />
      
      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate(-1)}
        className="fixed top-24 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full shadow-lg hover:shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 group"
      >
        <svg className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>
      
      <div className="max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white relative">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="opacity-90">Manage your account information</p>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Photo Section */}
              <div className="lg:w-1/3">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullname)}&background=10b981&color=fff&size=150&rounded=true`}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mt-4">{profileData.fullname}</h3>
                  <p className="text-gray-600">{profileData.email}</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:w-2/3">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullname}
                      onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 disabled:opacity-60"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    {!isEditing ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Edit Profile
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSave}
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Save Changes
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setIsEditing(false);
                            setProfileData({
                              fullname: authUser?.fullname || "",
                              email: authUser?.email || "",
                              avatar: authUser?.avatar || ""
                            });
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          Cancel
                        </motion.button>
                      </>
                    )}
                  </div>
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

export default ProfileSettings;