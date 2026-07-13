import { describe, it, expect } from 'vitest';
import { renderWithContext } from '../tests/test-utils';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = renderWithContext(<App />);
    expect(container).toBeInTheDocument();
  });
});
