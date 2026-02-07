import { describe, it, expect } from 'vitest';
import {
  calculateStroopStatistics,
  calculateAccuracy,
  calculateAverageResponseTime,
  formatTime,
  formatAccuracy,
} from '../statistics';
import type { StroopResult } from '../../../../types/games/stroop';

describe('Stroop Statistics', () => {
  describe('calculateStroopStatistics', () => {
    it('should calculate basic statistics correctly', () => {
      const result: StroopResult = {
        gameId: 'stroop',
        timestamp: Date.now(),
        duration: 60000,
        score: 850,
        totalRounds: 10,
        correctAnswers: 8,
        accuracy: 0.8,
        averageResponseTime: 750,
        trials: [
          {
            trial: { word: '红色', color: 'red', correctAnswer: 'red' },
            userAnswer: 'red',
            isCorrect: true,
            responseTime: 700,
          },
          {
            trial: { word: '蓝色', color: 'blue', correctAnswer: 'blue' },
            userAnswer: 'blue',
            isCorrect: true,
            responseTime: 800,
          },
          {
            trial: { word: '红色', color: 'blue', correctAnswer: 'blue' },
            userAnswer: 'blue',
            isCorrect: true,
            responseTime: 900,
          },
          {
            trial: { word: '绿色', color: 'red', correctAnswer: 'red' },
            userAnswer: 'blue',
            isCorrect: false,
            responseTime: 1200,
          },
        ],
      };

      const stats = calculateStroopStatistics(result);

      expect(stats.totalRounds).toBe(10);
      expect(stats.correctAnswers).toBe(8);
      expect(stats.accuracy).toBe(80); // 0.8 * 100
      expect(stats.averageResponseTime).toBe(750);
    });

    it('should calculate congruent and incongruent response times', () => {
      const result: StroopResult = {
        gameId: 'stroop',
        timestamp: Date.now(),
        duration: 60000,
        score: 850,
        totalRounds: 4,
        correctAnswers: 3,
        accuracy: 0.75,
        averageResponseTime: 800,
        trials: [
          // Congruent trial (word matches color)
          {
            trial: { word: '红色', color: 'red', correctAnswer: 'red' },
            userAnswer: 'red',
            isCorrect: true,
            responseTime: 600,
          },
          // Incongruent trial (word doesn't match color)
          {
            trial: { word: '蓝色', color: 'red', correctAnswer: 'red' },
            userAnswer: 'red',
            isCorrect: true,
            responseTime: 900,
          },
          // Congruent trial
          {
            trial: { word: '绿色', color: 'green', correctAnswer: 'green' },
            userAnswer: 'green',
            isCorrect: true,
            responseTime: 650,
          },
          // Incongruent trial (incorrect answer)
          {
            trial: { word: '黄色', color: 'blue', correctAnswer: 'blue' },
            userAnswer: 'yellow',
            isCorrect: false,
            responseTime: 1100,
          },
        ],
      };

      const stats = calculateStroopStatistics(result);

      // Congruent RT: (600 + 650) / 2 = 625
      expect(stats.congruentResponseTime).toBe(625);
      
      // Incongruent RT: only correct ones = 900 / 1 = 900
      expect(stats.incongruentResponseTime).toBe(900);
      
      // Stroop effect: 900 - 625 = 275
      expect(stats.stroopEffect).toBe(275);
    });

    it('should handle all incorrect trials gracefully', () => {
      const result: StroopResult = {
        gameId: 'stroop',
        timestamp: Date.now(),
        duration: 60000,
        score: 0,
        totalRounds: 2,
        correctAnswers: 0,
        accuracy: 0,
        averageResponseTime: 0,
        trials: [
          {
            trial: { word: '红色', color: 'blue', correctAnswer: 'blue' },
            userAnswer: 'red',
            isCorrect: false,
            responseTime: 800,
          },
          {
            trial: { word: '绿色', color: 'yellow', correctAnswer: 'yellow' },
            userAnswer: 'green',
            isCorrect: false,
            responseTime: 900,
          },
        ],
      };

      const stats = calculateStroopStatistics(result);

      expect(stats.congruentResponseTime).toBe(0);
      expect(stats.incongruentResponseTime).toBe(0);
      expect(stats.stroopEffect).toBe(0);
    });
  });

  describe('calculateAccuracy', () => {
    it('should calculate accuracy as percentage', () => {
      expect(calculateAccuracy(8, 10)).toBe(80);
      expect(calculateAccuracy(10, 10)).toBe(100);
      expect(calculateAccuracy(0, 10)).toBe(0);
    });

    it('should handle zero total rounds', () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
    });
  });

  describe('calculateAverageResponseTime', () => {
    it('should calculate average of correct trials only', () => {
      const trials = [
        { responseTime: 500, isCorrect: true },
        { responseTime: 600, isCorrect: true },
        { responseTime: 1000, isCorrect: false }, // Should be excluded
        { responseTime: 550, isCorrect: true },
      ];

      const avg = calculateAverageResponseTime(trials);
      
      // (500 + 600 + 550) / 3 = 550
      expect(avg).toBe(550);
    });

    it('should return 0 for no correct trials', () => {
      const trials = [
        { responseTime: 500, isCorrect: false },
        { responseTime: 600, isCorrect: false },
      ];

      expect(calculateAverageResponseTime(trials)).toBe(0);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageResponseTime([])).toBe(0);
    });
  });

  describe('formatTime', () => {
    it('should format milliseconds to seconds with 3 decimal places', () => {
      expect(formatTime(1234)).toBe('1.234s');
      expect(formatTime(500)).toBe('0.500s');
      expect(formatTime(10050)).toBe('10.050s');
    });
  });

  describe('formatAccuracy', () => {
    it('should format accuracy as percentage', () => {
      expect(formatAccuracy(85.5)).toBe('86%');
      expect(formatAccuracy(100)).toBe('100%');
      expect(formatAccuracy(0)).toBe('0%');
    });
  });
});
