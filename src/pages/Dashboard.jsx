"use client";

import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import { ThemeContext } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import TaskBoard from "../components/TaskBoard";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import {
  Search,
  Filter,
  Sun,
  Moon,
  CheckCircle,
  List,
  Grid3X3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const {
    filteredTasks,
    setSearchQuery,
    activeFilter,
    setActiveTag,
    setActivePriority,
  } = useContext(TaskContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth();

  // console.log("User in dashboard:", user);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    const savedViewMode = localStorage.getItem("viewMode");
    return savedViewMode || "board";
  });

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  const getFilterTitle = () => {
    switch (activeFilter) {
      case "today":
        return "Today's Tasks";
      case "week":
        return "This Week's Tasks";
      case "completed":
        return "Completed Tasks";
      case "trash":
        return "Trash";
      default:
        return "All Tasks";
    }
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "dark bg-gray-900 text-white"
          : "light bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`${darkMode ? "dark bg-gray-900" : "bg-white"}  shadow-sm`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <h1 className="text-xl font-bold">TaskMaster</h1>
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className={`block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 ${
                  darkMode
                    ? "dark:bg-gray-800 dark:text-white   "
                    : "bg-white focus:bg-white"
                }  placeholder-gray-400   focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="Search tasks..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Filter className="h-5 w-5" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg hidden group-hover:block">
                {/* Filter dropdown content would go here */}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === "list"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("board")}
                className={`p-2 rounded-full transition-colors ${
                  darkMode
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                aria-label="Board view"
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 cursor-pointer"
            >
              <span className="text-md">🔒</span> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{getFilterTitle()}</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add New Task
              </button>
            </div>

            {/* Task View */}
            {viewMode === "board" ? (
              <TaskBoard tasks={filteredTasks} onEditTask={handleEditTask} />
            ) : (
              <TaskList tasks={filteredTasks} onEditTask={handleEditTask} />
            )}

            {/* No Tasks Message */}
            {filteredTasks.length === 0 && (
              <div className="text-center py-10">
                <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <CheckCircle className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No tasks found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {activeFilter === "trash"
                    ? "Your trash is empty."
                    : "Get started by adding a new task."}
                </p>
                {activeFilter !== "trash" && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add New Task
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && currentTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={currentTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
