import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Editor from "@monaco-editor/react";

const SubmissionModal = ({ submissionId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDetails(res.data);
      } catch (err) {
        setError("Could not load submission code.");
        console.error("Failed to fetch submission:", err);
      } finally {
        setLoading(false);
      }
    };
    if (submissionId) fetchDetails();
  }, [submissionId]);

  const handleCopy = () => {
    if (details?.code) {
      navigator.clipboard.writeText(details.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  if (!submissionId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161b22] w-full max-w-4xl h-[80vh] rounded-2xl border border-gray-800 flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0d1117]">
          <div className="flex flex-col">
            <h2 className="text-white font-bold">{details?.problem?.name || "Submission"}</h2>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
              {details ? `${details.language} • ${details.verdict}` : "Loading..."}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {details && (
              <button 
                onClick={handleCopy}
                className={`text-[10px] font-black uppercase px-3 py-1 rounded border transition-all ${
                  copied 
                  ? 'bg-green-500/10 text-green-500 border-green-500/50' 
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white hover:border-gray-500'
                }`}
              >
                {copied ? "✓ Copied" : "Copy Code"}
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-light leading-none transition-colors">
              &times;
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-mono text-xs italic">Retrieving logic from the vault...</p>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-400 font-mono text-xs italic">
              ⚠️ {error}
            </div>
          ) : details ? (
            <Editor
              height="100%"
              theme="vs-dark"
              language={details.language === 'py' ? 'python' : details.language}
              value={details.code}
              options={{ 
                readOnly: true, 
                fontSize: 14, 
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 20 }
              }}
            />
          ) : null}
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-[#0d1117] border-t border-gray-800 flex justify-between items-center">
            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                ID: {submissionId}
            </span>
            <span className="text-[10px] text-gray-400 italic">
                {details ? new Date(details.submittedAt).toLocaleString() : ""}
            </span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;