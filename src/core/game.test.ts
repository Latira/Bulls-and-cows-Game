import { describe, expect, it } from 'vitest';
import { evaluateGuess } from './game';

describe('evaluateGuess', () => {
  it('counts all bulls when guess matches secret exactly', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('counts bulls and cows accurately case-insensitively', () => {
    expect(evaluateGuess('1234', '1429')).toEqual({ bulls: 1, cows: 2 });
    expect(evaluateGuess('1aF0', '1Fa9')).toEqual({ bulls: 1, cows: 2 });
  });

  it('returns zeros when there are no matches', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });
});
