import type { MessageType } from '../shared/types';

// 存储当前状态
let currentState = {
  currentLyric: '',
  repeatCount: 0,
  isLearning: false
};

// 存储设置
let currentSettings = {
  repeatTimes: 3
};

// 处理来自 popup 和 content script 的消息
chrome.runtime.onMessage.addListener((message: MessageType, sender, sendResponse) => {
  if (message.type === 'GET_STATE') {
    // 从 content script 获取最新状态
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_STATE' }, (response) => {
          if (response && response.type === 'STATE_RESPONSE') {
            currentState = response.state;
          }
          sendResponse(response);
        });
        return true; // 异步响应
      }
    });
    return true;
  }

  if (message.type === 'UPDATE_SETTINGS') {
    currentSettings = { ...currentSettings, ...message.settings };
    // 广播给所有 content script
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, message);
        }
      });
    });
  }

  if (message.type === 'STATE_RESPONSE') {
    currentState = message.state;
  }

  if (message.type === 'GET_SETTINGS') {
    sendResponse({ type: 'SETTINGS_RESPONSE', settings: currentSettings });
  }
});
