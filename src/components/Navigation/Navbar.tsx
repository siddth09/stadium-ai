/**
 * @fileoverview Navigation bar — bottom tab navigation for mobile-first layout.
 */

import { memo, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Page } from '@/types';
import { t } from '@/utils/i18n';

/** Navigation items configuration. */
const NAV_ITEMS: readonly { page: Page; icon: string; label: string; center?: boolean }[] = [
  { page: Page.Dashboard, icon: '📊', label: 'dashboard' },
  { page: Page.Crowd, icon: '👥', label: 'crowd' },
  { page: Page.Assistant, icon: '🤖', label: 'assistant', center: true },
  { page: Page.Wayfinding, icon: '🧭', label: 'wayfinding' },
  { page: Page.Emergency, icon: '🚨', label: 'emergency' },
];

function Navbar() {
  const { state, dispatch } = useApp();
  const { currentPage, language } = state;

  const navigate = useCallback(
    (page: Page) => {
      dispatch({ type: 'SET_PAGE', payload: page });
    },
    [dispatch],
  );

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.page}
          className={`nav-item ${currentPage === item.page ? 'active' : ''} ${item.center ? 'nav-item-center' : ''}`}
          onClick={() => navigate(item.page)}
          aria-label={`Navigate to ${t(item.label as Parameters<typeof t>[0], language)}`}
          aria-current={currentPage === item.page ? 'page' : undefined}
        >
          <span className="nav-icon" aria-hidden="true">
            {item.center ? (
              <span style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
              }}>{item.icon}</span>
            ) : item.icon}
          </span>
          {!item.center && (
            <span>{t(item.label as Parameters<typeof t>[0], language)}</span>
          )}
        </button>
      ))}
    </nav>
  );
}

export default memo(Navbar);
