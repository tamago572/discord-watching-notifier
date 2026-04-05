import type { PageMatchedMessage, NativeMessagingPayload } from "../types/NMProps"

const NATIVE_HOST_NAME = "com.example.discord_watching_notifier"

// ページ一致通知を受けたら、native host に URL と title を送る。
chrome.runtime.onMessage.addListener((message: PageMatchedMessage, _sender, sendResponse) => {
  if (message.type !== "PAGE_MATCHED") {
    return false
  }

  void (async () => {
    try {
      // レジストリ登録後にこの host 名で外部アプリへ渡す。
      const payload: NativeMessagingPayload = {
        title: message.title,
        description: "YouTubeで動画を視聴中",
        url: message.url,
      }
      const response = await chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, payload)

      sendResponse({ ok: true, response })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("[Discord Watching Notifier] Native messaging failed:", errorMessage)
      sendResponse({ ok: false, error: errorMessage })
    }
  })()

  return true
})
