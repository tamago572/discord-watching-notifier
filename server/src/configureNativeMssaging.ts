import { platform } from 'os';
import { exec } from 'child_process';
import logger from './logger.js';
import path from 'path';
import fs from 'fs';

const extensionId = "ipmllopioejmlgcmfgofncooelhfkkag";

const registerRegistry = () => {
  exec(`REG ADD "HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\dev.bunbunapp.discord_watching_notifier" /ve /t REG_SZ /d "${path.join(path.dirname(process.execPath), "discord-watching-notifier-manifest.json")}" /f`, (addError, addStdout, addStderr) => {
    if (addError) {
      logger.log(`Error adding registry key: ${addError.message}`);
    }
  });
}

interface Manifest {
  name: string;
  description: string;
  path: string;
  type: string;
  allowed_origins: string[];
}

const manifest: Manifest = {
  name: "dev.bunbunapp.discord_watching_notifier",
  description: "Discord Watching Notifier",
  path: process.execPath,
  type: "stdio",
  allowed_origins: [`chrome-extension://${extensionId}/`]
}

const writeManifestFile = () => {
  const manifestPath = path.join(path.dirname(process.execPath), "discord-watching-notifier-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest), "utf-8");
  logger.log(`Manifest file written to ${manifestPath}`);
}

const configureNativeMessaging = () => {
  const currentPlatform = platform();

  if (currentPlatform === 'win32') {
    // Windows
    // ChromeのNative Messagingに登録されているレジストリを取得
    exec('reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\NativeMessagingHosts\\dev.bunbunapp.discord_watching_notifier"', (error, stdout, stderr) => {
      if (error) {
        logger.log(`Error querying registry: ${error.message}`);
        logger.log(`これを実行します REG ADD "HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\dev.bunbunapp.discord_watching_notifier" /ve /t REG_SZ /d "${path.join(path.dirname(process.execPath), "discord-watching-notifier-manifest.json")}" /f`);
        // レジストリキーを作成
        registerRegistry();
        return;
      }
      logger.log(`Registry query result: ${stdout}`);
      // 実行時のmanifest.jsonのパスとレジストリのパスが一致しているか確認
      const manifestPath = path.join(path.dirname(process.execPath), "discord-watching-notifier-manifest.json");
      if (stdout.includes(manifestPath)) {
        logger.log("Registry is correctly set up.");
      } else {
        logger.log("Registry is not correctly set up. Updating registry.");
        // レジストリキーを更新
        registerRegistry();
      }
    });

    fs.existsSync(path.join(path.dirname(process.execPath), "discord-watching-notifier-manifest.json")) || writeManifestFile();
  } else {
    // Windows以外
    // ChromeのNative Messagingに登録されているレジストリを取得
    logger.log("Windows以外のプラットフォームは現在サポートされていません。");
  }
}

export default configureNativeMessaging;
