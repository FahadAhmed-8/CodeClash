const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const dirInputs = path.join(__dirname, "inputs");
if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = (inputs) => {
    const jobId = randomUUID();
    const inputFileName = `${jobId}.txt`;
    const inputFilePath = path.join(dirInputs, inputFileName);
    fs.writeFileSync(inputFilePath, inputs || "");
    return inputFilePath;
};

module.exports = generateInputFile;