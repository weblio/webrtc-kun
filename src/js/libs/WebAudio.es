/**
 * Web Audio API
 * ブラウザ対応状況を吸収
 * @see https://developer.mozilla.org/ja/docs/Web/API/AudioContext
 */
export const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
export const isSupported = (AudioContext !== undefined);
