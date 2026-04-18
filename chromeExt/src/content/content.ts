import type { PageMatchedMessage } from "../types/NMProps"
import type WatchingSiteStatus from "../types/watchingSitesStatus";

const url: string = window.location.origin + window.location.pathname;
const watchingSitesStatus: WatchingSiteStatus = {
	title: "",
	description: "",
	url: "",
}

switch (url) {
	case "https://animestore.docomo.ne.jp/animestore/sc_d_pc":
		watchingSitesStatus.url = "https://animestore.docomo.ne.jp/";
		watchingSitesStatus.title = document.querySelectorAll(".backInfoTxt1")[0].textContent || "アニメを視聴中";
		watchingSitesStatus.description = `${document.querySelectorAll(".backInfoTxt2")[0].textContent || ""} ${document.querySelectorAll(".backInfoTxt3")[0].textContent || ""}`;
		break;
	// case "https://www.amazon.co.jp/gp/video/detail":
	// 	watchingSitesStatus.url = "https://www.amazon.co.jp/";
		// TODO: Amazon Prime VideoのHTML構造から取得する処理を書く

		// break;
	default:
		break;
}

// このページが matches に入ったので、URL と title を background に渡す。
const message: PageMatchedMessage = {
	type: "PAGE_MATCHED",
	...watchingSitesStatus,
}

console.log("[Discord Watching Notifier] Page matched:", message.url, message.title);

// content script からは native messaging を直接呼べないので、service worker に中継する。
// タブが閉じられることを監視したいため、Service WorkerとContent Scriptをつなぐポートを作る。
// ポートはページ遷移やタブ閉じで切断されるため、それで検知する
const backgroundPort = chrome.runtime.connect({ name: "watching-page" });
backgroundPort.postMessage(message);
console.log("[Discord Watching Notifier] Sent message to background:", message.url, message.title);


