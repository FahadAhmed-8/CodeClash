import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const ContestDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [activeTab, setActiveTab] = useState("problems");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchContest = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${id}`, { headers });
      setContest(res.data);
    } catch (err) {
      console.error("Error fetching contest", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${id}/leaderboard`, { headers });
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Error fetching leaderboard");
    }
  }, [id]);

  useEffect(() => {
    fetchContest();
    fetchLeaderboard();
  }, [fetchContest, fetchLeaderboard]);

  // Live countdown timer
  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(contest.startTime);
      const end = new Date(start.getTime() + contest.duration * 60000);

      if (now < start) {
        const diff = start - now;
        setTimeLeft(formatTime(diff));
      } else if (now < end) {
        const diff = end - now;
        setTimeLeft(formatTime(diff));
      } else {
        setTimeLeft("Ended");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  // Refresh leaderboard every 15s during live contests
  useEffect(() => {
    if (!contest || contest.status !== "live") return;
    const interval = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(interval);
  }, [contest, fetchLeaderboard]);

  const formatTime = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h > 0 ? h + "h " : ""}${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${id}/join`, {}, { headers });
      fetchContest();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join");
    } finally {
      setJoining(false);
    }
  };

  const hasJoined = contest?.participants?.some(
    (p) => (p.user?._id || p.user) === user?._id
  );

  const myParticipant = contest?.participants?.find(
    (p) => (p.user?._id || p.user) === user?._id
  );

  const statusColors = {
    upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    live: "bg-green-500/10 text-green-400 border-green-500/30",
    ended: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };

  const diffColors = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-red-500",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <div className="max-w-6xl mx-auto px-8 py-12 space-y-6">
          <div className="skeleton h-14 w-96 rounded-xl" />
          <div className="skeleton h-6 w-64 rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-gray-400">
        Contest not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-8 py-10 animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black tracking-tighter">{contest.title}</h1>
                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border ${statusColors[contest.status]}`}>
                  {contest.status === "live" && (
                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
                  )}
                  {contest.status}
                </span>
              </div>
              {contest.description && <p className="text-gray-400">{contest.description}</p>}
              <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold">
                <span>by {contest.createdBy?.username}</span>
                <span>&bull;</span>
                <span>{contest.problems?.length} problems</span>
                <span>&bull;</span>
                <span>{contest.duration} min</span>
                <span>&bull;</span>
                <span>{contest.participants?.length} participants</span>
                {contest.roomCode && (
                  <>
                    <span>&bull;</span>
                    <span className="font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                      {contest.roomCode}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-right space-y-3">
              {/* Timer */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl px-6 py-3 text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  {contest.status === "upcoming" ? "Starts In" : contest.status === "live" ? "Time Left" : "Contest"}
                </p>
                <p className={`text-2xl font-black font-mono tracking-wider ${
                  contest.status === "live" ? "text-green-400" : contest.status === "upcoming" ? "text-blue-400" : "text-gray-500"
                }`}>
                  {timeLeft}
                </p>
              </div>

              {!hasJoined && contest.status !== "ended" && (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  {joining ? "Joining..." : "Join Contest"}
                </button>
              )}
              {hasJoined && (
                <div className="text-xs text-green-400 font-bold uppercase tracking-wider">
                  &#10003; Joined &bull; Score: {myParticipant?.score || 0}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 animate-slideUp">
          <button
            onClick={() => setActiveTab("problems")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
              activeTab === "problems" ? "bg-purple-600 text-white border-purple-600" : "bg-purple-600/10 text-purple-400 border-purple-600/30"
            }`}
          >
            Problems
          </button>
          <button
            onClick={() => { setActiveTab("leaderboard"); fetchLeaderboard(); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
              activeTab === "leaderboard" ? "bg-purple-600 text-white border-purple-600" : "bg-purple-600/10 text-purple-400 border-purple-600/30"
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Problems Tab */}
        {activeTab === "problems" && (
          <div className="space-y-3 animate-fadeIn">
            {contest.problems?.map((prob, i) => {
              const isSolved = myParticipant?.solvedProblems?.includes(prob._id);
              return (
                <div
                  key={prob._id}
                  className={`bg-[#161b22] rounded-2xl border p-6 flex items-center justify-between gap-4 transition-all duration-200 ${
                    isSolved ? "border-green-500/30 bg-green-500/5" : "border-gray-800 hover:border-purple-500/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border ${
                      isSolved
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-purple-600/20 text-purple-400 border-purple-500/30"
                    }`}>
                      {isSolved ? "&#10003;" : String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{prob.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-black ${diffColors[prob.difficulty]}`}>{prob.difficulty}</span>
                        {prob.tags?.slice(0, 3).map((t, j) => (
                          <span key={j} className="text-[9px] bg-gray-800 px-2 py-0.5 rounded text-gray-500 uppercase font-bold">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {contest.status === "live" && hasJoined ? (
                    <Link
                      to={`/problem/${prob._id}?contest=${id}`}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Solve
                    </Link>
                  ) : contest.status === "ended" ? (
                    <Link
                      to={`/problem/${prob._id}`}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200"
                    >
                      View
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-600 font-bold uppercase">Locked</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="bg-[#161b22] rounded-2xl border border-gray-800 overflow-hidden animate-fadeIn">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0d1117]/80 text-gray-500 text-xs uppercase font-black tracking-widest border-b border-gray-800/50">
                  <th className="p-5 w-20">Rank</th>
                  <th className="p-5">Player</th>
                  <th className="p-5 text-center">Solved</th>
                  <th className="p-5 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {leaderboard.map((entry, i) => {
                  const isMe = entry.userId === user?._id;
                  return (
                    <tr key={i} className={`transition-all ${isMe ? "bg-purple-500/5" : "hover:bg-blue-500/5"}`}>
                      <td className="p-5">
                        <span className={`text-xl font-black ${
                          i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-500" : "text-gray-600"
                        }`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            i < 3 ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-gray-800"
                          }`}>
                            {entry.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-200">
                            {entry.username} {isMe && <span className="text-purple-400 text-xs">(you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-center text-sm text-gray-400 font-bold">
                        {entry.solvedCount} / {contest.problems?.length}
                      </td>
                      <td className="p-5 text-right">
                        <span className="text-xl font-black text-purple-400">{entry.score}</span>
                      </td>
                    </tr>
                  );
                })}
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-600">
                      No participants yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestDetail;
