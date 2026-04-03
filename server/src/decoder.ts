// 先頭に余計な8byteがるのでそれを削除してからJSON.parseする
const decoder = (data: Buffer) => {
  return JSON.parse(data.toString("utf-8", 8));
}

export default decoder;
