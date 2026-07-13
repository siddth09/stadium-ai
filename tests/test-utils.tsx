import React from 'react';
import { render } from '@testing-library/react';
import { AppProvider } from '../src/context/AppContext';

export const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};
