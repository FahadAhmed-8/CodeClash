import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ form, handleChange, handleSubmit, loading, error }) => {
  const [focused, setFocused] = useState('');

  return (
    <div className="min-h-screen flex bg-[#0d1117]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col justify-center px-16 space-y-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-white mb-4">
              CODE<span className="text-blue-500">CLASH</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              The competitive programming arena where code meets competition. Solve, compete, and rise through the ranks.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-sm">
                &lt;/&gt;
              </div>
              <span className="text-sm">Multi-language code editor with C++, Python & Java</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-sm">
                AI
              </div>
              <span className="text-sm">AI-powered Genie mentor for hints & debugging</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 text-sm">
                #1
              </div>
              <span className="text-sm">Global leaderboard to track your progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-4">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              CODE<span className="text-blue-500">CLASH</span>
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to continue your coding journey</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused === 'email' || form.email
                    ? 'top-2 text-[10px] font-bold uppercase tracking-wider text-blue-400'
                    : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
                }`}>
                  Email Address
                </label>
                <input
                  type="email" name="email"
                  className={`w-full bg-[#161b22] border rounded-xl px-4 pt-7 pb-3 text-sm text-white outline-none transition-all duration-200 ${
                    focused === 'email' ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-gray-800 hover:border-gray-700'
                  }`}
                  value={form.email} onChange={handleChange} required
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                />
              </div>

              <div className="relative">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused === 'password' || form.password
                    ? 'top-2 text-[10px] font-bold uppercase tracking-wider text-blue-400'
                    : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
                }`}>
                  Password
                </label>
                <input
                  type="password" name="password"
                  className={`w-full bg-[#161b22] border rounded-xl px-4 pt-7 pb-3 text-sm text-white outline-none transition-all duration-200 ${
                    focused === 'password' ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-gray-800 hover:border-gray-700'
                  }`}
                  value={form.password} onChange={handleChange} required
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0d1117] px-4 text-gray-600 uppercase tracking-wider font-bold">New here?</span>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
