require('dotenv').config();
const express = require("express");
const cors = require('cors');
const generateFile = require("./generateFile");
const generateInputFile = require('./generateInputFile');
const executeCpp = require("./executeCpp");
const executePython = require("./executePython");
const executeJava = require("./executeJava");
const generateAiResponse = require('./generateAiResponse');
const genieExplanation = require('./genieExplanation');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/run", async (req, res) => {
    const { code, input, language } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({ success: false, error: "Empty code body" });
    }

    try {
        const filePath = generateFile(code, language);
        const inputFilePath = generateInputFile(input);
        let output;

        if (language === "cpp") {
            output = await executeCpp(filePath, inputFilePath);
        } else if (language === "py") {
            output = await executePython(filePath, inputFilePath);
        } else if (language === "java") {
            output = await executeJava(filePath, inputFilePath);
        } else {
            return res.status(400).json({ error: "Unsupported language" });
        }

        res.json({ output });
    } catch (error) {
        console.error("EXECUTION ERROR:", error);
        res.status(500).json({ 
            success: false, 
            error: error.details || error.error || "Internal Server Error" 
        });
    }
});

app.post("/ai-review", async (req, res) => {
    const { code, verdict, testResults } = req.body;
    try {
        const response = await generateAiResponse({ code, verdict, testResults });
        res.json({ success: true, response });
    } catch (error) {
        console.error("Gemini Review Error:", error.message);
        res.status(500).json({ success: false, error: "AI Review failed" });
    }
});

app.post("/genieExplain", async (req, res) => {
    const { problemStatement, type } = req.body;
    try {
        const response = await genieExplanation({ problemStatement, type });
        res.json({ success: true, response });
    } catch (err) {
        console.error("GenieExplain error:", err.message);
        res.status(500).json({ success: false, error: "Gemini failed to respond" });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Compiler Service running on port ${PORT}`));