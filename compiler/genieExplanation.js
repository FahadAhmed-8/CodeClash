const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const getGenieExplanation = async ({ problemStatement, type }) => {
    let prompt = `You are a helpful AI coding assistant.\n\nHere is the problem statement:\n${problemStatement}\n\n`;

    switch (type) {
        case 'simplify':
            prompt += "Explain this problem in very simple terms.";
            break;
        case 'approach':
            prompt += "Suggest an optimal approach to solve this problem.";
            break;
        case 'edge-cases':
            prompt += "List tricky edge cases that must be handled.";
            break;
        case 'code':
            prompt += "Write correct, clean code with a brief explanation.";
            break;
        default:
            prompt += "Explain this problem helpfully.";
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile", // Use the 2026 flagship free model
        });

        return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq Error:", error);
        return "The Genie is currently resting. Please try again in a moment.";
    }
};

module.exports = getGenieExplanation;