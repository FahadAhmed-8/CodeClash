import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import SubmissionList from "../components/SubmissionList";
import ReactMarkdown from "react-markdown";

// Starter code templates
const boilerplates = {
  cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}",
  py: '# Write your Python code here\nprint("Hello CodeClash")',
  java: "public class Main {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}",
};

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editor States
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(boilerplates.cpp);

  // Execution & UI States
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [refreshSubmissions, setRefreshSubmissions] = useState(0);

  // Genie AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  // 1. Fetch Problem Data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  // 2. Language Switch Logic
  useEffect(() => {
    if (boilerplates[language]) setCode(boilerplates[language]);
    setOutput("");
    setVerdict(null);
    setAiResponse(""); // Clear AI response when changing language
  }, [language]);

  // 3. Handle "Run" (Port 8000)
  const handleRunCode = async () => {
    setIsRunning(true);
    setVerdict(null);
    setShowCustomInput(false);
    setOutput("Running code...");
    const inputToUse = showCustomInput ? customInput : problem.samples[0]?.input || "";
    try {
      const response = await axios.post("http://localhost:8000/run", {
        code,
        language,
        input: inputToUse,
      });
      setOutput(response.data.output);
    } catch (err) {
      setOutput(err.response?.data?.error || "Execution Error");
    } finally {
      setIsRunning(false);
    }
  };

  // 4. Handle "Submit" (Port 8000 for Code + Port 5000 for DB + Port 8000 for AI)
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setVerdict(null);
    setAiResponse(""); 
    setOutput('Checking hidden test cases...');

    let allPassed = true;
    let finalVerdict = "Accepted";
    let firstFailedCase = null;

    try {
      // Loop through test cases
      for (let i = 0; i < problem.testCases.length; i++) {
        const tc = problem.testCases[i];
        const res = await axios.post('http://localhost:8000/run', { code, language, input: tc.input });
        
        const userOutput = res.data.output.trim();
        const expectedOutput = tc.expectedOutput.trim();

        if (userOutput !== expectedOutput) {
          allPassed = false;
          finalVerdict = "Wrong Answer";
          firstFailedCase = { input: tc.input, expected: expectedOutput, actual: userOutput, status: 'Failed' };
          setVerdict("Wrong Answer");
          setOutput(`❌ Failed on Test Case ${i + 1}`);
          break;
        }
      }

      if (allPassed) {
        setVerdict("Accepted");
        setOutput("✅ All test cases passed!");
      }

      // Save to Database (Port 5000)
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/submissions', {
        problemId: id, code, language, verdict: finalVerdict
      }, { headers: { Authorization: `Bearer ${token}` } });

      setRefreshSubmissions(prev => prev + 1);

      // PROACTIVE GENIE: Auto-review on failure
      if (!allPassed && firstFailedCase) {
        setAiLoading(true);
        try {
          const aiReview = await axios.post('http://localhost:8000/ai-review', {
            code,
            verdict: finalVerdict,
            testResults: [firstFailedCase]
          });
          setAiResponse(aiReview.data.response);
        } catch (e) {
          console.error("AI Auto-review failed");
        } finally {
          setAiLoading(false);
        }
      }

    } catch (err) {
      setOutput("Submission Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Manual Genie Functions
  const askGenie = async (type) => {
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await axios.post("http://localhost:8000/genieExplain", {
        problemStatement: problem.statement,
        type: type,
      });
      setAiResponse(res.data.response);
    } catch (err) {
      setAiResponse("Genie is busy right now. Try again!");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="text-center p-20 text-white font-mono animate-pulse">Loading...</div>;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-[#0d1117] overflow-hidden">
      
      {/* LEFT PANE: Problem Description & Genie */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-gray-800 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
        <h1 className="text-3xl font-bold text-white tracking-tight">{problem.name}</h1>

        {/* Genie Interaction Hub */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => askGenie("simplify")} className="text-[10px] bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded hover:bg-purple-600 hover:text-white transition uppercase font-black">🧞 Simplify</button>
          <button onClick={() => askGenie("approach")} className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition uppercase font-black">💡 Strategy</button>
          <button onClick={() => askGenie("edge-cases")} className="text-[10px] bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded hover:bg-yellow-600 hover:text-white transition uppercase font-black">⚠️ Edge Cases</button>
        </div>

        {/* Genie Response Area */}
        {(aiResponse || aiLoading) && (
          <div className={`p-5 rounded-xl border transition-all duration-500 ${aiLoading ? 'bg-blue-900/10 border-blue-500/20 animate-pulse' : 'bg-purple-900/10 border-purple-500/30 shadow-xl'}`}>
            <div className="flex items-center gap-3 mb-3 border-b border-purple-500/20 pb-2">
              <div className="text-xl">✨</div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-tighter">Genie Assistant</h4>
                <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">{aiLoading ? "Thinking..." : "Analysis Ready"}</p>
              </div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none font-sans leading-relaxed text-gray-300">
              {aiLoading ? (
                <div className="flex gap-1 py-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              ) : (
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              )}
            </div>
          </div>
        )}

        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
          {problem.statement}
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-800">
          <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest">Samples</h3>
          {problem.samples.map((s, i) => (
            <div key={i} className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-[#161b22] p-3 rounded border border-gray-800"><p className="text-gray-500 mb-1 font-bold">INPUT</p><pre className="text-gray-300">{s.input}</pre></div>
              <div className="bg-[#161b22] p-3 rounded border border-gray-800"><p className="text-gray-500 mb-1 font-bold">OUTPUT</p><pre className="text-gray-300">{s.output}</pre></div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800">
          <SubmissionList problemId={id} key={refreshSubmissions} />
        </div>
      </div>

      {/* RIGHT PANE: Code Editor & Console */}
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="bg-[#161b22] p-2 border-b border-gray-800 flex justify-between items-center">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-[#0d1117] text-white border border-gray-700 rounded px-2 py-1 text-xs outline-none">
            <option value="cpp">C++ 17</option>
            <option value="py">Python 3</option>
            <option value="java">Java 17</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleRunCode} disabled={isRunning || isSubmitting} className="bg-[#30363d] text-white px-4 py-1 rounded text-xs font-bold hover:bg-[#3c444d] transition">Run</button>
            <button onClick={handleSubmitCode} disabled={isRunning || isSubmitting} className="bg-green-600 text-white px-6 py-1 rounded text-xs font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/20">Submit</button>
          </div>
        </div>

        <div className="flex-1">
          <Editor height="100%" theme="vs-dark" language={language === "py" ? "python" : language} value={code} onChange={(val) => setCode(val)} options={{ fontSize: 14, minimap: { enabled: false }, cursorBlinking: "smooth", padding: { top: 10 } }} />
        </div>

        <div className="h-48 bg-[#0d1117] border-t border-gray-800 flex flex-col">
          <div className="flex bg-[#161b22] border-b border-gray-800">
            <button onClick={() => setShowCustomInput(false)} className={`px-6 py-2 text-[10px] font-black uppercase transition-all ${!showCustomInput ? "text-blue-400 border-b-2 border-blue-400 bg-[#0d1117]" : "text-gray-500"}`}>Output</button>
            <button onClick={() => setShowCustomInput(true)} className={`px-6 py-2 text-[10px] font-black uppercase transition-all ${showCustomInput ? "text-blue-400 border-b-2 border-blue-400 bg-[#0d1117]" : "text-gray-500"}`}>Custom Input</button>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs">
            {showCustomInput ? (
              <textarea className="w-full h-full bg-transparent outline-none text-gray-400 resize-none" placeholder="Enter input..." value={customInput} onChange={(e) => setCustomInput(e.target.value)} />
            ) : (
              <div>
                {verdict && <div className={`text-lg font-black italic mb-2 ${verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>{verdict.toUpperCase()}</div>}
                <pre className={`${!verdict ? 'text-gray-500' : (verdict === 'Accepted' ? 'text-green-400' : 'text-red-400')} whitespace-pre-wrap`}>{output || "Ready for execution..."}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;