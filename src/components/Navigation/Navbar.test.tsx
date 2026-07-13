import { describe, it, expect } from 'vitest';
import { renderWithContext } from '../../../tests/test-utils';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = renderWithContext(<Navbar />);
    expect(getByRole('navigation')).toBeInTheDocument();
  });
});
