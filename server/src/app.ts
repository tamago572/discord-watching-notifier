import net from "net";
import configLoader from "./configLoader.js";
import encoder from "./encoder.js";
import decoder from "./decoder.js";
import setActivity from "./setActivity.js";
import logger from "./logger.js";
import configureNativeMessaging from "./configureNativeMssaging.js";

type NativeMessagePayload = {
  title?: string;
  description?: string;
  url?: string;
}

const configPromise = configLoader();
logger.log("Config loaded successfully.");
logger.log(`process.argv: ${JSON.stringify(process.argv)}`);
configureNativeMessaging();

let activityName = "アクティビティ名を取得できませんでした";
let activityState = "ステータスを取得できませんでした";
let activityUrl = "";

let stdinBuffer = Buffer.alloc(0);
let discordReady = false;

const sendNativeResponse = (json: object) => {
  const body = Buffer.from(JSON.stringify(json), "utf-8");
  const header = Buffer.alloc(4);
  header.writeUInt32LE(body.length, 0);
  process.stdout.write(Buffer.concat([header, body]));
}

const applyNativePayload = (payload: NativeMessagePayload, client: net.Socket) => {
  if (payload.title) {
    activityName = payload.title;
  }
  if (payload.description) {
    activityState = payload.description;
  }
  if (payload.url) {
    activityUrl = payload.url;
  }

  logger.log(`Native message payload: ${JSON.stringify(payload)}`);
}

logger.log(`Activity Name: ${activityName}`);


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

process.stdin.on("data", (chunk: Buffer) => {
  stdinBuffer = Buffer.concat([stdinBuffer, chunk]);

  while (stdinBuffer.length >= 4) {
    const messageLength = stdinBuffer.readUInt32LE(0);

    if (stdinBuffer.length < 4 + messageLength) {
      break;
    }

    const messageBytes = stdinBuffer.subarray(4, 4 + messageLength);
    stdinBuffer = stdinBuffer.subarray(4 + messageLength);

    try {
      const payload = JSON.parse(messageBytes.toString("utf-8")) as NativeMessagePayload;
      applyNativePayload(payload, client);
      sendNativeResponse({ ok: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.log(`Failed to parse native message: ${errorMessage}`);
      sendNativeResponse({ ok: false, error: errorMessage });
    }
  }
});

process.stdin.on("error", (err) => {
  logger.log(`stdin error: ${err.message}`);
});

client.on("data", (data) => {
  if (!Buffer.isBuffer(data)) return;
  const res = decoder(data);

  logger.log(`Received data from discord client: ${JSON.stringify(res)}`);

  if (res.evt == "READY") {
    logger.log("readyです");
    discordReady = true;

    setActivity(client, {
      name: activityName,
      state: activityState,
      url: activityUrl,
    });
  }
});

client.on("error", (err) => {
  logger.log(`Error: ${err.message}`);
})

client.on("end", () => {
  logger.log("Disconnected from discord client.");
})
