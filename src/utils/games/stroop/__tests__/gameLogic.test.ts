import { describe, it, expect } from 'vitest';
import {
  generateStroopTrial,
  calculateStroopScore,
  COLORS,
  COLOR_NAMES,
  getColorValue,
  getColorName,
} from '../gameLogic';

describe('Stroop Game Logic', () => {
  describe('generateStroopTrial', () => {
    it('should generate a valid trial with word and color', () => {
      const trial = generateStroopTrial();
      
      expect(trial).toHaveProperty('word');
      expect(trial).toHaveProperty('color');
      expect(trial).toHaveProperty('correctAnswer');
      expect(COLOR_NAMES).toContain(trial.word);
      expect(COLORS).toContain(trial.color);
      expect(trial.correctAnswer).toBe(trial.color);
    });

    it('should generate different trials on multiple calls', () => {
      const trials = Array.from({ length: 20 }, () => generateStroopTrial());
      
      // Check that we get some variety (not all the same)
      const uniqueWords = new Set(trials.map(t => t.word));
      const uniqueColors = new Set(trials.map(t => t.color));
      
      expect(uniqueWords.size).toBeGreaterThan(1);
      expect(uniqueColors.size).toBeGreaterThan(1);
    });
  });

  describe('calculateStroopScore', () => {
    it('should return 0 for empty trials array', () => {
      const score = calculateStroopScore([]);
      expect(score).toBe(0);
    });

    it('should calculate score based on accuracy and response time', () => {
      const trials = [
        { isCorrect: true, responseTime: 500 },
        { isCorrect: true, responseTime: 600 },
        { isCorrect: false, responseTime: 700 },
        { isCorrect: true, responseTime: 550 },
      ];
      
      // 3/4 correct = 75% accuracy
      // Average response time = (500 + 600 + 700 + 550) / 4 = 587.5
      // Score = 0.75 * 1000 - 587.5 / 10 = 750 - 58.75 = 691.25 ≈ 691
      const score = calculateStroopScore(trials);
      
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1000);
      expect(Math.round(score)).toBe(691);
    });

    it('should return maximum score for perfect accuracy and fast responses', () => {
      const trials = [
        { isCorrect: true, responseTime: 100 },
        { isCorrect: true, responseTime: 100 },
        { isCorrect: true, responseTime: 100 },
      ];
      
      // 100% accuracy, 100ms average
      // Score = 1.0 * 1000 - 100 / 10 = 1000 - 10 = 990
      const score = calculateStroopScore(trials);
      
      expect(score).toBe(990);
    });

    it('should not return negative scores', () => {
      const trials = [
        { isCorrect: false, responseTime: 5000 },
        { isCorrect: false, responseTime: 5000 },
      ];
      
      const score = calculateStroopScore(trials);
      
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should match original scoring formula', () => {
      // Test with known values to ensure backward compatibility
      const trials = [
        { isCorrect: true, responseTime: 800 },
        { isCorrect: true, responseTime: 900 },
        { isCorrect: true, responseTime: 700 },
        { isCorrect: true, responseTime: 850 },
        { isCorrect: false, responseTime: 1200 },
      ];
      
      const correctCount = trials.filter(t => t.isCorrect).length;
      const accuracy = correctCount / trials.length;
      const avgResponseTime = trials.reduce((sum, t) => sum + t.responseTime, 0) / trials.length;
      
      const expectedScore = Math.max(0, Math.round(accuracy * 1000 - avgResponseTime / 10));
      const actualScore = calculateStroopScore(trials);
      
      expect(actualScore).toBe(expectedScore);
    });
  });

  describe('getColorValue', () => {
    it('should return correct CSS color values', () => {
      expect(getColorValue('red')).toBe('#ef4444');
      expect(getColorValue('blue')).toBe('#3b82f6');
      expect(getColorValue('green')).toBe('#22c55e');
      expect(getColorValue('yellow')).toBe('#eab308');
      expect(getColorValue('purple')).toBe('#a855f7');
    });
  });

  describe('getColorName', () => {
    it('should return correct Chinese color names', () => {
      expect(getColorName('red')).toBe('红色');
      expect(getColorName('blue')).toBe('蓝色');
      expect(getColorName('green')).toBe('绿色');
      expect(getColorName('yellow')).toBe('黄色');
      expect(getColorName('purple')).toBe('紫色');
    });
  });
});
