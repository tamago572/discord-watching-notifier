import type { PageMatchedMessage } from "../types/NMProps"

// このページが matches に入ったので、URL と title を background に渡す。
const message: PageMatchedMessage = {
	type: "PAGE_MATCHED",
	url: window.location.href,
	title: document.title,
}

// content script からは native messaging を直接呼べないので、service worker に中継する。
chrome.runtime.sendMessage(message, (response) => {
	if (chrome.runtime.lastError) {
		console.error("[Discord Watching Notifier] Failed to notify background:", chrome.runtime.lastError.message)
		return
	}

	console.log("[Discord Watching Notifier] Background response:", response)
})

