// firebaseTasks.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const tasksRef = collection(db, "tasks");

// Add Task
export const addTaskToFirebase = async (task) => {
  const docRef = await addDoc(tasksRef, task);
  return { ...task, id: docRef.id };
};

// Get Completed Tasks for the current user
export const getTasksFromFirebase = async (userId) => {
  const q = query(collection(db, "tasks"), where("userId", "==", userId));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update Task
export const updateTaskInFirebase = async (task) => {
  const taskDoc = doc(db, "tasks", task.id);
  await updateDoc(taskDoc, task);
};

// Delete Task
export const deleteTaskFromFirebase = async (id) => {
  console.log("task deleted");
  const taskDoc = doc(db, "tasks", id);
  await deleteDoc(taskDoc); // ✅ Correct method to delete from Firebase
};

// mark task as complete
export const completeTaskInFirebase = async (id) => {
  if (!id) {
    console.error("Invalid task ID:", id);
    return;
  }

  const taskDoc = doc(db, "tasks", id);
  const docSnapshot = await getDoc(taskDoc);

  if (docSnapshot.exists()) {
    await updateDoc(taskDoc, { status: "Completed" });
  } else {
    console.error("Task not found:", id);
  }
};

// Move a task to trash
export const trashTaskInFirebase = async (taskId) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    status: "Trash", // Ensure this is set
    isCompleted: false,
  });

  // After updating, get the task data and log it to confirm
  const docSnapshot = await getDoc(taskRef);
  if (docSnapshot.exists()) {
    // console.log("Task after update:", docSnapshot.data());
  }
};

// Empty all tasks with status "Trash"
export const emptyTrashInFirebase = async (userId) => {
  const q = query(
    collection(db, "tasks"),
    where("status", "==", "Trash"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  console.log("Found trash tasks:", snapshot.docs.length); // Log to check

  const deletePromises = snapshot.docs.map((docSnap) => {
    console.log("Deleting task with ID:", docSnap.id); // Log each task ID
    return deleteDoc(docSnap.ref);
  });

  await Promise.all(deletePromises);
};
