import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("Users");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthUser(user);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("Users");
      }
    }
    setLoading(false);
  }, []);

  const updateAuthUser = (user) => {
    setAuthUser(user);
    if (user) {
      localStorage.setItem("Users", JSON.stringify(user));
    } else {
      localStorage.removeItem("Users");
    }
  };

  return (
    <AuthContext.Provider value={[authUser, updateAuthUser, loading]}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
