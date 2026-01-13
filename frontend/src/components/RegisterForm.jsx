import React from "react";
import { Link } from "react-router-dom";

const RegisterForm = ({ form, handleChange, handleSubmit, loading, error }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
    <div className="bg-[#161b22] p-8 rounded-xl border border-gray-800 shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="adminSecret"
          placeholder="Admin Key (Optional)"
          className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none transition"
          value={form.adminSecret}
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500 mt-1 italic">
          Only fill this if you are a platform administrator.
        </p>

        {/* Inline Error Message */}
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        <button
          disabled={loading}
          type="submit"
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Navigation Link */}
      <p className="mt-6 text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  </div>
);

export default RegisterForm;
