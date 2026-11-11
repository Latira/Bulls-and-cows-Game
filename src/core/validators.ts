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
