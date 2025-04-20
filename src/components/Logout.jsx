import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
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
    <div>
      <h1>Welcome to Dashboard</h1>
      <button onClick={handleLogout} className="bg-black text-white px-4 py-2">
        Logout
      </button>
    </div>
  );
};
