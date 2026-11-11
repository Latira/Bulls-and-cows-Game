import { describe, expect, it } from 'vitest';
import { createDigitValidator } from './validators';

describe('createDigitValidator', () => {
  it('validates binary digits (base 2)', () => {
    const isBinaryDigit = createDigitValidator(2);
    expect(isBinaryDigit('0')).toBe(true);
    expect(isBinaryDigit('1')).toBe(true);
    expect(isBinaryDigit('2')).toBe(false);
    expect(isBinaryDigit('a')).toBe(false);
  });

  it('validates octal digits (base 8)', () => {
    const isOctalDigit = createDigitValidator(8);
    expect(isOctalDigit('0')).toBe(true);
    expect(isOctalDigit('7')).toBe(true);
    expect(isOctalDigit('8')).toBe(false);
    expect(isOctalDigit('9')).toBe(false);
  });

  it('validates decimal digits (base 10)', () => {
    const isDecimalDigit = createDigitValidator(10);
    expect(isDecimalDigit('0')).toBe(true);
    expect(isDecimalDigit('9')).toBe(true);
    expect(isDecimalDigit('a')).toBe(false);
    expect(isDecimalDigit('-')).toBe(false);
  });

  it('validates hexadecimal digits case-insensitively (base 16)', () => {
    const isHexDigit = createDigitValidator(16);
    expect(isHexDigit('0')).toBe(true);
    expect(isHexDigit('9')).toBe(true);
    expect(isHexDigit('a')).toBe(true);
    expect(isHexDigit('f')).toBe(true);
    expect(isHexDigit('A')).toBe(true);
    expect(isHexDigit('F')).toBe(true);
    expect(isHexDigit('g')).toBe(false);
    expect(isHexDigit('G')).toBe(false);
  });

  it('rejects empty strings or multi-character strings', () => {
    const isDecimalDigit = createDigitValidator(10);
    expect(isDecimalDigit('')).toBe(false);
    expect(isDecimalDigit('12')).toBe(false);
  });
});
