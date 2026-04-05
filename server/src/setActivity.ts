import net from "net";
import encoder from "./encoder.js";

interface Activity {
  name: string;
  state: string;
  url?: string;
}

const setActivity = (client: net.Socket, activityData: Activity) => {
  const activity = {
    "cmd": "SET_ACTIVITY",
    "args": {
      "pid": process.pid,
      "activity": {
        "name": activityData.name,
        "type": 5,
        "url": activityData.url,
        "state": activityData.state,
        "state_url": activityData.url,
        "details": activityData.name,
        "details_url": activityData.url,
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
