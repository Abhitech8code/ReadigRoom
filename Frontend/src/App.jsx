import React from "react";
import Home from "./Home/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import Courses from "./Courses/Courses";
import Signup from "./Components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";
import Contact from "./Home/Contact";
import About from "./Home/About";

import PaymentPage from "./Components/PaymentPage";
import AdminLogin from "./Components/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard";
import ProfileSettings from "./Components/ProfileSettings";
import MyBooks from "./Components/MyBooks";
import EbookUpload from "./Components/EbookUpload";
import EbookLibrary from "./Components/EbookLibrary";
import EbookReader from "./Components/EbookReader";
import OpenLibrary from "./Components/OpenLibrary";
import OpenLibraryReader from "./Components/OpenLibraryReader";

function App() {
  const [authUser, setAuthUser, loading] = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route 
            path="/profile" 
            element={authUser ? <ProfileSettings /> : <Navigate to="/signup" />} 
          />
          <Route 
            path="/my-books" 
            element={authUser ? <MyBooks /> : <Navigate to="/signup" />} 
          />
          <Route path="/library" element={<EbookLibrary />} />
          <Route 
            path="/read/:id" 
            element={authUser ? <EbookReader /> : <Navigate to="/signup" />} 
          />
          <Route path="/upload-ebook" element={<EbookUpload />} />
          <Route path="/open-library" element={<OpenLibrary />} />
          <Route 
            path="/read-free/:identifier" 
            element={authUser ? <OpenLibraryReader /> : <Navigate to="/signup" />} 
          />
          <Route
            path="/course"
            element={authUser ? <Courses /> : <Navigate to="/signup" />}
          />
          <Route 
            path="/signup" 
            element={!authUser ? <Signup /> : <Navigate to="/" />} 
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
