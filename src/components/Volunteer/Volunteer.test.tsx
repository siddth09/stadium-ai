import { describe, it, expect } from 'vitest';
import { renderWithContext } from '../../../tests/test-utils';
import Volunteer from './Volunteer';

describe('Volunteer Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = renderWithContext(<Volunteer />);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
