import { describe, it, expect } from 'vitest';
import { t, getLanguageName } from './i18n';
import { Language } from '../types';

describe('i18n', () => {
  it('translates known keys', () => {
    expect(t('dashboard', Language.English)).toBe('Dashboard');
    expect(t('dashboard', Language.Spanish)).toBe('Panel');
    expect(t('dashboard', Language.French)).toBe('Tableau de bord');
  });

  it('falls back to English for unknown keys or languages if missing', () => {
    // Assuming a key that doesn't exist falls back to the key name itself
    // @ts-expect-error Testing invalid key
    expect(t('unknownKey', Language.English)).toBe('unknownKey');
  });

  it('gets correct language names', () => {
    expect(getLanguageName(Language.English)).toBe('English');
    expect(getLanguageName(Language.Spanish)).toBe('Español');
  });
});
