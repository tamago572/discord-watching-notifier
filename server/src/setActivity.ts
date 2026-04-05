import net from "net";
import encoder from "./encoder.js";

interface Activity {
  name: string;
  state: string;
}

const setActivity = (client: net.Socket, activityData: Activity) => {
  const activity = {
    "cmd": "SET_ACTIVITY",
    "args": {
      "pid": process.pid,
      "activity": {
        "name": activityData.name,
        "type": 5,
        "url": "https://blog.bunbunapp.dev",
        "state": activityData.state,
        "state_url": "https://blog.bunbunapp.dev",
        "details": activityData.name,
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
