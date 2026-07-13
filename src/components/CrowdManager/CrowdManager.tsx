/**
 * @fileoverview Crowd Management — real-time zone density monitoring.
 */

import { memo, useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CrowdDensity } from '@/types';
import { t } from '@/utils/i18n';
import { StadiumMap } from './StadiumMap';

function CrowdManager() {
  const { state } = useApp();
  const { zones, language } = state;
  const [filter, setFilter] = useState<'all' | CrowdDensity>('all');

  const filtered = useMemo(
    () => filter === 'all' ? zones : zones.filter((z) => z.density === filter),
    [zones, filter],
  );

  const stats = useMemo(() => ({
    total: zones.reduce((s, z) => s + z.currentOccupancy, 0),
    capacity: zones.reduce((s, z) => s + z.capacity, 0),
    critical: zones.filter((z) => z.density === CrowdDensity.Critical).length,
    high: zones.filter((z) => z.density === CrowdDensity.High).length,
  }), [zones]);

  return (
    <main className="page" id="main-content" role="main">
      <header className="page-header">
        <h1 className="page-title">👥 {t('crowd', language)}</h1>
        <p className="page-subtitle">Real-time zone density monitoring</p>
      </header>

      {/* Visual Heatmap */}
      <section aria-label="Stadium Heatmap" style={{ marginBottom: 'var(--space-lg)' }}>
        <StadiumMap zones={zones} />
      </section>

      {/* Overview stats */}
      <div className="stat-grid" aria-label="Crowd statistics">
        <div className="stat-card">
          <div className="stat-value">{stats.total.toLocaleString()}</div>
          <div className="stat-label">Total in venue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round((stats.total / stats.capacity) * 100)}%</div>
          <div className="stat-label">Overall Capacity</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--color-accent-red)' }}>{stats.critical}</div>
          <div className="stat-label">Critical Zones</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--color-accent-orange)' }}>{stats.high}</div>
          <div className="stat-label">High Density</div>
        </div>
      </div>

      {/* Filter */}
      <div className="tab-switcher" role="tablist" aria-label="Filter by density">
        {(['all', CrowdDensity.Low, CrowdDensity.Moderate, CrowdDensity.High, CrowdDensity.Critical] as const).map((f) => (
          <button
            key={f}
            className={`tab-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            role="tab"
            aria-selected={filter === f}
            aria-label={`Filter: ${f === 'all' ? 'All zones' : f}`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Zone List */}
      <section aria-label="Stadium zones">
        {filtered.map((zone) => {
          const pct = Math.round((zone.currentOccupancy / zone.capacity) * 100);
          return (
            <article
              key={zone.id}
              className="glass-card-flat"
              style={{ marginBottom: 'var(--space-sm)', padding: 'var(--space-md)' }}
              aria-label={`${zone.name}: ${pct}% capacity, ${zone.density} density`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{zone.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Level {zone.level} • {zone.type} • {zone.currentOccupancy}/{zone.capacity}
                  </div>
                </div>
                <span className={`density-badge density-${zone.density}`}>
                  {zone.density}
                </span>
              </div>
              <div
                style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-bg-glass-strong)', overflow: 'hidden' }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${zone.name} capacity: ${pct}%`}
              >
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  borderRadius: 'var(--radius-full)',
                  background: `var(--color-density-${zone.density})`,
                  transition: 'width var(--transition-base)',
                }} />
              </div>
              {zone.accessibleRoute && (
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-accent-green)', marginTop: '4px' }}>
                  ♿ {t('accessibleRoute', language)}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default memo(CrowdManager);
