import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiveRegion, LoadingSpinner, VisuallyHidden } from './Accessibility';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('LiveRegion', () => {
  it('renders correctly with default polite setting', () => {
    render(<LiveRegion message="Test announcement" />);
    const region = screen.getByRole('status');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveTextContent('Test announcement');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LiveRegion message="Accessible" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('LoadingSpinner', () => {
  it('renders a progressbar role', () => {
    render(<LoadingSpinner label="Loading..." />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Loading...');
  });
});

describe('VisuallyHidden', () => {
  it('renders children with sr-only class', () => {
    render(<VisuallyHidden>Hidden Text</VisuallyHidden>);
    const el = screen.getByText('Hidden Text');
    expect(el).toHaveClass('sr-only');
  });
});
