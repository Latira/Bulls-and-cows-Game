const DIGITS = '0123456789abcdef';

export const createDigitValidator = (base: number) => {
  const allowedDigits = DIGITS.slice(0, base);

  return (char: string): boolean => {
    if (char.length !== 1) {
      return false;
    }

    return allowedDigits.includes(char.toLowerCase());
  };
};

export const isValidGuess = (
  guess: string,
  length: number,
  base: number
): boolean => {
  if (guess.length !== length) {
    return false;
  }

  const normalized = guess.toLowerCase();
  const chars = normalized.split('');
  const isDigitValid = createDigitValidator(base);

  if (!chars.every(isDigitValid)) {
    return false;
  }

  return new Set(chars).size === length;
};
