import { describe, expect, test } from 'vitest';
import { validateTagInput } from '../../../src/components/upload/TagsInput.jsx';

describe('validateTagsCsv', () => {
  /** control-path csv validation */
  test('accepts an empty value and comma-separated tags', () => {
    expect(validateTagInput('')).toContain(
      'Please enter some tags'
    );
  });

  /** happy-path tag validation without punctuation */
  test('accepts comma-separated tags without punctuation', () => {
    expect(validateTagInput('jazz, live music, 2026')).toEqual([]);
  });

  /** unhappy-path tag validation with empty values */
  test('rejects empty tags between commas', () => {
    expect(validateTagInput('jazz,,live music')).toContain(
      'Tags must have no punctuation and each be separated by a comma' 
    );
  });

  /** unhappy-path tag validation with punctuation in entries */
  test('rejects tags without a letter or number', () => {
    expect(validateTagInput('jazz, !!!')).toContain(
      'Tags must have no punctuation and each be separated by a comma' 
    );
  });
});
