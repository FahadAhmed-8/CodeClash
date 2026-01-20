import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminCreateProblem = () => {
  const [formData, setFormData] = useState({
    name: '',
    difficulty: 'Easy',
    tags: '',
    statement: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
  });

  // Dynamic lists for Samples and Test Cases
  const [samples, setSamples] = useState([{ input: '', output: '' }]);
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);

  const navigate = useNavigate();

  // Helper to update dynamic fields
  const handleDynamicChange = (index, e, type) => {
    const list = type === 'sample' ? [...samples] : [...testCases];
    const field = e.target.name;
    list[index][field] = e.target.value;
    type === 'sample' ? setSamples(list) : setTestCases(list);
  };

  // Helper to add new rows
  const addRow = (type) => {
    if (type === 'sample') setSamples([...samples, { input: '', output: '' }]);
    else setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const problemData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      samples: samples,
      testCases: testCases
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/problems`, problemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Problem Created with " + testCases.length + " test cases!");
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create problem");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Create Advanced Challenge</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-[#161b22] p-8 rounded-xl border border-gray-800 shadow-xl">
        
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-6">
          <input type="text" placeholder="Problem Name" className="bg-[#0d1117] border border-gray-700 p-3 rounded" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <select className="bg-[#0d1117] border border-gray-700 p-3 rounded text-gray-400"
            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <textarea placeholder="Problem Statement" className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded h-32"
          onChange={(e) => setFormData({...formData, statement: e.target.value})} required />

        {/* Dynamic Samples Section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-blue-400">Public Samples</h3>
            <button type="button" onClick={() => addRow('sample')} className="text-xs bg-blue-600/20 text-blue-400 border border-blue-600/50 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition">
              + Add Sample
            </button>
          </div>
          {samples.map((s, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-3">
              <input name="input" placeholder={`Sample Input ${index + 1}`} className="bg-[#0d1117] border border-gray-700 p-2 rounded"
                value={s.input} onChange={(e) => handleDynamicChange(index, e, 'sample')} />
              <input name="output" placeholder={`Sample Output ${index + 1}`} className="bg-[#0d1117] border border-gray-700 p-2 rounded"
                value={s.output} onChange={(e) => handleDynamicChange(index, e, 'sample')} />
            </div>
          ))}
        </div>

        {/* Dynamic Test Cases Section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-red-400">Hidden Test Cases</h3>
            <button type="button" onClick={() => addRow('testcase')} className="text-xs bg-red-600/20 text-red-400 border border-red-600/50 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition">
              + Add Test Case
            </button>
          </div>
          {testCases.map((tc, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-3">
              <textarea name="input" placeholder={`Hidden Input ${index + 1}`} className="bg-[#0d1117] border border-gray-700 p-2 rounded h-20"
                value={tc.input} onChange={(e) => handleDynamicChange(index, e, 'testcase')} />
              <textarea name="expectedOutput" placeholder={`Expected Output ${index + 1}`} className="bg-[#0d1117] border border-gray-700 p-2 rounded h-20"
                value={tc.expectedOutput} onChange={(e) => handleDynamicChange(index, e, 'testcase')} />
            </div>
          ))}
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-lg font-bold transition-all shadow-lg shadow-purple-900/20">
          Create Problem with Multiple Cases
        </button>
      </form>
    </div>
  );
};

export default AdminCreateProblem;