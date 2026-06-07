import { describe, expect, test } from 'vitest';
import { isValidEmail } from './email';

describe('isValidEmail', () => {
  test('returns true for a valid basic email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  test('returns false when email has no at sign', () => {
    expect(isValidEmail('user.example.com')).toBe(false);
  });

  test('returns false when email has multiple at signs', () => {
    expect(isValidEmail('user@@example.com')).toBe(false);
  });

  test('returns false when domain has no dot', () => {
    expect(isValidEmail('user@example')).toBe(false);
  });
});
