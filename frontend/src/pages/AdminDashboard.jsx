import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [problems, setProblems] = useState([]);

  const fetchProblems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/problems");
      setProblems(res.data);
    } catch (err) {
      console.error("Error fetching problems");
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "⚠️ Are you sure? This will permanently delete the problem and its test cases."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Remove from local state
        setProblems(problems.filter((p) => p._id !== id));
      } catch (err) {
        alert("Action failed: Only admins can delete problems.");
      }
    }
  };

  return (
    <div className="p-8 bg-[#0d1117] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black tracking-tighter">ADMIN PANEL</h1>
        <Link
          to="/admin/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase"
        >
          + Create New Problem
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#161b22]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0d1117] text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
              <th className="p-4">Name</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4">Tags</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr
                key={p._id}
                className="border-b border-gray-800 hover:bg-[#1c2128] transition group"
              >
                <td className="p-4 font-bold text-gray-200">{p.name}</td>
                <td className="p-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      p.difficulty === "Easy"
                        ? "bg-green-500/10 text-green-500"
                        : p.difficulty === "Medium"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {p.difficulty}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {p.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[9px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-4 text-xs font-bold">
                    <Link
                      to={`/admin/edit-problem/${p._id}`}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      EDIT
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-500 hover:text-red-400 uppercase"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
