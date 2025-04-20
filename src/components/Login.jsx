// pages/Login.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const Login = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      alert("Google Sign-In failed: " + error.message);
    }
  };

  return (
    <>
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Optional cool emoji or illustration */}
        <div className="mb-6 text-5xl">🧠</div>

        {/* Tagline */}
        <h1 className="text-3xl font-bold mb-2 text-emerald-400">
          Welcome Back!
        </h1>
        <p className="text-gray-400 mb-6 text-center">
          Log in to access your tasks and boost productivity 🚀
        </p>

        {/* Sign in button */}
        <button
          onClick={handleGoogleLogin}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 cursor-pointer"
        >
          <span className="mr-2">🌐</span> Sign in with Google
        </button>

        {/* Back link */}
        <Link
          to="/"
          className="mt-6 text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </>
  );
};
