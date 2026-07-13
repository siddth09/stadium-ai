/**
 * @fileoverview Sustainability — environmental metrics dashboard.
 */

import { memo, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/utils/i18n';

/** Circular progress ring component. */
function ProgressRing({
  value,
  target,
  label,
  color,
  unit,
}: {
  readonly value: number;
  readonly target: number;
  readonly label: string;
  readonly color: string;
  readonly unit: string;
}) {
  const pct = Math.min((value / target) * 100, 100);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div style={{ textAlign: 'center' }} role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={target} aria-label={`${label}: ${value}${unit} of ${target}${unit} target`}>
      <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-bg-glass-strong)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="50" y="46" textAnchor="middle" fill="var(--color-text-primary)" fontSize="16" fontWeight="700" fontFamily="var(--font-heading)">
          {Math.round(pct)}%
        </text>
        <text x="50" y="62" textAnchor="middle" fill="var(--color-text-muted)" fontSize="8">
          {unit}
        </text>
      </svg>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '4px' }}>{label}</div>
    </div>
  );
}

function Sustainability() {
  const { state } = useApp();
  const { sustainability, language } = state;

  const tips = useMemo(() => [
    { icon: '🚇', text: 'Take public transport — save 0.13 kg CO₂ vs driving' },
    { icon: '🚰', text: 'Use free water refill stations instead of buying bottles' },
    { icon: '♻️', text: 'Sort waste into the 4-bin recycling stations' },
    { icon: '🌱', text: 'Choose plant-based food options — 50% less carbon footprint' },
    { icon: '☀️', text: `${sustainability.renewablePercentage}% of stadium energy is renewable` },
  ], [sustainability.renewablePercentage]);

  return (
    <main className="page" id="main-content" role="main">
      <header className="page-header">
        <h1 className="page-title">♻️ {t('sustainability', language)}</h1>
        <p className="page-subtitle">Making FIFA World Cup 2026 the greenest ever</p>
      </header>

      {/* Progress Rings */}
      <section
        className="glass-card"
        style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 'var(--space-lg)' }}
        aria-label="Sustainability goals progress"
      >
        <ProgressRing value={sustainability.wasteRecycled} target={sustainability.targetRecycling} label="Recycling" color="var(--color-accent-green)" unit="%" />
        <ProgressRing value={sustainability.carbonFootprint} target={sustainability.targetCarbon} label="Carbon" color="var(--color-accent-cyan)" unit="t CO₂" />
        <ProgressRing value={sustainability.renewablePercentage} target={100} label="Renewable" color="var(--color-accent-yellow)" unit="%" />
      </section>

      {/* Detailed Metrics */}
      <section aria-label="Detailed sustainability metrics" style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>Metrics</h2>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">🌍</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-cyan)' }}>{sustainability.carbonFootprint}t</div>
            <div className="stat-label">CO₂ Emitted</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">♻️</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-green)' }}>{sustainability.wasteRecycled}%</div>
            <div className="stat-label">Waste Recycled</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">💧</div>
            <div className="stat-value">{(sustainability.waterUsage / 1000).toFixed(0)}K</div>
            <div className="stat-label">Liters Water</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">⚡</div>
            <div className="stat-value">{(sustainability.energyConsumption / 1000).toFixed(1)}K</div>
            <div className="stat-label">kWh Energy</div>
          </div>
        </div>
      </section>

      {/* Fan Tips */}
      <section aria-label="Sustainability tips for fans">
        <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>🌱 How You Can Help</h2>
        {tips.map((tip, i) => (
          <div
            key={i}
            className="glass-card-flat"
            style={{ marginBottom: 'var(--space-sm)', padding: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}
          >
            <span style={{ fontSize: '1.25rem' }} aria-hidden="true">{tip.icon}</span>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{tip.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

export default memo(Sustainability);
