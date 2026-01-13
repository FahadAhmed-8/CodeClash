import React from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ form, handleChange, handleSubmit, loading, error }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
    <div className="bg-[#161b22] p-8 rounded-xl border border-gray-800 shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-green-500 mb-6 text-center">Welcome Back</h2>
      
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-5">
        <div>
          <input 
            type="email" name="email" placeholder="Email" 
            className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-green-600 outline-none transition"
            value={form.email} onChange={handleChange} required 
          />
        </div>
        <div>
          <input 
            type="password" name="password" placeholder="Password" 
            className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-green-600 outline-none transition"
            value={form.password} onChange={handleChange} required 
          />
        </div>

        {/* Inline Error Message */}
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <button 
          disabled={loading}
          type="submit" 
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Navigation Link */}
      <p className="mt-6 text-center text-gray-500 text-sm">
        Don’t have an account? <Link to="/register" className="text-green-400 hover:underline">Create one</Link>
      </p>
    </div>
  </div>
);

export default LoginForm;