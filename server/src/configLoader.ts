import fs from "fs";
import type Config from "./types/config.js";
import logger from "./logger.js";
import path from "path";
import { createInterface } from "readline";

const configPath = path.join(import.meta.dirname, "config.json");

const configInitializer = () => {
  return new Promise<void>((resolve) => {
    const readlineInterface = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readlineInterface.question("Discord Developer Portalで作成したアプリのClient IDを入力してください: ", (clientId) => {
      const config: Config = {
        clientId
      };
      fs.writeFileSync(configPath, JSON.stringify(config), "utf-8");
      logger.log("config.jsonにclientIdを保存しました。");
      readlineInterface.close();
      resolve();
    });
  });
}

const configLoader = async() => {
  // 設定ファイルがなかったら作成
  if (!fs.existsSync(configPath)) {
    logger.log("config.jsonが見つかりませんでした。");
    fs.writeFileSync(configPath, "{}", "utf-8");
    logger.log("config.jsonを作成しました。clientIdを入力してください。");
    await configInitializer();
  }

  const raw = fs.readFileSync(configPath, "utf-8").trim();
  if (!raw || raw === "{}") {
    logger.log("config.jsonが空です。clientIdを入力してください。");
    await configInitializer();
    const config: Config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return config;
  }

  try {
    const config: Config = JSON.parse(raw);

    if (!config.clientId) {
      logger.log("clientIdが未設定です。clientIdを入力してください。");
      await configInitializer();
      const initializedConfig: Config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return initializedConfig;
    }

    return config;
  } catch {
    logger.log("config.jsonの形式が不正です。clientIdを入力してください。");
    await configInitializer();
    const config: Config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return config;
  }
}

export default configLoader;
