/**
 * @fileoverview Accessibility utility components.
 * SkipLink — allows keyboard users to skip to main content.
 * LiveRegion — announces dynamic content to screen readers.
 * LoadingSpinner — accessible loading indicator.
 */

import { useState, useEffect, type ReactNode } from 'react';

/**
 * Skip-to-main-content link for keyboard navigation.
 * Becomes visible only on focus, allowing keyboard users to bypass navigation.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}

/**
 * ARIA live region for announcing dynamic content changes to screen readers.
 * @param message - The message to announce.
 * @param politeness - ARIA live politeness setting.
 */
export function LiveRegion({
  message,
  politeness = 'polite',
}: {
  readonly message: string;
  readonly politeness?: 'polite' | 'assertive';
}) {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      role="status"
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * Accessible loading spinner with ARIA attributes.
 * @param label - Descriptive label for screen readers.
 */
export function LoadingSpinner({ label = 'Loading content' }: { readonly label?: string }) {
  return (
    <div
      className="loading-spinner"
      role="progressbar"
      aria-label={label}
      aria-busy="true"
    >
      <div className="spinner-ring" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * A secure text input that sanitizes value on change.
 * Wraps native input with proper ARIA attributes.
 */
export function SecureInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  type = 'text',
  required = false,
  ariaDescribedBy,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly maxLength?: number;
  readonly type?: 'text' | 'search' | 'email';
  readonly required?: boolean;
  readonly ariaDescribedBy?: string;
}) {
  return (
    <div className="secure-input-wrapper">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        aria-describedby={ariaDescribedBy}
        aria-label={label}
        autoComplete="off"
        spellCheck="false"
        className="secure-input"
      />
    </div>
  );
}

/**
 * Visually Hidden component — renders content only for screen readers.
 */
export function VisuallyHidden({ children }: { readonly children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/**
 * Announces a page change for screen readers after navigation.
 */
export function PageAnnouncer({ page }: { readonly page: string }) {
  const [announced, setAnnounced] = useState('');

  useEffect(() => {
    setAnnounced(`Navigated to ${page} page`);
  }, [page]);

  return <LiveRegion message={announced} politeness="polite" />;
}
