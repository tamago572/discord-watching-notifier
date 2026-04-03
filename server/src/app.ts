import net from "net";
import fs from "fs";

interface Config {
  clientId: string;
}

const config: Config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

console.log(config);


// \\.\pipe\discord-ipc-0へ
const client = net.createConnection("\\\\.\\pipe\\discord-ipc-0", () => {
  console.log("Connected to discord client.");

  const handshake = {
    v: 1,
    client_id: config.clientId,
  }
  client.write(JSON.stringify(handshake));
})

client.on("data", (data) => {
  console.log("Received data from discord client:", data.toString());
});

client.on("error", (err) => {
  console.error("Error connecting to discord client:", err);
})

client.on("end", () => {
  console.log("Disconnected from discord client.");
})
