import { describe, it, expect } from 'vitest';
import { renderWithContext } from '../../../tests/test-utils';
import AIAssistant from './AIAssistant';

describe('AIAssistant Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = renderWithContext(<AIAssistant />);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
