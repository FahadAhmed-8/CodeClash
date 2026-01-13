const { exec } = require("child_process");
const path = require("path");

const executePython = (filepath, inputFilePath = "") => {
  const inputRedirect = inputFilePath ? `< "${inputFilePath}"` : "";
  // Alpine uses python3
  const command = `timeout 2s python3 "${filepath}" ${inputRedirect}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        if (error.signal === "SIGTERM") return reject({ error: "Time Limit Exceeded" });
        return reject({ error: "Runtime Error", details: stderr || error.message });
      }
      resolve(stdout);
    });
  });
};

module.exports = executePython;