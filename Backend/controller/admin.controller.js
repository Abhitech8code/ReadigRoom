import Book from "../model/book.model.js";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign(
      { id: "admin", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token, message: "Admin login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const addBook = async (req, res) => {
  try {
    const { name, title, author, price, category, description, image, isbn } = req.body;
    
    // Get the highest ID and increment
    const lastBook = await Book.findOne().sort({ id: -1 });
    const newId = lastBook ? (parseInt(lastBook.id) + 1).toString() : "1";
    
    const book = new Book({
      id: newId,
      name,
      title,
      author: author || "Unknown",
      price: parseFloat(price),
      category,
      description,
      image,
      isbn
    });
    
    // Save to MongoDB Atlas
    const savedBook = await book.save();
    console.log("Book saved to MongoDB Atlas:", savedBook._id);
    
    res.status(201).json({ message: "Book added successfully to MongoDB Atlas", book: savedBook });
  } catch (error) {
    console.error("MongoDB Atlas save error:", error);
    res.status(500).json({ message: "Error adding book to MongoDB Atlas", error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOneAndDelete({ id });
    
    if (!book) {
      return res.status(404).json({ message: "Book not found in MongoDB Atlas" });
    }
    
    console.log("Book deleted from MongoDB Atlas:", book._id);
    res.json({ message: "Book deleted successfully from MongoDB Atlas" });
  } catch (error) {
    console.error("MongoDB Atlas delete error:", error);
    res.status(500).json({ message: "Error deleting book from MongoDB Atlas", error: error.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ id: 1 });
    console.log(`Fetched ${books.length} books from MongoDB Atlas`);
    res.json(books);
  } catch (error) {
    console.error("MongoDB Atlas fetch error:", error);
    res.status(500).json({ message: "Error fetching books from MongoDB Atlas", error: error.message });
  }
};