import React, { useState } from "react";
import { Link } from "react-router-dom";

const FloatingInput = ({ name, type = 'text', label, required = true, form, focused, setFocused, handleChange }) => (
  <div className="relative">
    <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
      focused === name || form[name]
        ? 'top-2 text-[10px] font-bold uppercase tracking-wider text-blue-400'
        : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
    }`}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      className={`w-full bg-[#161b22] border rounded-xl px-4 pt-7 pb-3 text-sm text-white outline-none transition-all duration-200 ${
        focused === name ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-gray-800 hover:border-gray-700'
      }`}
      value={form[name]}
      onChange={handleChange}
      required={required}
      onFocus={() => setFocused(name)}
      onBlur={() => setFocused('')}
    />
  </div>
);

const RegisterForm = ({ form, handleChange, handleSubmit, loading, error }) => {
  const [focused, setFocused] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { width: '0%', color: 'bg-gray-700', label: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { width: '25%', color: 'bg-red-500', label: 'Weak' },
      { width: '50%', color: 'bg-yellow-500', label: 'Fair' },
      { width: '75%', color: 'bg-blue-500', label: 'Good' },
      { width: '100%', color: 'bg-green-500', label: 'Strong' },
    ];
    return levels[Math.min(score, 4) - 1] || levels[0];
  };

  const strength = passwordStrength();
  const inputProps = { form, focused, setFocused, handleChange };

  return (
    <div className="min-h-screen flex bg-[#0d1117]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent" />
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col justify-center px-16 space-y-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-white mb-4">
              CODE<span className="text-blue-500">CLASH</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Join the arena. Write code that matters. Compete with developers around the world.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                What you get
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><span className="text-green-400">+</span> Unlimited problem solving</li>
                <li className="flex items-center gap-2"><span className="text-green-400">+</span> AI Genie mentor access</li>
                <li className="flex items-center gap-2"><span className="text-green-400">+</span> Global leaderboard ranking</li>
                <li className="flex items-center gap-2"><span className="text-green-400">+</span> Detailed performance analytics</li>
                <li className="flex items-center gap-2"><span className="text-green-400">+</span> Multi-language support (C++, Python, Java)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-4">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              CODE<span className="text-blue-500">CLASH</span>
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">Create account</h2>
            <p className="text-gray-500 text-sm">Start your competitive programming journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingInput name="username" label="Username" {...inputProps} />
            <FloatingInput name="email" type="email" label="Email Address" {...inputProps} />

            <div className="space-y-2">
              <FloatingInput name="password" type="password" label="Password" {...inputProps} />
              {form.password && (
                <div className="space-y-1 px-1">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} rounded-full transition-all duration-500`} style={{ width: strength.width }} />
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <FloatingInput name="confirmPassword" type="password" label="Confirm Password" {...inputProps} />

            {/* Admin toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdmin(!showAdmin)}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors font-medium flex items-center gap-1"
              >
                <span className={`transition-transform duration-200 ${showAdmin ? 'rotate-90' : ''}`}>&#9654;</span>
                Admin access
              </button>
              {showAdmin && (
                <div className="mt-3 animate-fadeIn">
                  <FloatingInput name="adminSecret" type="password" label="Admin Secret Key" required={false} {...inputProps} />
                  <p className="text-[10px] text-gray-600 mt-2 px-1">
                    Only fill this if you have been given an admin key.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
