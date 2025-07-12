import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // For demo purposes, accept any token as admin
    // In production, verify against actual JWT secret
    if (token === "admin-token" || token.length > 10) {
      req.user = { role: "admin" };
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};