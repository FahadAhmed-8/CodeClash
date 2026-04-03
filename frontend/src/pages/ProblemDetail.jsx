import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import SubmissionList from "../components/SubmissionList";
import ReactMarkdown from "react-markdown";

// Starter code templates
const boilerplates = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Write your solution here

    return 0;
}`,
  py: `import sys
input = sys.stdin.readline

# Write your solution here
`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Write your solution here

    }
}`,
};

// Monaco editor language mapping
const monacoLangMap = {
  cpp: "cpp",
  py: "python",
  java: "java",
};

const ProblemDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("contest");
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editor States
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(boilerplates.cpp);
  const [editorTheme, setEditorTheme] = useState("vs-dark");

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
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${id}`);
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
    setAiResponse("");
  }, [language]);

  // 3. Handle "Run"
  const handleRunCode = async () => {
    setIsRunning(true);
    setVerdict(null);
    setShowCustomInput(false);
    setOutput("Running code...");
    const inputToUse = showCustomInput ? customInput : problem.samples[0]?.input || "";
    try {
      const response = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/run`, {
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

  // 4. Handle "Submit"
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setVerdict(null);
    setAiResponse("");
    setOutput('Checking hidden test cases...');

    let allPassed = true;
    let finalVerdict = "Accepted";
    let firstFailedCase = null;

    try {
      for (let i = 0; i < problem.testCases.length; i++) {
        const tc = problem.testCases[i];
        const res = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/run`, { code, language, input: tc.input });

        const userOutput = res.data.output.trim();
        const expectedOutput = tc.expectedOutput.trim();

        if (userOutput !== expectedOutput) {
          allPassed = false;
          finalVerdict = "Wrong Answer";
          firstFailedCase = { input: tc.input, expected: expectedOutput, actual: userOutput, status: 'Failed' };
          setVerdict("Wrong Answer");
          setOutput(`Failed on Test Case ${i + 1}`);
          break;
        }
      }

      if (allPassed) {
        setVerdict("Accepted");
        setOutput("All test cases passed!");
      }

      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submissions`, {
        problemId: id, code, language, verdict: finalVerdict
      }, { headers: { Authorization: `Bearer ${token}` } });

      // If solving inside a contest, submit to contest endpoint
      if (contestId && allPassed) {
        try {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/contests/${contestId}/submit`,
            { problemId: id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (contestErr) {
          console.error("Contest submit error:", contestErr);
        }
      }

      setRefreshSubmissions(prev => prev + 1);

      if (!allPassed && firstFailedCase) {
        setAiLoading(true);
        try {
          const aiReview = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/ai-review`, {
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
      const res = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/genieExplain`, {
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

  // Editor options
  const editorOptions = {
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",
    fontLigatures: true,
    minimap: { enabled: false },
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    smoothScrolling: true,
    padding: { top: 16, bottom: 16 },
    lineNumbers: "on",
    renderLineHighlight: "all",
    bracketPairColorization: { enabled: true },
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    autoIndent: "full",
    formatOnPaste: true,
    suggestOnTriggerCharacters: true,
    wordWrap: "off",
    scrollBeyondLastLine: false,
    tabSize: 4,
    insertSpaces: true,
    renderWhitespace: "selection",
    guides: {
      bracketPairs: true,
      indentation: true,
    },
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showVariables: true,
    },
  };

  const editorThemes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' },
  ];

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-[#0d1117] overflow-hidden">
        <div className="w-full md:w-1/2 p-6 space-y-6 border-r border-gray-800">
          <div className="skeleton h-10 w-3/4 rounded-xl" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-7 w-24 rounded" />)}
          </div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-4 rounded" style={{ width: `${85 - i * 5}%` }} />)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="skeleton h-24 rounded-lg" />
            <div className="skeleton h-24 rounded-lg" />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="skeleton h-12 rounded-none" />
          <div className="flex-1 skeleton rounded-none" />
          <div className="skeleton h-48 rounded-none" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-[#0d1117] overflow-hidden">

      {/* LEFT PANE: Problem Description & Genie */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-gray-800 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
        <h1 className="text-3xl font-bold text-white tracking-tight animate-fadeIn">{problem.name}</h1>

        {/* Genie Interaction Hub */}
        <div className="flex flex-wrap gap-2 animate-slideUp">
          <GenieButton onClick={() => askGenie("simplify")} color="purple" label="Simplify" icon="&#9880;" />
          <GenieButton onClick={() => askGenie("approach")} color="blue" label="Strategy" icon="&#128161;" />
          <GenieButton onClick={() => askGenie("edge-cases")} color="yellow" label="Edge Cases" icon="&#9888;" />
        </div>

        {/* Genie Response Area */}
        {(aiResponse || aiLoading) && (
          <div className={`p-5 rounded-xl border transition-all duration-500 animate-scaleIn ${aiLoading ? 'bg-blue-900/10 border-blue-500/20' : 'bg-purple-900/10 border-purple-500/30 shadow-xl'}`}>
            <div className="flex items-center gap-3 mb-3 border-b border-purple-500/20 pb-2">
              <div className="text-xl">&#10024;</div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-tighter">Genie Assistant</h4>
                <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">{aiLoading ? "Thinking..." : "Analysis Ready"}</p>
              </div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none font-sans leading-relaxed text-gray-300">
              {aiLoading ? (
                <div className="flex gap-1.5 py-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
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
              <div className="bg-[#161b22] p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                <p className="text-gray-500 mb-1 font-bold text-[10px] uppercase tracking-wider">Input</p>
                <pre className="text-gray-300">{s.input}</pre>
              </div>
              <div className="bg-[#161b22] p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                <p className="text-gray-500 mb-1 font-bold text-[10px] uppercase tracking-wider">Output</p>
                <pre className="text-gray-300">{s.output}</pre>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800">
          <SubmissionList problemId={id} key={refreshSubmissions} />
        </div>
      </div>

      {/* RIGHT PANE: Code Editor & Console */}
      <div className="w-full md:w-1/2 flex flex-col">
        {/* Editor Toolbar */}
        <div className="bg-[#161b22] p-2 border-b border-gray-800 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#0d1117] text-white border border-gray-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="cpp">C++ 17</option>
              <option value="py">Python 3</option>
              <option value="java">Java 17</option>
            </select>
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className="bg-[#0d1117] text-gray-400 border border-gray-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {editorThemes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRunCode}
              disabled={isRunning || isSubmitting}
              className="bg-[#30363d] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#3c444d] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isRunning ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running
                </span>
              ) : "Run"}
            </button>
            <button
              onClick={handleSubmitCode}
              disabled={isRunning || isSubmitting}
              className="bg-green-600 text-white px-6 py-1.5 rounded-lg text-xs font-bold hover:bg-green-500 transition-all duration-200 shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Testing
                </span>
              ) : "Submit"}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            theme={editorTheme}
            language={monacoLangMap[language]}
            value={code}
            onChange={(val) => setCode(val)}
            options={editorOptions}
            loading={
              <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            }
          />
        </div>

        {/* Output Console */}
        <div className="h-48 bg-[#0d1117] border-t border-gray-800 flex flex-col">
          <div className="flex bg-[#161b22] border-b border-gray-800">
            <button
              onClick={() => setShowCustomInput(false)}
              className={`px-6 py-2 text-[10px] font-black uppercase transition-all duration-200 ${!showCustomInput ? "text-blue-400 border-b-2 border-blue-400 bg-[#0d1117]" : "text-gray-500 hover:text-gray-400"}`}
            >
              Output
            </button>
            <button
              onClick={() => setShowCustomInput(true)}
              className={`px-6 py-2 text-[10px] font-black uppercase transition-all duration-200 ${showCustomInput ? "text-blue-400 border-b-2 border-blue-400 bg-[#0d1117]" : "text-gray-500 hover:text-gray-400"}`}
            >
              Custom Input
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs">
            {showCustomInput ? (
              <textarea
                className="w-full h-full bg-transparent outline-none text-gray-400 resize-none placeholder-gray-600"
                placeholder="Enter input..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              />
            ) : (
              <div className="animate-fadeIn">
                {verdict && (
                  <div className={`text-lg font-black italic mb-2 ${verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                    {verdict === 'Accepted' ? '&#10003; ' : '&#10007; '}
                    {verdict.toUpperCase()}
                  </div>
                )}
                <pre className={`${!verdict ? 'text-gray-500' : (verdict === 'Accepted' ? 'text-green-400' : 'text-red-400')} whitespace-pre-wrap`}>
                  {output || "Ready for execution..."}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GenieButton = ({ onClick, color, label, icon }) => (
  <button
    onClick={onClick}
    className={`text-[10px] bg-${color}-600/20 text-${color}-400 border border-${color}-600/30 px-3 py-1.5 rounded-lg hover:bg-${color}-600 hover:text-white transition-all duration-200 uppercase font-black active:scale-95`}
  >
    <span className="mr-1">{icon}</span> {label}
  </button>
);

export default ProblemDetail;
