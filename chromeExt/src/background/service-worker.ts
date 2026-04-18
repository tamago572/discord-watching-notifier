import type { PageMatchedMessage, NativeMessagingPayload } from "../types/NMProps"

const NATIVE_HOST_NAME = "dev.bunbunapp.discord_watching_notifier"
const connectedContentPorts = new Set<chrome.runtime.Port>()
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

const disconnectNativeIfNoContentPorts = () => {
  if (connectedContentPorts.size !== 0) {
    return
  }

  nativePort?.disconnect()
  nativePort = null
}

// Content Script からの拡張機能内ポート接続を受け付ける。
chrome.runtime.onConnect.addListener((port) => {
  console.log("[Discord Watching Notifier] Received connection on port:", port.name);

  if (port.name !== "watching-page") {
    return
  }

  connectedContentPorts.add(port)

  // タブのクローズやページ遷移で content script 側ポートが切断される。
  // ここで監視しているのは拡張機能内ポートで、Native Messaging ポートではない。
  port.onDisconnect.addListener(() => {
    connectedContentPorts.delete(port)
    disconnectNativeIfNoContentPorts()
  })

  // 一致ページから届いたメッセージを Native Messaging 側へ転送する。
  port.onMessage.addListener((message: PageMatchedMessage) => {
    console.log("[Discord Watching Notifier] Received message on port:", port.name, message);
    if (message.type !== "PAGE_MATCHED") {
      return
    }

    try {
      const payload: NativeMessagingPayload = {
        action: "set",
        title: message.title,
        description: message.description,
        url: message.url,
      }
      postNativeMessage(payload)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("[Discord Watching Notifier] Native messaging failed:", errorMessage)
    }
  })
})
