import type { PageMatchedMessage } from "../types/NMProps"

// このページが matches に入ったので、URL と title を background に渡す。
const message: PageMatchedMessage = {
	type: "PAGE_MATCHED",
	url: "https://animestore.docomo.ne.jp/",
	// アニメタイトル
	title: document.querySelectorAll(".backInfoTxt1")[0].textContent || "",
	// EP01 話タイトル
	description: `${document.querySelectorAll(".backInfoTxt2")[0].textContent || ""} ${document.querySelectorAll(".backInfoTxt3")[0].textContent || ""}`
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

