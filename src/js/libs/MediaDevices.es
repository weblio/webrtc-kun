/**
 * Media Devices API
 * ブラウザ対応状況を吸収
 * @see https://developer.mozilla.org/ja/docs/Web/API/MediaDevices
 */
const METHODS = {
    getUserMedia: ["getUserMedia", "webkitGetUserMedia", "mozGetUserMedia", "msGetUserMedia"],
};

export {getUserMedia, enumerateDevices};
export const isSupported = _isSupported();

/**
 * カメラ／マイクのストリームを取得
 * @param {MediaStreamConstraints} constraints パラメータ
 * @return {Promise.<MediaStream>} ストリーム
 */
function getUserMedia(constraints) {
    const navigator = window.navigator;

    if (navigator.mediaDevices !== undefined && navigator.mediaDevices.getUserMedia !== undefined) {
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    return new Promise(function (resolve, reject) {
        // for ofを使ったらIE11/Operaでエラーが出た（Symbol.iteratorが未定義？）
        for (let i = 0; i < METHODS.getUserMedia.length; i++) {
            const method = METHODS.getUserMedia[i];
            if (navigator[method] !== undefined) {
                navigator[method](constraints, resolve, reject);
                return;
            }
        }
        reject(new Error("getUserMedia not found"));
    });
}

/**
 * 使用可能デバイスを列挙
 * @return {Promise.<{deviceId: string, groupId: string, kind: string, label: string}[]>} デバイス情報
 */
function enumerateDevices() {
    const navigator = window.navigator;

    if (navigator.mediaDevices === undefined) {
        return Promise.reject("No mediaDevices");
    }

    return navigator.mediaDevices.enumerateDevices();
}

/**
 * ブラウザがサポートしているか？
 * @return {boolean} Yes/No
 * @private
 */
function _isSupported() {
    const navigator = window.navigator;

    if (navigator.mediaDevices !== undefined && navigator.mediaDevices.getUserMedia !== undefined) {
        return true;
    }

    for (let i = 0; i < METHODS.getUserMedia.length; i++) {
        const method = METHODS.getUserMedia[i];
        if (navigator[method] !== undefined) {
            return true;
        }
    }
    return false;
}
