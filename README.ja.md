WebRTCくん
===

* [English](README.md)
* [日本語](README.ja.md)

## 概要
[MediaStream](https://developer.mozilla.org/ja/docs/Web/API/MediaStream) および[WebRTC](https://webrtc.org/)の動作チェック

## 動作環境
|OS|Node.js|npm|
|---|---|---|
|Microsoft Windows 10 Professional Build 1607|4.4.7|4.6.1|
|macOS 10.12 (Sierra)|7.7.4|4.6.1|
|Ubuntu 16.04 (Xenial Xerus)|4.2.6|3.5.2|

### ブラウザ
* [Google Chrome](https://www.google.com/chrome/) 最新版
* [Mozilla Firefox](https://www.mozilla.org/ja/firefox/) 最新版

## 準備
1. [SkyWayのページ](https://nttcom.github.io/skyway/index.html)から開発者登録（メールアドレスが必要）
1. ログイン後、[SkyWayダッシュボード](https://skyway.io/ds/)からAPIキーを登録
    * 利用可能ドメインに `localhost` を指定
1. 登録したAPIキーを[config.es](./src/js/config.es)の `key` に貼り付け

## ビルド方法
```bash
$ npm update
$ npm run build
```
`dist` 以下にHTML/CSS/JSが出力される。
```
dist
├index.html         HTMLファイル
├index.bundle.html  HTMLファイル（CSSもJSも全部入りバージョン）
├css                CSSファイル
│└style.css
└js                 JavaScriptファイル
 └script.min.js
```

## 実行
```bash
$ npm start
```
ローカルホストにサーバが立ち上がる。
[http://localhost:8000/](http://localhost:8000/) で動作確認。
