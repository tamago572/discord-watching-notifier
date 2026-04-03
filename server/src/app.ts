import net from "net";
import configLoader from "./configLoader.js";
import encoder from "./encoder.js";
import decoder from "./decoder.js";
import setActivity from "./setActivity.js";

const config = configLoader();
console.log("Loaded config");


console.log(config);

// \\.\pipe\discord-ipc-0へ
const client = net.createConnection("\\\\.\\pipe\\discord-ipc-0", () => {
  console.log("Connected to discord client.");

  const handshake = {
    v: 1,
    client_id: config.clientId,
  }
  client.write(encoder(handshake, 0));
})

client.on("data", (data) => {
  if (!Buffer.isBuffer(data)) return;
  const res = decoder(data);

  console.log("Received data from discord client:", res);

  if (res.evt == "READY") {
    console.log("readyです");

    setActivity(client);
  }
});

client.on("error", (err) => {
  console.error("Error connecting to discord client:", err);
})

client.on("end", () => {
  console.log("Disconnected from discord client.");
})
