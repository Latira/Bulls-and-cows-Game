import { describe, expect, it } from 'vitest';
import { evaluateGuess, generateSecret } from './game';

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

describe('generateSecret', () => {
  it('generates a secret of exact length with unique digits valid for the base', () => {
    const secret = generateSecret(4, 10);
    expect(secret).toHaveLength(4);
    expect(new Set(secret.split('')).size).toBe(4);
    expect(/^[0-9]+$/.test(secret)).toBe(true);
  });

  it('produces deterministic output when custom random generator is provided', () => {
    const alwaysZeroRandom = () => 0;
    expect(generateSecret(4, 10, alwaysZeroRandom)).toBe('0123');
    expect(generateSecret(4, 16, alwaysZeroRandom)).toBe('0123');
  });

  it('supports hexadecimal digits up to f for base 16', () => {
    const alwaysMaxRandom = () => 0.999;
    expect(generateSecret(3, 16, alwaysMaxRandom)).toBe('fed');
  });
});
