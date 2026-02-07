/**
 * Backward Compatibility Tests
 * 
 * These tests verify that the refactored Stroop game maintains
 * the same behavior as the original implementation.
 * 
 * Feature: brain-training-platform, Property 3: Stroop 游戏向后兼容性
 * Validates: Requirements 3.2, 3.4, 3.5
 */

import { describe, it, expect } from 'vitest';
import { calculateStroopScore } from '../gameLogic';
import { calculateStroopStatistics } from '../statistics';
import type { StroopResult } from '../../../../types/games/stroop';

describe('Stroop Game Backward Compatibility', () => {
  describe('Score Calculation Compatibility', () => {
    it('should match original scoring formula: accuracy * 1000 - avgRT / 10', () => {
      // Test case 1: High accuracy, fast response
      const trials1 = [
        { isCorrect: true, responseTime: 500 },
        { isCorrect: true, responseTime: 600 },
        { isCorrect: true, responseTime: 550 },
        { isCorrect: true, responseTime: 580 },
      ];
      
      const score1 = calculateStroopScore(trials1);
      const expectedScore1 = Math.max(0, Math.round(1.0 * 1000 - 557.5 / 10));
      expect(score1).toBe(expectedScore1);

      // Test case 2: Medium accuracy, medium response
      const trials2 = [
        { isCorrect: true, responseTime: 800 },
        { isCorrect: false, responseTime: 1200 },
        { isCorrect: true, responseTime: 750 },
        { isCorrect: true, responseTime: 850 },
      ];
      
      const score2 = calculateStroopScore(trials2);
      const accuracy2 = 3 / 4;
      const avgRT2 = (800 + 1200 + 750 + 850) / 4;
      const expectedScore2 = Math.max(0, Math.round(accuracy2 * 1000 - avgRT2 / 10));
      expect(score2).toBe(expectedScore2);

      // Test case 3: Low accuracy, slow response
      const trials3 = [
        { isCorrect: false, responseTime: 1500 },
        { isCorrect: false, responseTime: 1600 },
        { isCorrect: true, responseTime: 1400 },
      ];
      
      const score3 = calculateStroopScore(trials3);
      const accuracy3 = 1 / 3;
      const avgRT3 = (1500 + 1600 + 1400) / 3;
      const expectedScore3 = Math.max(0, Math.round(accuracy3 * 1000 - avgRT3 / 10));
      expect(score3).toBe(expectedScore3);
    });

    it('should never return negative scores', () => {
      // Very slow responses with low accuracy
      const trials = [
        { isCorrect: false, responseTime: 10000 },
        { isCorrect: false, responseTime: 10000 },
        { isCorrect: false, responseTime: 10000 },
      ];
      
      const score = calculateStroopScore(trials);
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Statistics Calculation Compatibility', () => {
    it('should calculate Stroop effect as incongruent RT - congruent RT', () => {
      const result: StroopResult = {
        gameId: 'stroop',
        timestamp: Date.now(),
        duration: 60000,
        score: 800,
        totalRounds: 6,
        correctAnswers: 5,
        accuracy: 5/6,
        averageResponseTime: 750,
        trials: [
          // Congruent trials (word matches color)
          {
            trial: { word: '红色', color: 'red', correctAnswer: 'red' },
            userAnswer: 'red',
            isCorrect: true,
            responseTime: 600,
          },
          {
            trial: { word: '蓝色', color: 'blue', correctAnswer: 'blue' },
            userAnswer: 'blue',
            isCorrect: true,
            responseTime: 650,
          },
          // Incongruent trials (word doesn't match color)
          {
            trial: { word: '红色', color: 'blue', correctAnswer: 'blue' },
            userAnswer: 'blue',
            isCorrect: true,
            responseTime: 850,
          },
          {
            trial: { word: '绿色', color: 'yellow', correctAnswer: 'yellow' },
            userAnswer: 'yellow',
            isCorrect: true,
            responseTime: 900,
          },
          {
            trial: { word: '黄色', color: 'green', correctAnswer: 'green' },
            userAnswer: 'green',
            isCorrect: true,
            responseTime: 880,
          },
          // Incorrect trial (should be excluded from RT calculations)
          {
            trial: { word: '紫色', color: 'red', correctAnswer: 'red' },
            userAnswer: 'purple',
            isCorrect: false,
            responseTime: 1200,
          },
        ],
      };

      const stats = calculateStroopStatistics(result);

      // Congruent RT: (600 + 650) / 2 = 625
      expect(stats.congruentResponseTime).toBe(625);
      
      // Incongruent RT: (850 + 900 + 880) / 3 = 876.67
      expect(Math.round(stats.incongruentResponseTime)).toBe(877);
      
      // Stroop effect: 876.67 - 625 = 251.67
      expect(Math.round(stats.stroopEffect)).toBe(252);
    });

    it('should only include correct trials in RT calculations', () => {
      const result: StroopResult = {
        gameId: 'stroop',
        timestamp: Date.now(),
        duration: 60000,
        score: 500,
        totalRounds: 4,
        correctAnswers: 2,
        accuracy: 0.5,
        averageResponseTime: 900,
        trials: [
          {
            trial: { word: '红色', color: 'red', correctAnswer: 'red' },
            userAnswer: 'red',
            isCorrect: true,
            responseTime: 700,
          },
          {
            trial: { word: '蓝色', color: 'red', correctAnswer: 'red' },
            userAnswer: 'blue',
            isCorrect: false,
            responseTime: 1500, // Should be excluded
          },
          {
            trial: { word: '绿色', color: 'green', correctAnswer: 'green' },
            userAnswer: 'green',
            isCorrect: true,
            responseTime: 750,
          },
          {
            trial: { word: '黄色', color: 'blue', correctAnswer: 'blue' },
            userAnswer: 'yellow',
            isCorrect: false,
            responseTime: 1600, // Should be excluded
          },
        ],
      };

      const stats = calculateStroopStatistics(result);

      // Only correct trials: 700 and 750
      // Congruent: (700 + 750) / 2 = 725
      expect(stats.congruentResponseTime).toBe(725);
    });

    it('should convert accuracy to percentage (0-100)', () => {
      const result: StroopResult = {
        gameId: 'stroop',
        timestamp: Date.now(),
        duration: 60000,
        score: 800,
        totalRounds: 10,
        correctAnswers: 8,
        accuracy: 0.8, // Stored as decimal
        averageResponseTime: 750,
        trials: [],
      };

      const stats = calculateStroopStatistics(result);

      // Should be converted to percentage
      expect(stats.accuracy).toBe(80);
    });
  });

  describe('Data Structure Compatibility', () => {
    it('should maintain all required fields in result object', () => {
      const result: StroopResult = {
        gameId: 'stroop',
        timestamp: Date.now(),
        duration: 60000,
        score: 850,
        totalRounds: 5,
        correctAnswers: 4,
        accuracy: 0.8,
        averageResponseTime: 700,
        trials: [
          {
            trial: { word: '红色', color: 'red', correctAnswer: 'red' },
            userAnswer: 'red',
            isCorrect: true,
            responseTime: 650,
          },
        ],
      };

      // Verify all required fields exist
      expect(result).toHaveProperty('gameId');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('totalRounds');
      expect(result).toHaveProperty('correctAnswers');
      expect(result).toHaveProperty('accuracy');
      expect(result).toHaveProperty('averageResponseTime');
      expect(result).toHaveProperty('trials');

      // Verify trial structure
      expect(result.trials[0]).toHaveProperty('trial');
      expect(result.trials[0]).toHaveProperty('userAnswer');
      expect(result.trials[0]).toHaveProperty('isCorrect');
      expect(result.trials[0]).toHaveProperty('responseTime');
    });
  });
});
