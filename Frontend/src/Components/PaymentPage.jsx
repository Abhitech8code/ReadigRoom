import React, { useEffect, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  "pk_test_51RYWK2PNZ4xOj1q0OzucHP1vTJxxUpafhnSGDfuDuLnpuNaqmjnNO3nqYkDgudcg8RTEzaPJdJuadpG1XMHXnrjX00r7I5ohMq"
);

function CheckoutForm({ book }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (book?.price) {
      axios
        .post("http://localhost:4001/api/create-payment-intent", {
          amount: book.price,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setLoading(false);
        })
        .catch((err) => {
          setErrorMsg("Failed to initialize payment.");
          setLoading(false);
        });
    }
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setErrorMsg(result.error.message);
      setProcessing(false);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        // Save purchased book to user's library
        const userId = JSON.parse(localStorage.getItem("Users"))?._id;
        if (userId) {
          const purchasedBooks = JSON.parse(localStorage.getItem(`purchasedBooks_${userId}`) || "[]");
          const bookExists = purchasedBooks.some(b => b.id === book.id);
          if (!bookExists) {
            purchasedBooks.push(book);
            localStorage.setItem(`purchasedBooks_${userId}`, JSON.stringify(purchasedBooks));
          }
        }
        
        toast.success("Payment successful! Book added to your library!");
        navigate("/my-books");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <img
          src={book.image}
          alt={book.name}
          className="h-60 w-full object-cover rounded-md mb-4"
        />
        <h2 className="text-2xl font-bold text-emerald-600 mb-2">
          {book.name}
        </h2>
        <p className="text-gray-600 mb-2">{book.title}</p>
        <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm mb-2">
          {book.category}
        </span>
        <p className="text-xl font-semibold text-emerald-700">
          ${book.price}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-3 border rounded-md bg-gray-50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      "::placeholder": { color: "#a0aec0" },
                    },
                    invalid: { color: "#fa755a" },
                  },
                }}
              />
            </div>

            {errorMsg && (
              <div className="text-red-600 text-sm">{errorMsg}</div>
            )}

            <button
              type="submit"
              disabled={!stripe || processing}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {processing ? "Processing..." : `Pay $${book.price}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book;

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Book Selected</h2>
          <p className="text-gray-600 mb-6">Please select a book to proceed with payment</p>
          <button
            onClick={() => navigate("/course")}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full shadow-lg hover:shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 group"
        >
          <svg className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
        
        <div className="py-12">
          <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-12">
            Secure Checkout
          </h1>
          <CheckoutForm book={book} />
        </div>
      </div>
    </Elements>
  );
}