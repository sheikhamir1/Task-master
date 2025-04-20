"use client";

import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  CheckSquare,
  Trash2,
  Tag,
} from "lucide-react";

const Sidebar = () => {
  const {
    activeFilter,
    setActiveFilter,
    tasks,
    getAllTags,
    setActiveTag,
    activeTag,
    emptyTrash,
  } = useContext(TaskContext);
  const { darkMode } = useContext(ThemeContext);

  const menuItems = [
    { id: "all", label: "All Tasks", icon: <LayoutDashboard size={20} /> },
    { id: "today", label: "Today", icon: <CalendarCheck size={20} /> },
    { id: "week", label: "This Week", icon: <CalendarDays size={20} /> },
    { id: "completed", label: "Completed", icon: <CheckSquare size={20} /> },
    { id: "trash", label: "Trash", icon: <Trash2 size={20} /> },
  ];

  // Count tasks for each category
  const getTaskCount = (filter) => {
    if (!Array.isArray(tasks)) return 0; // ensure tasks is an array

    if (filter === "all") {
      return tasks.filter((task) => task.status !== "Trash").length;
    } else if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      return tasks.filter(
        (task) =>
          task.dueDate === today &&
          task.status !== "Completed" &&
          task.status !== "Trash"
      ).length;
    } else if (filter === "week") {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      return tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate >= today &&
          taskDate <= nextWeek &&
          task.status !== "Completed" &&
          task.status !== "Trash"
        );
      }).length;
    } else if (filter === "completed") {
      return tasks.filter((task) => task.status === "Completed").length;
    } else if (filter === "trash") {
      return tasks.filter((task) => task.status === "Trash").length;
    }

    return 0;
  };

  const tags = getAllTags();

  return (
    <aside
      className={`w-64 border-r ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } hidden md:block overflow-y-auto`}
    >
      <div className="p-4">
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveFilter(item.id)}
                  className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
                    activeFilter === item.id
                      ? "bg-emerald-500 text-white"
                      : `${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                  {["all", "today", "week", "completed", "trash"].includes(
                    item.id
                  ) && (
                    <span
                      className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                        activeFilter === item.id
                          ? "bg-white bg-opacity-20 text-white"
                          : `${
                              darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`
                      }`}
                    >
                      {getTaskCount(item.id)}
                    </span>
                  )}
                </button>
              </li>
            ))}
            {activeFilter === "trash" && (
              <div className="px-4 mt-6">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to permanently delete all trashed tasks?"
                      )
                    ) {
                      emptyTrash();
                    }
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300
        bg-emerald-600 text-white hover:bg-emerald-700
        dark:bg-emerald-500 dark:hover:bg-emerald-600
        shadow-sm hover:shadow-md hover:scale-[1.03]`}
                >
                  <Trash2 size={18} className="text-white" />
                  Empty Trash
                </button>
              </div>
            )}
          </ul>

          {tags.length > 0 && (
            <div className="mt-8">
              <h3 className="px-4 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Tags
              </h3>
              <ul className="space-y-1">
                {tags.map((tag) => (
                  <li key={tag}>
                    <button
                      onClick={() => {
                        setActiveTag(activeTag === tag ? "" : tag);
                        if (
                          activeFilter === "completed" ||
                          activeFilter === "trash"
                        ) {
                          setActiveFilter("all");
                        }
                      }}
                      className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
                        activeTag === tag
                          ? "bg-emerald-500 text-white"
                          : `${
                              darkMode
                                ? "text-gray-300 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`
                      }`}
                    >
                      <Tag size={16} className="mr-2" />
                      <span>{tag}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
