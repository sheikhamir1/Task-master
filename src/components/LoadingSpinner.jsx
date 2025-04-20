// components/LoadingSpinner.js
import { useContext } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { TaskContext } from "../context/TaskContext";

export const LoadingSpinner = () => {
  const { loading } = useContext(TaskContext);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-transparent bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
      <ClimbingBoxLoader color="#46ab39" size={20} />
    </div>
  );
};
