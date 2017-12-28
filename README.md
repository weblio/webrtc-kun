WebRTC-kun
===

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/weblio/webrtc-kun/blob/master/LICENSE)
<a href="https://david-dm.org/weblio/webrtc-kun"><img src="https://david-dm.org/weblio/webrtc-kun.svg" alt="Dependency Status"></a>
<a href="https://david-dm.org/weblio/webrtc-kun/?type=dev"><img src="https://david-dm.org/weblio/webrtc-kun/dev-status.svg" alt="devDependency Status"></a>
* [English](README.md)
* [日本語](README.ja.md)

## Summary
[MediaStream](https://developer.mozilla.org/en/docs/Web/API/MediaStream) and [WebRTC](https://webrtc.org/) test tool.

## System Requirements
|OS|Node.js|npm|
|---|---|---|
|Microsoft Windows 10 Professional Build 1607|4.4.7|4.6.1|
|macOS 10.12 (Sierra)|7.7.4|4.6.1|
|Ubuntu 16.04 (Xenial Xerus)|4.2.6|3.5.2|

### Browser
* [Google Chrome](https://www.google.com/chrome/) (latest version)
* [Mozilla Firefox](https://www.mozilla.org/en/firefox/) (latest version)

## Setup
1. Register via [SkyWay](https://webrtc.ecl.ntt.com/en/signup.html) （e-mail address required）
2. After login, register an API key from the [SkyWay Dashboard](https://skyway.io/ds/)
    * Specify `localhost` under usable domains
3. Paste your registered API key under `key` in [config.es](./src/js/config.es)

## Build
```bash
$ npm update
$ npm run build
```
HTML/CSS/JS will be output under `dist`.
```
dist
├index.html         HTML file
├index.bundle.html  HTML file (bundle version, including all CSS/JS)
├css                CSS file
│└style.css
└js                 JavaScript file
 └script.min.js
```

## Run
```bash
$ npm start
```
Server will be started on your localhost.  
==> Access at [http://localhost:8000/](http://localhost:8000/)
