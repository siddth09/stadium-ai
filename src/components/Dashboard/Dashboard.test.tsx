import { describe, it, expect, vi } from 'vitest';
import { fireEvent, act } from '@testing-library/react';
import { renderWithContext } from '../../../tests/test-utils';
import Dashboard from './Dashboard';
import * as aiService from '@/services/aiService';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: () => <div>LineChart</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

vi.mock('@/services/aiService', () => ({
  getAIResponse: vi.fn(),
}));

describe('Dashboard Component', () => {
  it('renders without crashing and triggers AI report', async () => {
    vi.mocked(aiService.getAIResponse).mockResolvedValue('Mock AI Report');
    const { getByRole, getByText } = renderWithContext(<Dashboard />);
    expect(getByRole('main')).toBeInTheDocument();
    
    const button = getByText('Generate Live Report');
    await act(async () => {
      fireEvent.click(button);
    });
    
    expect(aiService.getAIResponse).toHaveBeenCalled();
  });
});
