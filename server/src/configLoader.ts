import fs from "fs";
import type Config from "./types/config.js";

const configLoader: () => Config = () => {
  const config: Config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

  return config;
}

export default configLoader;
