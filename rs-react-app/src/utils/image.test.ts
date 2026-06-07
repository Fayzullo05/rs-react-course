import { describe, expect, test } from 'vitest';
import { validateImageFile } from './image';

describe('validateImageFile', () => {
  test('returns null for valid png image', () => {
    const file = new File(['image'], 'avatar.png', {
      type: 'image/png',
    });

    expect(validateImageFile(file)).toBeNull();
  });

  test('returns error for invalid image type', () => {
    const file = new File(['text'], 'avatar.txt', {
      type: 'text/plain',
    });

    expect(validateImageFile(file)).toBe('Image must be a PNG or JPEG file.');
  });

  test('returns error for too large image', () => {
    const file = new File(['a'.repeat(1024 * 1024 + 1)], 'avatar.png', {
      type: 'image/png',
    });

    expect(validateImageFile(file)).toBe('Image size must be less than 1 MB.');
  });
});
