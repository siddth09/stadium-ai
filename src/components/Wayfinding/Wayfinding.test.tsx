import { describe, it, expect } from 'vitest';
import { renderWithContext } from '../../../tests/test-utils';
import Wayfinding from './Wayfinding';

describe('Wayfinding Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = renderWithContext(<Wayfinding />);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
