import net from "net";
import encoder from "./encoder.js";

const setActivity = (client: net.Socket) => {
  const activity = {
    "cmd": "SET_ACTIVITY",
    "args": {
      "pid": process.pid,
      "activity": {
        "name": "RPC API開発のテスト",
        "type": 5,
        "state": "これはステータス",
        "state_url": "https://blog.bunbunapp.dev",
        "details": "これは詳細部分",
        "details_url": "https://blog.bunbunapp.dev/posts",
        "timestamps": {
          "start": Date.now(),
          // "end": Date.now() + (60 * 5 + 23) * 1000 // endにするとカウントダウンになる
        },

      }
    },
    "nonce": Date.now().toString(), // アクティビティを識別するための文字列。ランダムにする
  }

  client.write(encoder(activity, 1));

}

export default setActivity;
