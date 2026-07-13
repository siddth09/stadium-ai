/**
 * @fileoverview Dashboard — main overview page showing match info,
 * stadium stats, crowd heatmap summary, and quick actions.
 */

import { memo, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, CrowdDensity } from '@/types';
import { t } from '@/utils/i18n';

/** Formats large numbers with K/M suffix. */
function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

/** Maps crowd density to CSS class and label. */
function densityInfo(d: CrowdDensity, lang: Parameters<typeof t>[1]) {
  const map = {
    [CrowdDensity.Low]: { cls: 'density-low', label: t('lowDensity', lang) },
    [CrowdDensity.Moderate]: { cls: 'density-moderate', label: t('moderateDensity', lang) },
    [CrowdDensity.High]: { cls: 'density-high', label: t('highDensity', lang) },
    [CrowdDensity.Critical]: { cls: 'density-critical', label: t('criticalDensity', lang) },
  };
  return map[d];
}

function Dashboard() {
  const { state, dispatch } = useApp();
  const { match, zones, emergencies, sustainability, language } = state;

  const activeAlerts = useMemo(
    () => emergencies.filter((e) => !e.resolved),
    [emergencies],
  );

  const zoneSummary = useMemo(() => {
    const critical = zones.filter((z) => z.density === CrowdDensity.Critical).length;
    const high = zones.filter((z) => z.density === CrowdDensity.High).length;
    const total = zones.reduce((s, z) => s + z.currentOccupancy, 0);
    return { critical, high, total };
  }, [zones]);

  return (
    <main className="page" id="main-content" role="main">
      <header className="page-header">
        <h1 className="page-title">⚽ {t('dashboard', language)}</h1>
        <p className="page-subtitle">FIFA World Cup 2026 — Live Operations</p>
      </header>

      {/* Match Banner */}
      <section
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))',
          marginBottom: 'var(--space-lg)',
          textAlign: 'center',
        }}
        aria-label="Current match information"
      >
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
          🏟️ {match.venue}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-lg)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>{match.teamA}</div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
            }}
            aria-label={`Score: ${match.score.home} to ${match.score.away}`}
          >
            {match.score.home} — {match.score.away}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>{match.teamB}</div>
          </div>
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 'var(--space-sm)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: match.status === 'live' ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.15)',
            color: match.status === 'live' ? 'var(--color-accent-red)' : 'var(--color-accent-green)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
          aria-live="polite"
        >
          ● {match.status.toUpperCase()}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stat-grid" aria-label="Stadium statistics">
        <div className="stat-card">
          <div className="stat-icon" aria-hidden="true">👥</div>
          <div className="stat-value">{formatNumber(match.attendance)}</div>
          <div className="stat-label">Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" aria-hidden="true">🚨</div>
          <div className="stat-value" style={{ color: activeAlerts.length > 0 ? 'var(--color-accent-red)' : 'var(--color-accent-green)' }}>
            {activeAlerts.length}
          </div>
          <div className="stat-label">Active Alerts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" aria-hidden="true">♻️</div>
          <div className="stat-value" style={{ color: 'var(--color-accent-green)' }}>
            {sustainability.wasteRecycled}%
          </div>
          <div className="stat-label">Recycling Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" aria-hidden="true">⚡</div>
          <div className="stat-value" style={{ color: 'var(--color-accent-cyan)' }}>
            {sustainability.renewablePercentage}%
          </div>
          <div className="stat-label">Renewable Energy</div>
        </div>
      </section>

      {/* Alerts */}
      {activeAlerts.length > 0 && (
        <section aria-label="Active emergency alerts" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>
            🚨 Active Alerts
          </h2>
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="glass-card-flat"
              role="alert"
              style={{
                marginBottom: 'var(--space-sm)',
                borderLeft: `4px solid ${alert.severity === 'critical' ? 'var(--color-accent-red)' : 'var(--color-accent-yellow)'}`,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>
                {alert.type === 'weather' ? '⛈️' : '🏥'} {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} — {alert.severity.toUpperCase()}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                {alert.message}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Crowd Heatmap Summary */}
      <section aria-label="Crowd density overview" style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>
          👥 Zone Density
        </h2>
        <div className="glass-card-flat">
          {zoneSummary.critical > 0 && (
            <p style={{ color: 'var(--color-accent-red)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>
              ⚠️ {zoneSummary.critical} zone(s) at critical capacity
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
            {zones.slice(0, 6).map((zone) => {
              const info = densityInfo(zone.density, language);
              const pct = Math.round((zone.currentOccupancy / zone.capacity) * 100);
              return (
                <div key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {zone.name}
                    </div>
                    <div
                      style={{ height: 6, borderRadius: 'var(--radius-full)', background: 'var(--color-bg-glass-strong)', marginTop: 4 }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${zone.name}: ${pct}% capacity`}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          borderRadius: 'var(--radius-full)',
                          background: `var(--color-density-${zone.density})`,
                          transition: 'width var(--transition-base)',
                        }}
                      />
                    </div>
                  </div>
                  <span className={`density-badge ${info.cls}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginTop: 'var(--space-md)' }}
            onClick={() => dispatch({ type: 'SET_PAGE', payload: Page.Crowd })}
            aria-label="View full crowd management dashboard"
          >
            View All Zones →
          </button>
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>
          ⚡ Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)' }}>
          {[
            { icon: '🤖', label: t('assistant', language), page: Page.Assistant },
            { icon: '🧭', label: t('wayfinding', language), page: Page.Wayfinding },
            { icon: '🚗', label: t('transport', language), page: Page.Transport },
            { icon: '🚨', label: t('emergency', language), page: Page.Emergency },
          ].map((action) => (
            <button
              key={action.page}
              className="glass-card-flat"
              onClick={() => dispatch({ type: 'SET_PAGE', payload: action.page })}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-md)',
                border: '1px solid var(--color-border-glass)',
                background: 'var(--color-bg-card)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)',
              }}
              aria-label={`Go to ${action.label}`}
            >
              <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default memo(Dashboard);
