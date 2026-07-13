import { describe, it, expect } from 'vitest';
import { renderWithContext } from '../../../tests/test-utils';
import Sustainability from './Sustainability';

describe('Sustainability Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = renderWithContext(<Sustainability />);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
