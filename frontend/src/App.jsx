import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./services/authService";
import { login, logout, setLoading } from "./store/authSlice";

// Components
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

// Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // User: Problem List
import ProblemDetail from "./pages/ProblemDetail"; // User: Coding Workspace
import Profile from "./pages/Profile"; // User: Stats & History
import Leaderboard from "./pages/Leaderboard"; // Global: Rankings
import AdminDashboard from "./pages/AdminDashboard"; // Admin: Manage/Delete List
import AdminCreateProblem from "./pages/AdminCreateProblem"; // Admin: Add Form
import EditProblem from "./pages/EditProblem"; // Admin: Edit Form
import LandingPage from "./pages/LandingPage"; // The new landing page entry point
import Contests from "./pages/Contests"; // Contest Arena
import CreateContest from "./pages/CreateContest"; // Admin: Create Contest
import ContestDetail from "./pages/ContestDetail"; // Contest Detail View

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setLoading(true));
      getCurrentUser()
        .then((res) => {
          dispatch(login(res.data));
        })
        .catch(() => {
          dispatch(logout());
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0d1117]">
        <Navbar />

        <Routes>
          {/* Landing Page is the primary entry point. 
            If user is already logged in, they can stay here or navigate to dashboard.
          */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route
            path="/register"
            element={
              !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
            }
          />

          {/* User Features */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contest/create" element={
            <AdminRoute><CreateContest /></AdminRoute>
          } />
          <Route path="/contest/:id" element={<ContestDetail />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/create"
            element={
              <AdminRoute>
                <AdminCreateProblem />
              </AdminRoute>
            }
          />

          {/* Ensure /admin/dashboard exists */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* The Edit Problem page now includes dynamic test case management.
            Upon saving, it redirects back to /dashboard.
          */}
          <Route
            path="/admin/edit-problem/:id"
            element={
              <AdminRoute>
                <EditProblem />
              </AdminRoute>
            }
          />

          {/* Fallback for undefined routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
