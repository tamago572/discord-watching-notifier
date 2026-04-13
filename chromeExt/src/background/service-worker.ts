import type { PageMatchedMessage, NativeMessagingPayload } from "../types/NMProps"

const NATIVE_HOST_NAME = "dev.bunbunapp.discord_watching_notifier"
const matchedTabIds = new Set<number>()
let nativePort: chrome.runtime.Port | null = null

const ensureNativePort = () => {
  if (nativePort) {
    return nativePort
  }

  nativePort = chrome.runtime.connectNative(NATIVE_HOST_NAME)
  nativePort.onDisconnect.addListener(() => {
    const errorMessage = chrome.runtime.lastError?.message
    if (errorMessage) {
      console.error("[Discord Watching Notifier] Native port disconnected:", errorMessage)
    }
    nativePort = null
  })

  return nativePort
}

const postNativeMessage = (payload: NativeMessagingPayload) => {
  try {
    ensureNativePort().postMessage(payload)
    return
  } catch {
    nativePort = null
  }

  // ポートが切れていた場合のみ1回だけ再接続して再送する。
  ensureNativePort().postMessage(payload)
}

chrome.tabs.onRemoved.addListener((tabId) => {
  if (!matchedTabIds.has(tabId)) {
    return
  }

  matchedTabIds.delete(tabId)

  if (matchedTabIds.size !== 0) {
    return
  }

  nativePort?.disconnect()
  nativePort = null
})

// ページ一致通知を受けたら、native host に URL と title を送る。
chrome.runtime.onMessage.addListener((message: PageMatchedMessage, sender, sendResponse) => {
  if (message.type !== "PAGE_MATCHED") {
    return false
  }

  if (sender.tab?.id !== undefined) {
    matchedTabIds.add(sender.tab.id)
  }

  try {
    // レジストリ登録後にこの host 名で外部アプリへ渡す。
    const payload: NativeMessagingPayload = {
      action: "set",
      title: message.title,
      description: message.description,
      url: message.url,
    }
    postNativeMessage(payload)
    sendResponse({ ok: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[Discord Watching Notifier] Native messaging failed:", errorMessage)
    sendResponse({ ok: false, error: errorMessage })
  }

  return false
})
