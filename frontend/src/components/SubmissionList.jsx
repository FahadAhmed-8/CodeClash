import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubmissionList = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter submissions for this specific problem
        const filtered = res.data.filter(s => s.problem && s.problem._id === problemId);
        setSubmissions(filtered);
      } catch (err) {
        console.error("Error fetching submissions", err);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  return (
    <div className="mt-6">
      <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-widest">Your Recent Submissions</h3>
      <div className="space-y-2">
        {submissions.length > 0 ? (
          submissions.map((s) => (
            <div key={s._id} className="bg-[#161b22] p-3 rounded border border-gray-800 flex justify-between items-center">
              <div>
                <span className={`font-bold text-sm ${s.verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                  {s.verdict}
                </span>
                <p className="text-[10px] text-gray-500">{new Date(s.submittedAt).toLocaleString()}</p>
              </div>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400 uppercase font-mono">
                {s.language}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-xs italic">No submissions yet.</p>
        )}
      </div>
    </div>
  );
};

export default SubmissionList;