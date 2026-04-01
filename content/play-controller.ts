export class PlayController {
  private lastActionTime: number = 0;
  private debounceMs: number = 500;

  constructor(debounceMs: number = 500) {
    this.debounceMs = debounceMs;
  }

  canPerformAction(): boolean {
    const now = Date.now();
    if (now - this.lastActionTime < this.debounceMs) {
      return false;
    }
    this.lastActionTime = now;
    return true;
  }

  goToPreviousLine(): boolean {
    if (!this.canPerformAction()) return false;

    // 查找 QQ 音乐的"上一句"按钮
    const prevButton = document.querySelector('[class*="player"] [class*="prev"], [class*="lyric"] [class*="prev"]');
    if (prevButton instanceof HTMLElement) {
      prevButton.click();
      return true;
    }
    return false;
  }

  goToNextLine(): boolean {
    if (!this.canPerformAction()) return false;

    // 查找 QQ 音乐的"下一句"按钮
    const nextButton = document.querySelector('[class*="player"] [class*="next"], [class*="lyric"] [class*="next"]');
    if (nextButton instanceof HTMLElement) {
      nextButton.click();
      return true;
    }
    return false;
  }

  // 尝试通过键盘事件控制
  simulateKeyboardControl(key: 'ArrowLeft' | 'ArrowRight'): boolean {
    if (!this.canPerformAction()) return false;

    const event = new KeyboardEvent('keydown', {
      key,
      code: key === 'ArrowLeft' ? 'ArrowLeft' : 'ArrowRight',
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
    return true;
  }
}
