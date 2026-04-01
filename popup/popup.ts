import type { LyricState, Settings, MessageType } from '../shared/types';

const $ = (id: string) => document.getElementById(id);

const statusEl = $('status') as HTMLElement;
if (!statusEl) throw new Error('status element not found');
const lyricEl = $('lyric') as HTMLElement;
if (!lyricEl) throw new Error('lyric element not found');
const countEl = $('count') as HTMLElement;
if (!countEl) throw new Error('count element not found');
const repeatTimesEl = $('repeat-times') as HTMLElement;
if (!repeatTimesEl) throw new Error('repeat-times element not found');
const decreaseBtn = $('decrease') as HTMLButtonElement;
if (!decreaseBtn) throw new Error('decrease button not found');
const increaseBtn = $('increase') as HTMLButtonElement;
if (!increaseBtn) throw new Error('increase button not found');

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