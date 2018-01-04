import $ from "jquery";
import config from "./config.es";
import {isSupported, getUserMedia, enumerateDevices} from "./libs/MediaDevices.es";
import Peer from "skyway-js";

const AUDIO_BANDWIDTH = 500;

let peer1 = null;
let peer2 = null;
let peer2id = null;

let call = null;
let streamUrl = null;

$(($) => {
    if (!isSupported) {
        // 非対応ブラウザ
        $("#error").show();
    }

    setDevicesInfo().then(() => {
        initializePeersFirstCall();
    });

    $(document)
        .on("change", "#audioinput,#videoinput", function () {
            makeNewCall();
        })
        .on("change", "#audiooutput", function () {
            const sinkId = $(this).val();
            const video = document.getElementById("video");
            if (video.setSinkId !== undefined) {
                video.setSinkId(sinkId);
            }
        })
        .on("change", "#videoBandwidth", function () {
            makeNewCall();
        });
});

/**
 * デバイス情報を取得＆選択一覧に追加
 * @return {Promise.<Object>}
 */
function setDevicesInfo() {
    return enumerateDevices().then((devices) => {
        const selected = {};
        for (const device of devices) {
            const kind = device.kind;
            const $option = $("<option>", {
                value: device.deviceId,
                text: device.label || "(unpermitted device)",
                selected: (selected[kind] === undefined),
            });
            $("#" + kind).append($option);
            selected[kind] = true;
        }

        // ビデオの最後に無効化オプションを追加
        const kind = "videoinput";
        const $option = $("<option>", {
            value: "",
            text: "(disable camera)",
            selected: (selected[kind] === undefined),
        });
        $("#" + kind).append($option);
        return devices;
    });
}

/**
 * Peerを初期化して、最初のコールを行う
 */
function initializePeersFirstCall() {
    // 受け側
    peer2 = new Peer(config);

    peer2
        .on("call", (call) => {
            call.answer(null, {
                audioBandwidth: AUDIO_BANDWIDTH, // max audio bandwidth (kbps)
                videoBandwidth: Number($("#videoBandwidth").val()), // max video bandwidth (kbps)
            });
            call
                .on("stream", (peerStream) => {
                    console.log("received stream");
                    // videoタグに設定
                    streamUrl = URL.createObjectURL(peerStream);
                    $("#video").attr("src", streamUrl);
                });
        });
    peer2
        .on("open", (p2id) => {
            peer2id = p2id;

            // 送り側
            peer1 = new Peer(config);

            peer1
                .on("open", (p1id) => {
                    makeNewCall();
                });
        });
}

/**
 * ストリームを再作成して、新しくコールする
 */
function makeNewCall() {
    const constraints = getConstraints();
    getUserMedia(constraints)
        .then((myStream) => {
            console.log("created");

            // 既存オブジェクトを破棄
            if (call !== null) {
                call.close();
                call = null;
            }
            if (streamUrl !== null) {
                URL.revokeObjectURL(streamUrl);
                streamUrl = null;
            }

            console.log("sending stream...");
            call = peer1.call(peer2id, myStream, {
                audioBandwidth: AUDIO_BANDWIDTH, // max audio bandwidth (kbps)
                videoBandwidth: Number($("#videoBandwidth").val()), // max video bandwidth (kbps)
            });
        })
        .catch(errorHandler);
}

/**
 * メディアストリームオプションを取得
 * @return {MediaStreamConstraints} オプション
 */
function getConstraints() {
    const constraints = {};
    const audioId = $("#audioinput").val();
    const videoId = $("#videoinput").val();
    if (audioId !== null) {
        constraints.audio = {
            deviceId: audioId,
            echoCancellation: false,
        };
    }
    if (videoId !== null && videoId !== "") {
        constraints.video = {
            deviceId: videoId,
        };
    }
    return constraints;
}

/**
 * エラー処理
 * @param {Error} error エラーオブジェクト
 */
function errorHandler(err) {
    window.alert(`${err.name}: ${err.message}\n\n${window.navigator.userAgent}`);
}
