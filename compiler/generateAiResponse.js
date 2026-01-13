const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateAiResponse = async ({ code, verdict, testResults }) => {
  // We only provide details of the failed test case to save tokens and keep focus
  const failedCase = testResults.find(t => t.status !== 'Passed') || testResults[0];

  let prompt = `You are an expert competitive programming coach. 
  A user submitted code that resulted in a "${verdict}".
  
  User's Code:
  \`\`\`
  ${code}
  \`\`\`

  Failed Test Case Details:
  - Input: ${failedCase.input}
  - Expected Output: ${failedCase.expected}
  - User's Actual Output: ${failedCase.actual}

  Please:
  1. Identify the logical error or edge case they missed.
  2. Explain why their current approach leads to the wrong output.
  3. Provide a hint for the fix (don't give the full corrected code immediately unless it's a small syntax fix).
  4. Mention if the time complexity is the issue (if verdict is TLE).`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq Review Error:", error);
    return "The Genie tried to look at your code but got distracted. Try again!";
  }
};

module.exports = generateAiResponse;