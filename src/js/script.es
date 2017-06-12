import $ from "jquery";
import config from "./config.es";
import {isSupported, getUserMedia, enumerateDevices} from "./libs/MediaDevices.es";
import Peer from 'skyway-peerjs';

$(($) => {
    if (!isSupported) {
        // 非対応ブラウザ
        $("#error").show();
    }

    setDevicesInfo().then(() => {
        resetVideo();
    });

    $(document)
        .on("change", "#audioinput,#videoinput", function () {
            resetVideo();
        })
        .on("change", "#audiooutput", function () {
            const sinkId = $(this).val();
            const video = document.getElementById("video");
            if (video.setSinkId !== undefined) {
                video.setSinkId(sinkId);
            }
        });
});

/**
 * デバイス情報を取得＆選択一覧に追加
 * @return {Promise.<>}
 */
function setDevicesInfo() {
    return getUserMedia({audio: true, video: true})
        .then(() => {
            return enumerateDevices();
        })
        .then((devices) => {
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
        })
        .catch(errorHandler);
}

/**
 * ストリームを再作成＆videoタグに設定
 */
function resetVideo() {
    let peer1 = null, peer2 = null;
    let call = null;
    let streamUrl = null;

    const constraints = getConstraints();
    getUserMedia(constraints)
        .then((myStream) => {
            console.log("created");
            // 既存オブジェクトを破棄
            if (peer1 !== null) {
                peer1.destroy();
                peer1 = null;
            }
            if (peer2 !== null) {
                peer2.destroy();
                peer2 = null;
            }
            if (call !== null) {
                call.close();
                call = null;
            }
            if (streamUrl !== null) {
                URL.revokeObjectURL(streamUrl);
                streamUrl = null;
            }

            // 送り側
            peer1 = new Peer(config);

            // 受け側
            peer2 = new Peer(config);
            peer2
                .on("open", (id) => {
                    console.log("sending...");
                    call = peer1.call(id, myStream);
                })
                .on("call", (call) => {
                    call.answer();
                    call
                        .on("stream", (peerStream) => {
                            console.log("received");
                            streamUrl = URL.createObjectURL(peerStream);
                            $("#video").attr("src", streamUrl);
                        });
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
