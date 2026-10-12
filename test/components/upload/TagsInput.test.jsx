import { describe, expect, test } from 'vitest';
import { validateTagsCsv } from '../../../src/components/upload/TagsInput.jsx';

describe('validateTagsCsv', () => {
  test('accepts an empty value and comma-separated tags', () => {
    expect(validateTagsCsv('')).toEqual([]);
    expect(validateTagsCsv('jazz, live music, 2026')).toEqual([]);
  });

  test('rejects empty tags between commas', () => {
    expect(validateTagsCsv('jazz,,live music')).toContain(
      'Remove empty tags; separate each tag with a single comma.'
    );
  });

  test('rejects tags without a letter or number', () => {
    expect(validateTagsCsv('jazz, !!!')).toContain(
      'Each tag must contain at least one letter or number.'
    );
  });
});
