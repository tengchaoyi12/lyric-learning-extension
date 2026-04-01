import type { LyricState, Settings, MessageType } from '../shared/types';

const $ = (id: string) => document.getElementById(id);

const statusEl = $('status');
const lyricEl = $('lyric');
const countEl = $('count');
const repeatTimesEl = $('repeat-times');
const decreaseBtn = $('decrease') as HTMLButtonElement;
const increaseBtn = $('increase') as HTMLButtonElement;

let currentRepeatTimes = 3;

function updateUI(state: LyricState) {
  statusEl.textContent = state.isLearning ? '正在学习' : '未在学习';
  lyricEl.textContent = state.currentLyric || '-';
  countEl.textContent = `${state.repeatCount}/${currentRepeatTimes} 遍`;
}

function updateRepeatButtons() {
  decreaseBtn.disabled = currentRepeatTimes <= 1;
  increaseBtn.disabled = currentRepeatTimes >= 10;
  repeatTimesEl.textContent = String(currentRepeatTimes);
}

function sendMessage(message: MessageType) {
  chrome.runtime.sendMessage(message);
}

decreaseBtn.addEventListener('click', () => {
  if (currentRepeatTimes > 1) {
    currentRepeatTimes--;
    updateRepeatButtons();
    sendMessage({ type: 'UPDATE_SETTINGS', settings: { repeatTimes: currentRepeatTimes } });
  }
});

increaseBtn.addEventListener('click', () => {
  if (currentRepeatTimes < 10) {
    currentRepeatTimes++;
    updateRepeatButtons();
    sendMessage({ type: 'UPDATE_SETTINGS', settings: { repeatTimes: currentRepeatTimes } });
  }
});

chrome.runtime.onMessage.addListener((message: MessageType) => {
  if (message.type === 'STATE_RESPONSE') {
    updateUI(message.state);
  } else if (message.type === 'SETTINGS_RESPONSE') {
    currentRepeatTimes = message.settings.repeatTimes;
    updateRepeatButtons();
  }
});

sendMessage({ type: 'GET_SETTINGS' });
sendMessage({ type: 'GET_STATE' });