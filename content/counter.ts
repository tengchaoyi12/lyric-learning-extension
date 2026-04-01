export class Counter {
  private counts: Map<string, number> = new Map();
  private repeatTimes: number = 3;
  private currentLyric: string = '';

  setRepeatTimes(times: number): void {
    this.repeatTimes = times;
  }

  getRepeatTimes(): number {
    return this.repeatTimes;
  }

  setCurrentLyric(lyric: string): void {
    if (lyric !== this.currentLyric) {
      this.currentLyric = lyric;
      this.counts.set(lyric, 0);
    }
  }

  getCurrentLyric(): string {
    return this.currentLyric;
  }

  increment(): number {
    const count = (this.counts.get(this.currentLyric) || 0) + 1;
    this.counts.set(this.currentLyric, count);
    return count;
  }

  getCount(): number {
    return this.counts.get(this.currentLyric) || 0;
  }

  reset(): void {
    this.counts.set(this.currentLyric, 0);
  }

  shouldAutoReplay(): boolean {
    return this.getCount() < this.repeatTimes;
  }

  shouldAutoAdvance(): boolean {
    return this.getCount() >= this.repeatTimes;
  }

  getState() {
    return {
      currentLyric: this.currentLyric,
      repeatCount: this.getCount(),
      isLearning: this.currentLyric !== ''
    };
  }
}
