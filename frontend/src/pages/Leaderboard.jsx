import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/leaderboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBoard(res.data);
      } catch (err) {
        console.error("Leaderboard error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Header skeleton */}
          <div className="text-center space-y-4">
            <div className="skeleton h-14 w-64 mx-auto rounded-xl" />
            <div className="skeleton h-4 w-48 mx-auto rounded-lg" />
            <div className="flex justify-center gap-8 pt-6">
              <div className="skeleton h-16 w-24 rounded-xl" />
              <div className="skeleton h-16 w-24 rounded-xl" />
            </div>
          </div>
          {/* Podium skeleton */}
          <div className="flex items-end justify-center gap-4 max-w-3xl mx-auto">
            <div className="flex-1 skeleton h-48 rounded-2xl" />
            <div className="flex-1 skeleton h-60 rounded-2xl" />
            <div className="flex-1 skeleton h-44 rounded-2xl" />
          </div>
          {/* Table skeleton */}
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fadeIn">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="w-8 h-8 text-yellow-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent tracking-tighter">
                The Arena
              </h1>
              <svg className="w-8 h-8 text-yellow-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20" style={{animationDelay: '0.5s'}}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Global Rankings &bull; Problems Solved
            </p>
          </div>

          {/* Stats Summary */}
          <div className="flex justify-center gap-8 pt-6">
            <div className="text-center">
              <p className="text-3xl font-black text-blue-400">{board.length}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Competitors</p>
            </div>
            <div className="w-px bg-gray-800" />
            <div className="text-center">
              <p className="text-3xl font-black text-purple-400">{board[0]?.solved || 0}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Top Score</p>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {board.length >= 3 && (
          <div className="mb-12 animate-slideUp">
            <div className="flex items-end justify-center gap-4 max-w-3xl mx-auto">
              {/* 2nd Place */}
              <div className="flex-1 group">
                <div className="bg-gradient-to-br from-gray-700/20 to-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-gray-500/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-black shadow-lg">
                    {board[1].username.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-black text-gray-300">2</div>
                    <h3 className="font-bold text-white truncate">{board[1].username}</h3>
                    <p className="text-2xl font-black text-gray-400">{board[1].solved}</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Problems</p>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex-1 group -mt-8">
                <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 backdrop-blur-xl rounded-2xl p-8 border-2 border-yellow-500/40 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-500/20 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black shadow-lg">
                    {board[0].username.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-2">
                    <div className="text-5xl font-black text-yellow-500">1</div>
                    <div className="inline-block px-3 py-1 bg-yellow-500/20 rounded-full">
                      <span className="text-xs font-black text-yellow-400 uppercase tracking-wider">Champion</span>
                    </div>
                    <h3 className="font-bold text-white text-lg truncate">{board[0].username}</h3>
                    <p className="text-3xl font-black text-yellow-400">{board[0].solved}</p>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Problems</p>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex-1 group">
                <div className="bg-gradient-to-br from-orange-700/20 to-orange-800/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-700/30 text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-orange-500/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-black shadow-lg">
                    {board[2].username.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-black text-orange-400">3</div>
                    <h3 className="font-bold text-white truncate">{board[2].username}</h3>
                    <p className="text-2xl font-black text-orange-400">{board[2].solved}</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Problems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl animate-slideUp animation-delay-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0d1117]/80 text-gray-500 text-xs uppercase font-black tracking-widest border-b border-gray-800/50">
                  <th className="p-6 w-24">Rank</th>
                  <th className="p-6">Coder</th>
                  <th className="p-6 text-right">Solved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {board.map((entry, index) => {
                  const isTopThree = index < 3;
                  const rankColor =
                    index === 0 ? "text-yellow-500" :
                    index === 1 ? "text-gray-400" :
                    index === 2 ? "text-orange-500" :
                    "text-gray-600";

                  const bgHover =
                    index === 0 ? "hover:bg-yellow-500/5" :
                    index === 1 ? "hover:bg-gray-500/5" :
                    index === 2 ? "hover:bg-orange-500/5" :
                    "hover:bg-blue-500/5";

                  return (
                    <tr
                      key={index}
                      className={`group ${bgHover} transition-all duration-200 ${
                        isTopThree ? "bg-gradient-to-r from-transparent to-blue-500/5" : ""
                      }`}
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-black ${rankColor} min-w-[3ch] tabular-nums`}>
                            {index + 1}
                          </span>
                          {isTopThree && (
                            <svg className={`w-5 h-5 ${rankColor}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0 ? "bg-gradient-to-br from-yellow-500 to-yellow-600" :
                            index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500" :
                            index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" :
                            "bg-gradient-to-br from-blue-600 to-purple-600"
                          } shadow-lg`}>
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-200 group-hover:text-white transition-colors duration-200">
                                {entry.username}
                              </span>
                              {index === 0 && (
                                <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full font-black uppercase tracking-wide border border-yellow-500/30">
                                  Champion
                                </span>
                              )}
                              {index === 1 && (
                                <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wide border border-gray-500/30">
                                  Runner-up
                                </span>
                              )}
                              {index === 2 && (
                                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wide border border-orange-500/30">
                                  3rd Place
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <span className={`text-2xl font-black tabular-nums ${
                          index === 0 ? "text-yellow-400" :
                          index === 1 ? "text-gray-400" :
                          index === 2 ? "text-orange-400" :
                          "text-blue-400"
                        } group-hover:scale-110 transition-transform duration-200 inline-block`}>
                          {entry.solved}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {board.length === 0 && (
            <div className="p-16 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-semibold">No competitors yet</p>
              <p className="text-gray-600 text-sm">Be the first to join the arena!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
