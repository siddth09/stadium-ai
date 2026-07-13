import { describe, it, expect } from 'vitest';
import { renderWithContext } from '../../../tests/test-utils';
import Transport from './Transport';

describe('Transport Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = renderWithContext(<Transport />);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
