import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
// import { useAuth } from "./context/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <LoadingSpinner />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
              />
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
