import { describe, it, expect, vi } from 'vitest';
import { renderWithContext } from '../../../tests/test-utils';
import Dashboard from './Dashboard';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: () => <div>LineChart</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

describe('Dashboard Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = renderWithContext(<Dashboard />);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
