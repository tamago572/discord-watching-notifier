import type { PageMatchedMessage } from "../types/NMProps"
import type WatchingSiteStatus from "../types/watchingSitesStatus";

const url: string = window.location.origin + window.location.pathname;
const watchingSitesStatus: WatchingSiteStatus = {
	title: "",
	description: "",
	url: "",
}

const sendToBackground = () => {
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
}

switch (url) {
	case "https://animestore.docomo.ne.jp/animestore/sc_d_pc":
		// 少し待ってから実行しないと取得できなかった。多分描画されてない
		setTimeout(() => {
			watchingSitesStatus.url = "https://animestore.docomo.ne.jp/";
			watchingSitesStatus.title = document.querySelector(".backInfoTxt1")?.textContent || "アニメを視聴中";
			watchingSitesStatus.description = `${document.querySelector(".backInfoTxt2")?.textContent || "詳細情報"} ${document.querySelector(".backInfoTxt3")?.textContent || "不明"}`;
			sendToBackground();
		}, 1000);

		break;
	// case "https://www.amazon.co.jp/gp/video/detail":
	// 	watchingSitesStatus.url = "https://www.amazon.co.jp/";
		// TODO: Amazon Prime VideoのHTML構造から取得する処理を書く

		// break;
	default:
		break;
}
