const { exec } = require("child_process");
const path = require("path");

const executeJava = (filepath, inputFilePath = "") => {
  const dir = path.dirname(filepath);
  const className = path.basename(filepath, ".java");

  return new Promise((resolve, reject) => {
    const compileCmd = `javac "${filepath}"`;
    const inputRedirect = inputFilePath ? `< "${inputFilePath}"` : "";
    const runCmd = `timeout 2s java -cp "${dir}" ${className} ${inputRedirect}`;

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

module.exports = executeJava;