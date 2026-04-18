# discord-watching-notifier

ブラウザで視聴中のアニメ・映画などをDiscordのアクティビティに表示します。

Chrome拡張機能とDiscordとの仲介役のアプリケーションによって実現しています。

現時点ではWindows環境のDiscordクライアントかつ、dアニメストアでのみ使用が可能です。

Google Chrome以外をご利用の方は後述するセクションもご覧ください。

## Get Started

### 1. ClientIDの生成

Discord Developer Portalにログインします。

アプリを作成し、ClientIDをコピーしておきます。

### 2. 仲介ソフトのダウンロード・設定

このGitHubのReleasesから仲介ソフトをダウンロードします。

一度exeファイルを起動し、さきほどコピーしたClientIDを貼り付けてEnterを押します。

入力を間違った場合など、ClientIDを編集する際は`config.json`を編集します。

```JSON
{
  "clientId": "000000000000000000000"
}
```

### 3. Chrome拡張機能の導入・設定

Chromeウェブストアから、discord-watching-notifierを導入します。

拡張機能をクリックし、設定画面から仲介ソフトのファイルパスを設定します。

## Google Chrome以外をご利用の方へ

`DiscordWatchingNotifier.exe`には、拡張機能から情報を受信するための設定を自動で行う機能がありますが、Google Chrome以外の実装はしていません。

そのため、Google Chrome以外のChromium系ブラウザをお使いの場合は、手動でレジストリを編集することで使用が可能です。（※Firefox系・Safari等は対応していません。）

各ブラウザに対応するNative Messaging Hostsのレジストリパスに、`dev.bunbunapp.discord_watching_notifier`キーを作成し、`DiscordWatchingNotifier.exe`のファイルパスを値として設定してください。

詳細は各ブラウザのNative Messaging APIに関するドキュメントを参照してください。

また、`DiscordWatchingNotifier.exe`はGoogle Chromeのレジストリを書き換えるよう実装されていますのでご留意ください。

exeファイルの移動時には手動で再登録する必要があります。

## Uninstall

Chrome拡張機能とDiscordWatchingNotifier.exeを削除することで、アンイストールが完了します。

動作には問題ありませんが、完全に抹消するにはレジストリキー`\HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\dev.bunbunapp.discord_watching_notifier`を削除してください。


## 使用技術

### 仲介ソフト

- Node.js
- TypeScript
- netモジュール（IPC通信用）
- nexe

### Chrome拡張機能

- TypeScript
- React
- Vite
- crxjs
- Native Messaging API

### CI/CD

- GitHub Actions

## リリースについて

GitHub ActionsによるCI/CDパイプラインを構築しています。

mainブランチにpushすると、自動でテストとビルドがされ、自動的に新しいバージョンがリリースされます。

バージョンの命名規則は1.n.0となっており、リリースごとにn=n+1されます。

## ディレクトリ構造

- chromeExt/    ・・・Chrome拡張機能です。
  - src/        ・・・ここがソースコードです
  - public/     ・・・静的ファイルが入っています
  - dist/       ・・・ビルド後のソースコードです
  - release/    ・・・成果物です
- server/       ・・・仲介ソフトです。
  - src/        ・・・ここがソースコードです
  - dist/       ・・・ビルド後のソースコードです。開発時はこのフォルダーをChromeに読み込みます。
