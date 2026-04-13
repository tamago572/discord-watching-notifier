// Content script から background への通知メッセージ型
export type PageMatchedMessage = {
  type: "PAGE_MATCHED"
  url: string
  title: string
  description: string
}

// Native messaging の送信ペイロード型
export type NativeMessagingPayload = {
  action?: "set" | "shutdown"
  title?: string
  description?: string
  url?: string
}

// Native messaging のレスポンス型
export type NativeMessagingResponse = {
  ok?: boolean
  response?: unknown
  error?: string
}
