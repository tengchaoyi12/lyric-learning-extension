import { Counter } from './counter';
import { PlayController } from './play-controller';
import { LyricDetector } from './lyric-detector';
import type { MessageType } from '../shared/types';

const counter = new Counter();
const playController = new PlayController();
const lyricDetector = new LyricDetector();

// 处理歌词变化
function handleLyricChange(lyric: string): void {
  counter.setCurrentLyric(lyric);

  // 如果需要回跳重播
  if (counter.shouldAutoReplay()) {
    // 等待一小段时间确保播放器准备好
    setTimeout(() => {
      playController.goToPreviousLine();
    }, 100);
  } else if (counter.shouldAutoAdvance()) {
    // 计数已满，重置并等待下一句
    counter.reset();
  }

  // 更新状态
  notifyState();
}

// 通知状态给 popup
function notifyState(): void {
  chrome.runtime.sendMessage({
    type: 'STATE_RESPONSE',
    state: counter.getState()
  });
}

// 初始化
function init(): void {
  // 注册快捷键处理
  document.addEventListener('keydown', (e) => {
    if (!e.altKey) return;

    if (e.key === 'ArrowLeft') {
      // 手动上一句
      playController.goToPreviousLine();
      counter.reset();
      notifyState();
    } else if (e.key === 'ArrowRight') {
      // 手动下一句
      playController.goToNextLine();
      counter.reset();
      notifyState();
    } else if (e.key === 'r' || e.key === 'R') {
      // 重置计数
      counter.reset();
      notifyState();
    }
  });

  // 启动歌词检测
  lyricDetector.start(handleLyricChange);
}

// 等待页面加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message: MessageType) => {
  if (message.type === 'UPDATE_SETTINGS') {
    if (message.settings.repeatTimes !== undefined) {
      counter.setRepeatTimes(message.settings.repeatTimes);
    }
  } else if (message.type === 'GET_STATE') {
    notifyState();
  }
});
