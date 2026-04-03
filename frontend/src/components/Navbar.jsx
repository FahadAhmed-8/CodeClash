import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-[#161b22] border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black text-blue-500 tracking-tighter">
        CODE<span className="text-white">CLASH</span>
      </Link>

      <div className="flex items-center gap-6 text-white">
        {isAuthenticated ? (
          <>
            <div className="flex gap-6 items-center">
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition text-sm font-medium">Problems</Link>
              <Link to="/contests" className="text-gray-300 hover:text-white transition text-sm font-medium">Contests</Link>
              <Link to="/leaderboard" className="text-gray-300 hover:text-white transition text-sm font-medium">Leaderboard</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white transition text-sm font-medium">Profile</Link>
            </div>

            {user?.role === "admin" && (
              <div className="flex gap-3 items-center ml-2 pl-6 border-l border-gray-700">
                {/* Now all Admin tools are grouped here */}
                <Link
                  to="/admin/dashboard"
                  className="bg-blue-600/10 text-blue-400 border border-blue-600/30 hover:bg-blue-600 hover:text-white transition text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg"
                >
                  Manage Arena
                </Link>
              </div>
            )}

            <div className="h-6 w-[1px] bg-gray-700 mx-2"></div>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Logout</button>
          </>
        ) : (
          <div className="flex items-center gap-6">
            {/* Fixing the asymmetry here */}
            <Link to="/login" className="text-gray-300 hover:text-white transition text-sm font-bold">
              Login
            </Link>
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition text-sm font-bold border-2 border-blue-400/30 px-6 py-2 rounded-full hover:bg-blue-400/10">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;