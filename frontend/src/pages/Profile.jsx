import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SubmissionModal from "../components/SubmissionModal";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    bio: "",
    github: "",
    linkedin: "",
    location: "",
    profilePic: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data);
      setEditForm({
        bio: res.data.user.bio || "",
        github: res.data.user.github || "",
        linkedin: res.data.user.linkedin || "",
        location: res.data.user.location || "",
        profilePic: res.data.user.profilePic || ""
      });
    } catch (err) {
      console.error("Profile fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Profile header skeleton */}
          <div className="bg-[#161b22] rounded-3xl border border-gray-800/50 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="skeleton w-32 h-32 rounded-3xl" />
              <div className="flex-1 space-y-4 w-full">
                <div className="skeleton h-10 w-64 rounded-xl" />
                <div className="skeleton h-4 w-48 rounded-lg" />
                <div className="skeleton h-16 w-full rounded-lg" />
                <div className="flex gap-3">
                  <div className="skeleton h-10 w-28 rounded-xl" />
                  <div className="skeleton h-10 w-28 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="skeleton h-40 rounded-2xl" />
              <div className="skeleton h-60 rounded-2xl" />
            </div>
            <div className="lg:col-span-2">
              <div className="skeleton h-[400px] rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentActivity } = profileData;
  const totalSolved = stats.easy + stats.medium + stats.hard;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] rounded-3xl border border-gray-800/50 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full -mr-36 -mt-36 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full -ml-32 -mb-32 blur-2xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-32 h-32 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-5xl font-black shadow-2xl overflow-hidden border-4 border-[#161b22] transform hover:scale-105 transition-transform duration-300">
                  {profileData.user.profilePic ? (
                    <img src={profileData.user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white">{user?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-3 w-full">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {user?.username}
                  </h1>
                  <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                    {user?.role}
                  </span>
                </div>

                {profileData.user.location && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 animate-slideUp">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-sm">{profileData.user.location}</span>
                  </div>
                )}

                {profileData.user.bio && (
                  <p className="text-gray-300 max-w-2xl leading-relaxed text-sm md:text-base animate-slideUp animation-delay-200">
                    {profileData.user.bio}
                  </p>
                )}

                {/* Social Links & Edit Button */}
                <div className="flex flex-wrap gap-3 pt-4 justify-center md:justify-start items-center">
                  {profileData.user.github && (
                    <a
                      href={profileData.user.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 group"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {profileData.user.linkedin && (
                    <a
                      href={profileData.user.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] hover:bg-blue-600/10 border border-gray-800 hover:border-blue-600/30 rounded-xl text-sm font-semibold text-gray-300 hover:text-blue-400 transition-all duration-200 group"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="ml-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <form onSubmit={handleUpdate} className="mt-8 pt-8 border-t border-gray-800/50 animate-slideDown">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Profile Picture URL</label>
                    <input
                      value={editForm.profilePic}
                      onChange={(e) => setEditForm({...editForm, profilePic: e.target.value})}
                      placeholder="https://avatars.githubusercontent.com/..."
                      className="w-full bg-[#0d1117] border border-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 p-4 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Location</label>
                    <input
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      placeholder="San Francisco, CA"
                      className="w-full bg-[#0d1117] border border-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 p-4 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">GitHub Profile</label>
                    <input
                      value={editForm.github}
                      onChange={(e) => setEditForm({...editForm, github: e.target.value})}
                      placeholder="https://github.com/username"
                      className="w-full bg-[#0d1117] border border-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 p-4 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">LinkedIn Profile</label>
                    <input
                      value={editForm.linkedin}
                      onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-[#0d1117] border border-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 p-4 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-[#0d1117] border border-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 p-4 rounded-xl text-sm outline-none transition-all duration-200 resize-none placeholder:text-gray-600"
                      rows="4"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="md:col-span-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white p-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.98] disabled:opacity-50"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Stats & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Stats Panel */}
          <div className="space-y-6 animate-slideUp">
            {/* Total Solved Card */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/30 shadow-xl">
              <div className="text-center space-y-2">
                <p className="text-xs font-black text-blue-300 uppercase tracking-widest">Total Solved</p>
                <p className="text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{totalSolved}</p>
                <p className="text-xs text-gray-400 font-semibold">Problems Conquered</p>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="bg-[#161b22] p-6 rounded-2xl border border-gray-800/50 shadow-xl backdrop-blur-xl">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Difficulty Stats
              </h3>
              <div className="space-y-5">
                <StatRow label="Easy" count={stats.easy} total={totalSolved} color="text-green-500" bgColor="bg-green-500" />
                <StatRow label="Medium" count={stats.medium} total={totalSolved} color="text-yellow-500" bgColor="bg-yellow-500" />
                <StatRow label="Hard" count={stats.hard} total={totalSolved} color="text-red-500" bgColor="bg-red-500" />
              </div>
              <div className="pt-5 mt-5 border-t border-gray-800/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-bold uppercase tracking-wide">Accuracy</span>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${stats.accuracy}%` }} />
                    </div>
                    <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stats.accuracy}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#161b22] p-6 rounded-2xl border border-gray-800/50 shadow-xl">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-800/30">
                  <span className="text-sm text-gray-500">Total Submissions</span>
                  <span className="text-sm font-bold text-white">{recentActivity.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/30">
                  <span className="text-sm text-gray-500">Accepted</span>
                  <span className="text-sm font-bold text-green-400">{recentActivity.filter(s => s.verdict === 'Accepted').length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Rejected</span>
                  <span className="text-sm font-bold text-red-400">{recentActivity.filter(s => s.verdict !== 'Accepted').length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 animate-slideUp animation-delay-200">
            <div className="bg-[#161b22] rounded-2xl border border-gray-800/50 overflow-hidden shadow-xl backdrop-blur-xl">
              <div className="p-5 border-b border-gray-800/50 bg-gradient-to-r from-[#0d1117] to-[#161b22]">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  Recent Activity
                </h3>
              </div>
              <div className="divide-y divide-gray-800/50 max-h-[600px] overflow-y-auto">
                {recentActivity.map((sub, i) => (
                  <div
                    key={sub._id || i}
                    onClick={() => setSelectedSubId(sub._id)}
                    className="p-5 flex justify-between items-center hover:bg-gradient-to-r hover:from-[#1c2128] hover:to-[#161b22] transition-all duration-200 cursor-pointer group border-l-4 border-transparent hover:border-blue-500"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="space-y-2 flex-1">
                      <h4 className="font-bold text-base text-gray-200 group-hover:text-blue-400 transition-colors duration-200">
                        {sub.problem?.name || "Deleted Problem"}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold">
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md uppercase">{sub.language}</span>
                        <span>&bull;</span>
                        <span>{new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className={`text-xs font-black uppercase px-4 py-2 rounded-lg transition-all duration-200 ${
                      sub.verdict === "Accepted"
                        ? "bg-green-500/10 text-green-400 border border-green-500/30"
                        : "bg-red-500/10 text-red-400 border border-red-500/30"
                    }`}>
                      {sub.verdict === "Accepted" ? "&#10003; " : "&#10007; "}
                      {sub.verdict}
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="p-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-semibold">No submissions yet</p>
                    <p className="text-gray-600 text-sm">Start solving problems to see your activity here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubmissionModal submissionId={selectedSubId} onClose={() => setSelectedSubId(null)} />
    </div>
  );
};

const StatRow = ({ label, count, total, color, bgColor }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-xs font-bold uppercase text-gray-500">{label}</span>
      <span className={`text-sm font-black ${color}`}>{count} Solved</span>
    </div>
    <div className="h-2 w-full bg-gray-800/50 rounded-full overflow-hidden relative">
      <div
        className={`h-full ${bgColor} rounded-full transition-all duration-1000 ease-out shadow-lg`}
        style={{ width: `${total > 0 ? Math.min((count / Math.max(total, 1)) * 100, 100) : 0}%` }}
      />
    </div>
  </div>
);

export default Profile;
