const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputFilePath = "") => {
  const jobId = path.basename(filepath).split(".")[0];
  const outFile = `${jobId}.out`;
  const outPath = path.join(outputPath, outFile);

  const inputRedirect = inputFilePath ? `< "${inputFilePath}"` : "";
  // In Linux, we use g++ and run with ./
  const compileCmd = `g++ "${filepath}" -o "${outPath}"`;
  const runCmd = `timeout 2s "${outPath}" ${inputRedirect}`;

  return new Promise((resolve, reject) => {
    exec(compileCmd, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return reject({ error: "Compilation Failed", details: compileStderr || compileErr.message });
      }
      exec(runCmd, (runErr, stdout, stderr) => {
        if (runErr) {
          if (runErr.signal === "SIGTERM") return reject({ error: "Time Limit Exceeded" });
          return reject({ error: "Runtime Error", details: stderr || runErr.message });
        }
        resolve(stdout);
      });
    });
  });
};

module.exports = executeCpp;