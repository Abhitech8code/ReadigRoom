
import mongoose from "mongoose";

const bookSchema=mongoose.Schema({
    id: String,
    name: String,
    title: String,
    author: { type: String, default: "Unknown" },
    price: Number,
    category: String,
    description: String,
    image: String,
    isbn: String
});
const Book = mongoose.model("Book",bookSchema);

export default Book;