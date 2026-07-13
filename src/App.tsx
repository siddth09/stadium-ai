/**
 * @fileoverview Root App component with lazy-loaded routes and accessibility features.
 */

import { lazy, Suspense, memo, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Page } from '@/types';
import Navbar from '@/components/Navigation/Navbar';
import { SkipLink, PageAnnouncer, LoadingSpinner } from '@/components/common/Accessibility';

/* Lazy-loaded page components for code splitting. */
const Dashboard = lazy(() => import('@/components/Dashboard/Dashboard'));
const AIAssistant = lazy(() => import('@/components/AIAssistant/AIAssistant'));
const CrowdManager = lazy(() => import('@/components/CrowdManager/CrowdManager'));
const Wayfinding = lazy(() => import('@/components/Wayfinding/Wayfinding'));
const Transport = lazy(() => import('@/components/Transport/Transport'));
const Sustainability = lazy(() => import('@/components/Sustainability/Sustainability'));
const Emergency = lazy(() => import('@/components/Emergency/Emergency'));
const Volunteer = lazy(() => import('@/components/Volunteer/Volunteer'));

/** Maps page enum to component. */
const PAGE_COMPONENTS: Record<Page, React.LazyExoticComponent<React.ComponentType>> = {
  [Page.Dashboard]: Dashboard,
  [Page.Assistant]: AIAssistant,
  [Page.Crowd]: CrowdManager,
  [Page.Wayfinding]: Wayfinding,
  [Page.Transport]: Transport,
  [Page.Sustainability]: Sustainability,
  [Page.Emergency]: Emergency,
  [Page.Volunteer]: Volunteer,
};

function App() {
  const { state } = useApp();
  const { currentPage, highContrastMode } = state;

  const PageComponent = useMemo(
    () => PAGE_COMPONENTS[currentPage],
    [currentPage],
  );

  return (
    <div data-high-contrast={highContrastMode} lang={state.language}>
      <SkipLink />
      <PageAnnouncer page={currentPage} />

      <Suspense fallback={<LoadingSpinner label="Loading page content" />}>
        <PageComponent />
      </Suspense>

      <Navbar />
    </div>
  );
}

export default memo(App);
