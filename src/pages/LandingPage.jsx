"use client";

import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle,
  Calendar,
  Search,
  Database,
  Moon,
  Sun,
} from "lucide-react";

const CustomDragDropIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 5h10"></path>
    <path d="M11 9h10"></path>
    <path d="M11 13h10"></path>
    <path d="M11 17h10"></path>
    <path d="M3 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
    <path d="M3 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
    <path d="M3 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
    <path d="M3 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
  </svg>
);

const LandingPage = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const { user } = useAuth();

  const features = [
    {
      icon: <CheckCircle className="w-10 h-10 text-emerald-500" />,
      title: "Create Tasks",
      description: "Easily create and organize your daily tasks",
    },
    {
      icon: <Calendar className="w-10 h-10 text-blue-500" />,
      title: "Set Deadlines",
      description: "Never miss important deadlines with due date reminders",
    },
    {
      icon: <CustomDragDropIcon className="w-10 h-10 text-purple-500" />,
      title: "Drag & Drop Organization",
      description: "Intuitively organize your tasks with drag and drop",
    },
    {
      icon: <Search className="w-10 h-10 text-amber-500" />,
      title: "Task Filtering & Searching",
      description: "Quickly find tasks with powerful search and filter options",
    },
    {
      icon: <Database className="w-10 h-10 text-red-500" />,
      title: "Store in Browser",
      description: "Your tasks are saved locally - no login required",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
          <h1 className="text-2xl font-bold">TaskMaster</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <Link
            to={user ? "/dashboard" : "/login"}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Organize your day, achieve more.
            </h2>
            <p
              className={`${
                darkMode ? "text-gray-600" : "text-gray-800"
              }text-xl mb-8  `}
            >
              A beautiful task manager that helps you stay organized and
              productive without the complexity.
            </p>
            <Link
              to={user ? "/dashboard" : "/login"}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
            >
              Create Your First Task
            </Link>
          </motion.div>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="https://projectsly.com/images/task-management-system-screenshot-1.png?v=1691124479409199525"
              alt="Task Management"
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } transition-all hover:shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to boost your productivity?
        </h2>
        <p
          className={`text-xl mb-8 max-w-2xl mx-auto ${
            darkMode ? "text-gray-600" : "text-gray-800"
          }`}
        >
          Start organizing your tasks today and experience the difference a
          well-structured day can make.
        </p>
        <Link
          to={user ? "/dashboard" : "/login"}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className={`py-8 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            © {new Date().getFullYear()} TaskMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
