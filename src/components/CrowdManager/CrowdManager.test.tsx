import { describe, it, expect } from 'vitest';
import { renderWithContext } from '../../../tests/test-utils';
import CrowdManager from './CrowdManager';

describe('CrowdManager Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = renderWithContext(<CrowdManager />);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
