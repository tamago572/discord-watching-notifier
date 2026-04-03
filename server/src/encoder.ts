// DiscordにIPCを送るとき、ヘッダーにいろいろつけないといけないっぽい
/**
 *
 * @param json 送信するJSONをObjectで
 * @param opcode DiscordにIPCするとき、ヘッダーにつけないといけないopcode。0ならhandshake, 1ならframe(activityの更新のとき), 3は終了時, 4はping, 5はpong
 * @returns
 */
const encoder = (json: object, opcode: number) => {
  const jsonStr = JSON.stringify(json);
  const byteLength = Buffer.byteLength(jsonStr);
  const buffer = Buffer.alloc(8 + byteLength);
  buffer.writeUInt32LE(opcode, 0);
  buffer.writeUInt32LE(byteLength, 4);
  buffer.write(jsonStr, 8);

  return buffer;
}

export default encoder;
