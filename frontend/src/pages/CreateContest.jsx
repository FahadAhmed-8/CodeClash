import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateContest = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    duration: 60,
    isPublic: true,
  });
  const [selectedProblems, setSelectedProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems`);
        setProblems(res.data);
      } catch (err) {
        console.error("Error fetching problems");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const toggleProblem = (id) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProblems.length === 0) return alert("Select at least one problem");
    if (!form.startTime) return alert("Set a start time");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contests`,
        { ...form, problems: selectedProblems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/contest/${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create contest");
    } finally {
      setSubmitting(false);
    }
  };

  const diffColors = {
    Easy: "text-green-500 bg-green-500/10 border-green-500/30",
    Medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
    Hard: "text-red-500 bg-red-500/10 border-red-500/30",
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-black tracking-tighter mb-8 animate-fadeIn">
          CREATE <span className="text-purple-500">CONTEST</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 animate-slideUp">
          {/* Basic Info */}
          <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-8 space-y-6">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Contest Details</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Contest Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-5 py-4 text-sm outline-none focus:border-purple-500 transition-all placeholder-gray-600"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-5 py-4 text-sm outline-none focus:border-purple-500 transition-all resize-none placeholder-gray-600"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Start Time</label>
                  <input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-5 py-3 text-sm outline-none focus:border-purple-500 transition-all text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Duration (minutes)</label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-5 py-3 text-sm outline-none focus:border-purple-500 transition-all text-gray-300 cursor-pointer"
                  >
                    {[15, 30, 45, 60, 90, 120, 180].map((d) => (
                      <option key={d} value={d}>{d} min</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Visibility</label>
                  <select
                    value={form.isPublic ? "public" : "private"}
                    onChange={(e) => setForm({ ...form, isPublic: e.target.value === "public" })}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-5 py-3 text-sm outline-none focus:border-purple-500 transition-all text-gray-300 cursor-pointer"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private (Room Code Only)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Selection */}
          <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Select Problems ({selectedProblems.length} selected)
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {problems.map((p) => {
                  const isSelected = selectedProblems.includes(p._id);
                  return (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => toggleProblem(p._id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                        isSelected
                          ? "bg-purple-600/10 border-purple-500/50"
                          : "bg-[#0d1117] border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? "bg-purple-600 border-purple-600" : "border-gray-600"
                        }`}>
                          {isSelected && <span className="text-white text-xs font-black">&#10003;</span>}
                        </div>
                        <span className="text-sm font-bold text-gray-200 truncate">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {p.tags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-[9px] bg-gray-800 px-2 py-0.5 rounded text-gray-500 uppercase font-bold">{tag}</span>
                        ))}
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${diffColors[p.difficulty]}`}>
                          {p.difficulty}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 shadow-lg shadow-purple-900/30 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : "Create Contest"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateContest;
