import net from "net";
import configLoader from "./configLoader.js";
import encoder from "./encoder.js";
import decoder from "./decoder.js";
import setActivity from "./setActivity.js";
import logger from "./logger.js";
import configureNativeMessaging from "./configureNativeMssaging.js";

const configPromise = configLoader();
logger.log("Config loaded successfully.");

const activityName = process.argv[2] || "アクティビティ名を取得できませんでした";
const activityState = process.argv[3] || "ステータスを取得できませんでした";

logger.log(`Activity Name: ${activityName}`);

configureNativeMessaging();

// \\.\pipe\discord-ipc-0へ
const client = net.createConnection("\\\\.\\pipe\\discord-ipc-0", async () => {
  logger.log("Connected to discord client.");
  const config = await configPromise;

  const handshake = {
    v: 1,
    client_id: config.clientId,
  }
  client.write(encoder(handshake, 0));
})

client.on("data", (data) => {
  if (!Buffer.isBuffer(data)) return;
  const res = decoder(data);

  logger.log(`Received data from discord client: ${JSON.stringify(res)}`);

  if (res.evt == "READY") {
    logger.log("readyです");

    setActivity(client, {
      name: activityName,
      state: activityState,
    });
  }
});

client.on("error", (err) => {
  logger.log(`Error: ${err.message}`);
})

client.on("end", () => {
  logger.log("Disconnected from discord client.");
})
