import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [roomCode, setRoomCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContests(res.data);
    } catch (err) {
      console.error("Error fetching contests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinByCode = async () => {
    setJoinError("");
    if (!roomCode.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contests/join-code`,
        { roomCode: roomCode.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = `/contest/${res.data.contestId}`;
    } catch (err) {
      setJoinError(err.response?.data?.message || "Failed to join");
    }
  };

  const filtered = contests.filter((c) => {
    if (tab === "all") return true;
    return c.status === tab;
  });

  const statusColors = {
    upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    live: "bg-green-500/10 text-green-400 border-green-500/30",
    ended: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <div className="max-w-6xl mx-auto px-8 py-12 space-y-6">
          <div className="skeleton h-14 w-72 rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fadeIn">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">
                CONTEST <span className="text-purple-500">ARENA</span>
              </h1>
              <p className="text-gray-400 text-lg font-medium">
                Compete in timed rounds against other developers
              </p>
            </div>
            <div className="flex gap-3">
              {user?.role === "admin" && (
                <Link
                  to="/contest/create"
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/30"
                >
                  + Create Contest
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        {/* Join by Room Code */}
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 animate-slideUp">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Join by Room Code</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit room code..."
              maxLength={6}
              className="flex-1 bg-[#0d1117] border border-gray-800 rounded-xl px-5 py-3 text-sm font-mono tracking-widest outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/10 transition-all placeholder-gray-600 uppercase"
              onKeyDown={(e) => e.key === "Enter" && handleJoinByCode()}
            />
            <button
              onClick={handleJoinByCode}
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 active:scale-95"
            >
              Join
            </button>
          </div>
          {joinError && (
            <p className="text-red-400 text-sm mt-2 animate-shake">{joinError}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 animate-slideUp animation-delay-200">
          {["all", "live", "upcoming", "ended"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 ${
                tab === t
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-purple-600/10 text-purple-400 border-purple-600/30 hover:bg-purple-600/20"
              }`}
            >
              {t} {t !== "all" && `(${contests.filter((c) => c.status === t).length})`}
            </button>
          ))}
        </div>

        {/* Contest Cards */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((contest, i) => (
              <Link
                key={contest._id}
                to={`/contest/${contest._id}`}
                className="group bg-[#161b22] rounded-2xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 hover:-translate-y-0.5 animate-slideUp"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors duration-200">
                        {contest.title}
                      </h3>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${statusColors[contest.status]}`}>
                        {contest.status === "live" && (
                          <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
                        )}
                        {contest.status}
                      </span>
                    </div>
                    {contest.description && (
                      <p className="text-gray-500 text-sm">{contest.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-semibold">
                      <span>{contest.problems?.length || 0} problems</span>
                      <span>&bull;</span>
                      <span>{contest.duration} min</span>
                      <span>&bull;</span>
                      <span>{contest.participants?.length || 0} participants</span>
                      <span>&bull;</span>
                      <span>by {contest.createdBy?.username || "Admin"}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-bold text-gray-300">
                      {new Date(contest.startTime).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(contest.startTime).toLocaleTimeString("en-US", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                    {contest.roomCode && (
                      <div className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/30">
                        {contest.roomCode}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-20 text-center animate-fadeIn">
            <div className="text-6xl mb-4">&#127942;</div>
            <p className="text-gray-400 text-lg font-medium">No contests found</p>
            <p className="text-gray-600 text-sm mt-2">
              {user?.role === "admin" ? "Create one to get started!" : "Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contests;
