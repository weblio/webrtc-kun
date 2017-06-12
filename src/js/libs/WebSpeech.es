/**
 * Web Speech API
 * ブラウザ対応状況を吸収
 * @see https://developer.mozilla.org/ja/docs/Web/API/Web_Speech_API
 */
export const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
export const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
export const isSupported = ((SpeechRecognition !== undefined) && (SpeechGrammarList !== undefined) && (SpeechRecognitionEvent !== undefined));
