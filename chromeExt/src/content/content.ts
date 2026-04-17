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
		watchingSitesStatus.title = document.querySelectorAll(".backInfoTxt1")[0].textContent || "";
		watchingSitesStatus.description = `${document.querySelectorAll(".backInfoTxt2")[0].textContent || ""} ${document.querySelectorAll(".backInfoTxt3")[0].textContent || ""}`;
		break;
	case "https://www.amazon.co.jp/gp/video/detail":
		watchingSitesStatus.url = "https://www.amazon.co.jp/";
		// TODO: Amazon Prime VideoのHTML構造から取得する処理を書く

		break;
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
chrome.runtime.sendMessage(message, (response) => {
	if (chrome.runtime.lastError) {
		console.error("[Discord Watching Notifier] Failed to notify background:", chrome.runtime.lastError.message)
		return
	}

	console.log("[Discord Watching Notifier] Background response:", response)
})

