const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto"); // Built-in Node.js module

const dirCodes = path.join(__dirname, "codes");
if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (code, language) => {
    const jobId = randomUUID(); // No more 'uuid' package needed!
    const fileName = language === "java" ? "Main.java" : `${jobId}.${language}`;
    const filePath = path.join(dirCodes, fileName);
    fs.writeFileSync(filePath, code);
    return filePath;
};

module.exports = generateFile;