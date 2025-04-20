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

const TaskList = ({ tasks, onEditTask }) => {
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
    <div className="space-y-2">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className={`rounded-lg shadow-sm overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-white"
          } ${task.status === "Completed" ? "opacity-75" : ""}`}
        >
          <div className="p-3 flex items-center">
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

            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium truncate ${
                  task.status === "Completed"
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : ""
                }`}
              >
                {task.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                {task.description}
              </p>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <div className="flex space-x-1">
                {task.tags.slice(0, 2).map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </div>
                ))}
                {task.tags.length > 2 && (
                  <div className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
                    +{task.tags.length - 2}
                  </div>
                )}
              </div>

              <div
                className={`flex items-center px-2 py-0.5 rounded-full text-xs ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority === "High" && (
                  <AlertTriangle className="w-3 h-3 mr-1" />
                )}
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

              <div className="flex space-x-1">
                <button
                  onClick={() => onEditTask(task)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Edit task"
                >
                  <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => trashTask(task.id)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskList;
