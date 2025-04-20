"use client";

import { createContext, useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../Config/firebase"; // 👈 import it
import {
  addTaskToFirebase,
  completeTaskInFirebase,
  deleteTaskFromFirebase,
  getTasksFromFirebase,
  updateTaskInFirebase,
  emptyTrashInFirebase,
  trashTaskInFirebase,
} from "../Config/firebaseTasks";
import { doc, updateDoc } from "firebase/firestore"; // <-- Make sure to import doc and updateDoc from firebase/firestore
import { db } from "../Config/firebase"; // <-- Import the db object from your firebase config
import { useAuth } from "../context/AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [activePriority, setActivePriority] = useState("");

  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  // console.log("Current user ID:", user?.uid);

  // Add this inside AuthContext
  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

  // Fetch tasks from Firebase
  useEffect(() => {
    const loadTasks = async () => {
      if (!user || !user.uid) {
        console.error("User is not logged in or UID is undefined");
        return; // Exit if the user or UID is not defined
      }

      setLoading(true);
      try {
        const firebaseTasks = await getTasksFromFirebase(user.uid); // Pass userId for filtering
        console.log("Firebase tasks fetched:", firebaseTasks);
        setTasks(firebaseTasks);
      } catch (e) {
        console.error("Error loading tasks from Firebase:", e);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user]); // ✅ Depend on user

  // Filter tasks based on activeFilter, searchQuery, activeTag, and activePriority
  useEffect(() => {
    if (!Array.isArray(tasks)) return;
    let result = [...tasks];

    // Filter by status
    if (activeFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter(
        (task) => task.dueDate === today && task.status !== "Completed"
      );
    } else if (activeFilter === "week") {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      result = result.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate >= today &&
          taskDate <= nextWeek &&
          task.status !== "Completed"
        );
      });
    } else if (activeFilter === "completed") {
      result = result.filter((task) => task.status === "Completed");
    } else if (activeFilter === "trash") {
      result = result.filter((task) => task.status === "Trash");
    } else if (activeFilter === "all") {
      result = result.filter((task) => task.status !== "Trash");
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tag
    if (activeTag) {
      result = result.filter((task) => task.tags.includes(activeTag));
    }

    // Filter by priority
    if (activePriority) {
      result = result.filter((task) => task.priority === activePriority);
    }

    setFilteredTasks(result);
  }, [tasks, activeFilter, searchQuery, activeTag, activePriority]);

  // Add a new task
  const addTask = async (task) => {
    setLoading(true);
    try {
      const newTask = {
        ...task,
        status: "Pending",
        createdAt: new Date().toISOString(),
        userId: user.uid,
      };
      const savedTask = await addTaskToFirebase(newTask);
      console.log("Saved task:", savedTask);

      setTasks((prev) => [...prev, savedTask]);
    } catch (error) {
      console.log("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (updatedTask) => {
    setLoading(true);
    try {
      await updateTaskInFirebase(updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      console.log("Updated task:", updatedTask);
    } catch (error) {
      console.log("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a task as complete
  const completeTask = async (id) => {
    if (!id) {
      console.error("Invalid task id:", id);
      return;
    }

    setLoading(true);
    try {
      await completeTaskInFirebase(id);
      console.log("Completed task:", id);
      const updatedTasks = await getTasksFromFirebase(user?.uid);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Move a task to trash
  const trashTask = async (taskId) => {
    try {
      setLoading(true);
      await trashTaskInFirebase(taskId); // This sets isTrashed: true
      const updatedTasks = await getTasksFromFirebase(user?.uid);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error moving task to trash:", error);
    } finally {
      setLoading(false);
    }
  };

  // Restore a task from trash
  const restoreTask = async (id) => {
    const taskDoc = doc(db, "tasks", id); // <-- Ensure db is correctly imported
    await updateDoc(taskDoc, { status: "Pending" });

    const updatedTasks = await getTasksFromFirebase();
    setTasks(updatedTasks);
  };

  // Permanently delete a task
  const deleteTask = async (id) => {
    setLoading(true);
    try {
      console.log("task deleted");
      await deleteTaskFromFirebase(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.log("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear all tasks from trash
  const emptyTrash = async () => {
    setLoading(true);
    try {
      console.log("Emptying trash for user:", user?.uid); // Log user ID
      await emptyTrashInFirebase(user?.uid);
      const updatedTasks = await getTasksFromFirebase(user?.uid);
      setTasks(updatedTasks);
    } catch (error) {
      console.log("Error emptying trash:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags from tasks
  const getAllTags = () => {
    if (!Array.isArray(tasks)) return [];

    const allTags = tasks.reduce((tags, task) => {
      return [...tags, ...task.tags];
    }, []);
    return [...new Set(allTags)];
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        activeFilter,
        searchQuery,
        activeTag,
        activePriority,
        setActiveFilter,
        setSearchQuery,
        setActiveTag,
        setActivePriority,
        addTask,
        updateTask,
        completeTask,
        trashTask,
        restoreTask,
        deleteTask,
        emptyTrash,
        getAllTags,
        loading,
        signInWithGoogle,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
