"use client";

import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Tag,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const TaskBoard = ({ tasks, onEditTask }) => {
  const { completeTask, trashTask } = useContext(TaskContext);
  const { darkMode } = useContext(ThemeContext);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === "High") {
      return <AlertTriangle className="w-4 h-4 mr-1" />;
    }
    return null;
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    return taskDate < today;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`rounded-lg shadow-md overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-white"
          } ${task.status === "Completed" ? "opacity-75" : ""}`}
        >
          {/* <div className="p-4 h-[300px] overflow-y-auto"> */}
          <div className="p-4 ">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <button
                  onClick={() => completeTask(task.id)}
                  className={`mr-3 rounded-full p-1 cursor-pointer ${
                    task.status === "Completed"
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                  aria-label={
                    task.status === "Completed"
                      ? "Mark as incomplete"
                      : "Mark as complete"
                  }
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <h3
                  className={`font-medium ${
                    task.status === "Completed"
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : ""
                  }`}
                >
                  {task.title}
                </h3>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEditTask(task)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors "
                  aria-label="Edit task"
                >
                  <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
                </button>
                <button
                  onClick={() => trashTask(task.id)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              {task.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {task.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div
                className={`flex items-center px-2 py-1 rounded-full text-xs ${getPriorityColor(
                  task.priority
                )}`}
              >
                {getPriorityIcon(task.priority)}
                {task.priority}
              </div>

              <div
                className={`flex items-center text-xs ${
                  isOverdue(task.dueDate) && task.status !== "Completed"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(task.dueDate)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskBoard;
