"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  try {
    return (
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    );
  } catch (error) {
    console.error("ToastProvider error:", error);
    return null; // Fallback to prevent crash
  }
}
