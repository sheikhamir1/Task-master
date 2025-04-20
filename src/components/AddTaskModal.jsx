"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { TaskContext } from "../context/TaskContext";
import { ThemeContext } from "../context/ThemeContext";
import { X, Plus, Calendar, TagIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddTaskModal = ({ isOpen, onClose }) => {
  const { addTask, getAllTags } = useContext(TaskContext);
  const { darkMode } = useContext(ThemeContext);
  const modalRef = useRef();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [existingTags, setExistingTags] = useState([]);

  useEffect(() => {
    setExistingTags(getAllTags());

    // Focus the title input when modal opens
    if (isOpen) {
      setTimeout(() => {
        const titleInput = document.getElementById("task-title");
        if (titleInput) titleInput.focus();
      }, 100);
    }

    // Add event listener for escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, getAllTags, onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const newTask = {
      title,
      description,
      dueDate,
      tags,
      priority,
    };

    addTask(newTask);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSelectExistingTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-md rounded-lg shadow-xl overflow-hidden ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            ref={modalRef}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">Add New Task</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="task-title"
                    className="block text-sm font-medium mb-1"
                  >
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="task-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      darkMode ? "text-gray-600" : "text-gray-800"
                    }`}
                    placeholder="What needs to be done?"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="task-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      darkMode ? "text-gray-600" : "text-gray-800"
                    }`}
                    placeholder="Add details about this task..."
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="task-due-date"
                      className="block text-sm font-medium mb-1"
                    >
                      Due Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="task-due-date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          darkMode ? "text-gray-600" : "text-gray-800"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="task-priority"
                      className="block text-sm font-medium mb-1"
                    >
                      Priority
                    </label>
                    <select
                      id="task-priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        darkMode ? "text-gray-600" : "text-gray-800"
                      }`}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="task-tags"
                    className="block text-sm font-medium mb-1"
                  >
                    Tags
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TagIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="task-tags"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          darkMode ? "text-gray-600" : "text-gray-800"
                        }`}
                        placeholder="Add a tag..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="ml-2 p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                      aria-label="Add tag"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Existing tags suggestions */}
                  {existingTags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Existing tags:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {existingTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleSelectExistingTag(tag)}
                            className={`text-xs px-2 py-1 rounded-full ${
                              tags.includes(tag)
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-1 rounded-full text-sm"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 p-0.5 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800"
                            aria-label={`Remove ${tag} tag`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  disabled={!title.trim()}
                >
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;
