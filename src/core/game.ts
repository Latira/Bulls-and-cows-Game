export interface GuessResult {
  bulls: number;
  cows: number;
}

export const evaluateGuess = (secret: string, guess: string): GuessResult => {
  const secretChars = secret.toLowerCase().split('');
  const guessChars = guess.toLowerCase().split('');

  const bulls = guessChars.filter(
    (char, index) => char === secretChars[index]
  ).length;

  const cows = guessChars.filter(
    (char, index) => char !== secretChars[index] && secretChars.includes(char)
  ).length;

  return { bulls, cows };
};

const ALL_DIGITS = '0123456789abcdef';

const pickUniqueChars = (
  pool: readonly string[],
  remaining: number,
  random: () => number
): string => {
  if (remaining === 0 || pool.length === 0) {
    return '';
  }

  const index = Math.floor(random() * pool.length);
  const chosen = pool[index];
  const nextPool = pool.filter((_, i) => i !== index);

  return chosen + pickUniqueChars(nextPool, remaining - 1, random);
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random
): string => {
  const pool = ALL_DIGITS.slice(0, base).split('');
  return pickUniqueChars(pool, length, random);
};

export const countPossibleSecrets = (length: number, base: number): number => {
  void length;
  void base;
  return 0;
};

const createSecretCounter = () => {
  const cache = new Map<string, number>();

  const count = (length: number, base: number): number => {
    if (length < 0 || length > base) {
      return 0;
    }

    if (length === 0) {
      return 1;
    }

    const key = `${length}:${base}`;
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = base * count(length - 1, base - 1);
    cache.set(key, result);
    return result;
  };

  return count;
};

export const countPossibleSecrets = createSecretCounter();
