export type LyricChangeCallback = (lyric: string) => void;

export class LyricDetector {
  private observer: MutationObserver | null = null;
  private lastLyric: string = '';
  private callback: LyricChangeCallback | null = null;

  start(callback: LyricChangeCallback): void {
    this.callback = callback;

    // 查找歌词容器
    const lyricContainer = this.findLyricContainer();
    if (!lyricContainer) {
      console.log('[LyricDetector] 未找到歌词容器');
      return;
    }

    // 监听 DOM 变化
    this.observer = new MutationObserver(() => {
      const currentLyric = this.extractCurrentLyric();
      if (currentLyric && currentLyric !== this.lastLyric) {
        this.lastLyric = currentLyric;
        this.callback?.(currentLyric);
      }
    });

    this.observer.observe(lyricContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // 初始检测
    const initialLyric = this.extractCurrentLyric();
    if (initialLyric) {
      this.lastLyric = initialLyric;
      this.callback?.(initialLyric);
    }
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private findLyricContainer(): Element | null {
    // QQ 音乐歌词容器的可能选择器
    const selectors = [
      '[class*="lyric"]',
      '[class*="lyrics"]',
      '[class*="karaoke"]',
      '#lyric_content',
      '.song-lyric'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    return null;
  }

  private extractCurrentLyric(): string {
    // 查找当前播放的歌词行
    const activeSelector = [
      '[class*="lyric"] [class*="active"]',
      '[class*="lyric"] [class*="current"]',
      '[class*="lyric"] [class*="playing"]',
      '[class*="lyric-line"][class*="active"]',
      '.lyric-line.active',
      '[class*="current-lyric"]'
    ];

    for (const selector of activeSelector) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent?.trim();
        if (text) return text;
      }
    }

    // 如果没找到 active，尝试获取第一个可见的歌词行
    const lyricLines = document.querySelectorAll('[class*="lyric-line"], [class*="lyric"] span');
    for (const line of lyricLines) {
      const text = line.textContent?.trim();
      if (text && text.length > 0) {
        return text;
      }
    }

    return '';
  }
}
