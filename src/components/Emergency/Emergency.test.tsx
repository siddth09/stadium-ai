import { describe, it, expect } from 'vitest';
import { renderWithContext } from '../../../tests/test-utils';
import Emergency from './Emergency';

describe('Emergency Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = renderWithContext(<Emergency />);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
