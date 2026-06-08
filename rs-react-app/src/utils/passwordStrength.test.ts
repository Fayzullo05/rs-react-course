import { describe, expect, test } from 'vitest';
import { getPasswordStrength } from './passwordStrength';

describe('getPasswordStrength', () => {
  test('detects password strength requirements', () => {
    expect(getPasswordStrength('Password1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialCharacter: true,
      score: 4,
    });
  });

  test('returns zero score for empty password', () => {
    expect(getPasswordStrength('')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecialCharacter: false,
      score: 0,
    });
  });
});
