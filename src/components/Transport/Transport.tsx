/**
 * @fileoverview Transport — transportation options and coordination.
 */

import { memo, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/utils/i18n';

/** Icon mapping for transport types. */
const TRANSPORT_ICONS: Record<string, string> = {
  metro: '🚇',
  bus: '🚌',
  shuttle: '🚐',
  parking: '🅿️',
  rideshare: '🚕',
  walking: '🚶',
};

/** Status badge style. */
function statusStyle(status: string) {
  switch (status) {
    case 'available': return { bg: 'rgba(52,211,153,0.15)', color: 'var(--color-accent-green)' };
    case 'limited': return { bg: 'rgba(251,191,36,0.15)', color: 'var(--color-accent-yellow)' };
    case 'full': return { bg: 'rgba(248,113,113,0.15)', color: 'var(--color-accent-red)' };
    default: return { bg: 'var(--color-bg-glass)', color: 'var(--color-text-secondary)' };
  }
}

function Transport() {
  const { state } = useApp();
  const { transport, language } = state;

  const sorted = useMemo(
    () => [...transport].sort((a, b) => a.carbonEmission - b.carbonEmission),
    [transport],
  );

  const greenest = sorted[0];

  return (
    <main className="page" id="main-content" role="main">
      <header className="page-header">
        <h1 className="page-title">🚗 {t('transport', language)}</h1>
        <p className="page-subtitle">Plan your journey to and from the stadium</p>
      </header>

      {/* Green recommendation */}
      {greenest && (
        <section
          className="glass-card"
          style={{
            marginBottom: 'var(--space-lg)',
            background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(34,211,238,0.1))',
            borderLeft: '4px solid var(--color-accent-green)',
          }}
          aria-label="Eco-friendly recommendation"
        >
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>
            🌱 Greenest Option
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>
            {TRANSPORT_ICONS[greenest.type]} {greenest.name}
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {greenest.carbonEmission === 0 ? 'Zero carbon emissions!' : `Only ${greenest.carbonEmission} kg CO₂ per trip`}
            {' • '}{greenest.estimatedTime} min
          </p>
        </section>
      )}

      {/* Transport options */}
      <section aria-label="All transport options">
        <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>All Options</h2>
        {sorted.map((opt) => {
          const style = statusStyle(opt.status);
          return (
            <article
              key={opt.id}
              className="glass-card-flat"
              style={{ marginBottom: 'var(--space-sm)', padding: 'var(--space-md)' }}
              aria-label={`${opt.name}: ${opt.status}, ${opt.estimatedTime} minutes`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'start' }}>
                  <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
                    {TRANSPORT_ICONS[opt.type] ?? '🚌'}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{opt.name}</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: '4px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      <span>🕐 {opt.estimatedTime} min</span>
                      <span>🌿 {opt.carbonEmission} kg CO₂</span>
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    background: style.bg,
                    color: style.color,
                  }}
                >
                  {opt.status}
                </span>
              </div>
              {opt.status !== 'full' && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
                  {opt.availableCapacity.toLocaleString()} spots available
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Carbon tip */}
      <section
        className="glass-card-flat"
        style={{ marginTop: 'var(--space-md)', textAlign: 'center', padding: 'var(--space-lg)' }}
        aria-label="Environmental tip"
      >
        <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }} aria-hidden="true">♻️</div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <strong>Did you know?</strong> Choosing public transport over driving saves an average of
          <strong style={{ color: 'var(--color-accent-green)' }}> 0.13 kg CO₂</strong> per person per trip.
          Together, we can make this World Cup the most sustainable ever!
        </p>
      </section>
    </main>
  );
}

export default memo(Transport);
