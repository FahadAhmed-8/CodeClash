import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems`);
        setProblems(res.data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(p => {
    const matchesFilter = filter === 'all' || p.difficulty === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: problems.length,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white font-bold text-lg">Loading Challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">
                PROBLEM <span className="text-blue-500">ARENA</span>
              </h1>
              <p className="text-gray-400 text-lg font-medium">
                Choose your challenge and prove your skills
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total" count={stats.total} color="text-blue-500" />
              <StatCard label="Easy" count={stats.easy} color="text-green-500" />
              <StatCard label="Medium" count={stats.medium} color="text-yellow-500" />
              <StatCard label="Hard" count={stats.hard} color="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters & Search */}
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search problems or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-5 py-3.5 pl-12 text-sm outline-none focus:border-blue-500 transition placeholder-gray-600"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex gap-2">
              <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
              <FilterButton active={filter === 'Easy'} onClick={() => setFilter('Easy')} label="Easy" color="green" />
              <FilterButton active={filter === 'Medium'} onClick={() => setFilter('Medium')} label="Medium" color="yellow" />
              <FilterButton active={filter === 'Hard'} onClick={() => setFilter('Hard')} label="Hard" color="red" />
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        {filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredProblems.map((prob, idx) => (
              <ProblemCard key={prob._id} problem={prob} index={idx} />
            ))}
          </div>
        ) : (
          <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg font-medium">No problems found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, count, color }) => (
  <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center hover:border-gray-700 transition">
    <div className={`text-3xl font-black ${color} mb-1`}>{count}</div>
    <div className="text-[10px] text-gray-500 uppercase font-black tracking-wider">{label}</div>
  </div>
);

const FilterButton = ({ active, onClick, label, color = 'blue' }) => {
  const colors = {
    blue: active ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-600/10 text-blue-400 border-blue-600/30',
    green: active ? 'bg-green-600 text-white border-green-600' : 'bg-green-600/10 text-green-400 border-green-600/30',
    yellow: active ? 'bg-yellow-600 text-white border-yellow-600' : 'bg-yellow-600/10 text-yellow-400 border-yellow-600/30',
    red: active ? 'bg-red-600 text-white border-red-600' : 'bg-red-600/10 text-red-400 border-red-600/30'
  };
  
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all hover:scale-105 ${colors[color]}`}
    >
      {label}
    </button>
  );
};

const ProblemCard = ({ problem, index }) => {
  const difficultyColors = {
    Easy: 'bg-green-500/10 text-green-500 border-green-500/30',
    Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    Hard: 'bg-red-500/10 text-red-500 border-red-500/30'
  };

  return (
    <div className="group bg-[#161b22] rounded-2xl border border-gray-800 p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center text-xl font-black text-blue-400 border border-blue-500/30 flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition mb-2 truncate">
              {problem.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {problem.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[10px] bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-full text-gray-400 uppercase font-bold tracking-wider">
                  {tag}
                </span>
              ))}
              {problem.tags.length > 3 && (
                <span className="text-[10px] text-gray-600 px-2 py-1">+{problem.tags.length - 3} more</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase border ${difficultyColors[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          
          <Link 
            to={`/problem/${problem._id}`} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-105 shadow-lg shadow-blue-900/30 flex items-center gap-2 group/btn"
          >
            SOLVE
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;