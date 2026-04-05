import fs from "fs";
import path from "path";

class Logger {
  private logFile: string;

  constructor() {
    if (!fs.existsSync(path.join(import.meta.dirname, "debug.log"))) {
      fs.writeFileSync(path.join(import.meta.dirname, "debug.log"), "", "utf-8");
    }

    this.logFile = path.join(import.meta.dirname, "debug.log");
  }

  log(message: string) {
    const timestamp = new Date().toLocaleString();

    const logMsg = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(this.logFile, logMsg)
  }
}

export default new Logger();
