/**
 * @fileoverview Wayfinding — stadium navigation and seat finder.
 */

import { memo, useState, useCallback, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/utils/i18n';
import { sanitizeInput } from '@/utils/sanitize';

/** Quick navigation destinations. */
const DESTINATIONS = [
  { icon: '💺', label: 'Find My Seat', desc: 'Enter your section and row number' },
  { icon: '🍔', label: 'Food Courts', desc: 'Find the nearest food options' },
  { icon: '🚻', label: 'Restrooms', desc: 'Nearest restroom with low wait' },
  { icon: '🏥', label: 'Medical Station', desc: 'Emergency medical assistance' },
  { icon: '🚪', label: 'Nearest Exit', desc: 'Find the closest exit gate' },
  { icon: '♿', label: 'Accessible Routes', desc: 'Wheelchair & mobility friendly paths' },
  { icon: '🧘', label: 'Sensory Room', desc: 'Quiet space for sensory breaks' },
  { icon: '🎒', label: 'Lost & Found', desc: 'Report or collect lost items' },
] as const;

function Wayfinding() {
  const { state } = useApp();
  const { zones, language } = state;
  const [search, setSearch] = useState('');
  const [selectedDest, setSelectedDest] = useState<string | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearch(sanitizeInput(value));
  }, []);

  const matchedZones = useMemo(() => {
    if (!search) return [];
    const lower = search.toLowerCase();
    return zones.filter((z) =>
      z.name.toLowerCase().includes(lower) || z.type.toLowerCase().includes(lower),
    );
  }, [zones, search]);

  const getDirections = useCallback((dest: string) => {
    setSelectedDest(dest);
  }, []);

  const directionInfo = useMemo(() => {
    if (!selectedDest) return null;
    const lower = selectedDest.toLowerCase();
    if (lower.includes('food')) {
      const best = zones.filter((z) => z.type === 'food').sort((a, b) => a.currentOccupancy / a.capacity - b.currentOccupancy / b.capacity)[0];
      return best ? { zone: best, route: 'Head towards Gate C via the main concourse. Follow green signs.', time: '3 min walk' } : null;
    }
    if (lower.includes('restroom')) {
      const best = zones.filter((z) => z.type === 'restroom').sort((a, b) => a.currentOccupancy / a.capacity - b.currentOccupancy / b.capacity)[0];
      return best ? { zone: best, route: 'Level 2 West restrooms have the shortest wait. Take stairs or elevator at Section 201.', time: '2 min walk' } : null;
    }
    if (lower.includes('medical')) {
      const med = zones.find((z) => z.type === 'medical');
      return med ? { zone: med, route: 'Medical Station is at the Central Concourse, Level 1. Look for the red cross signs.', time: '4 min walk' } : null;
    }
    if (lower.includes('exit')) {
      const best = zones.filter((z) => z.type === 'exit').sort((a, b) => a.currentOccupancy / a.capacity - b.currentOccupancy / b.capacity)[0];
      return best ? { zone: best, route: 'Follow illuminated EXIT signs. Emergency exits open automatically.', time: '2 min walk' } : null;
    }
    if (lower.includes('accessible') || lower.includes('sensory')) {
      const acc = zones.find((z) => z.type === 'accessibility');
      return acc ? { zone: acc, route: 'Sensory Room is at Level 1, near Gate B. Elevator access available from all levels.', time: '5 min walk' } : null;
    }
    return { zone: null, route: 'Follow the stadium wayfinding signs. Ask any volunteer for assistance.', time: '~5 min' };
  }, [selectedDest, zones]);

  return (
    <main className="page" id="main-content" role="main">
      <header className="page-header">
        <h1 className="page-title">🧭 {t('wayfinding', language)}</h1>
        <p className="page-subtitle">Navigate the stadium with AI assistance</p>
      </header>

      {/* Search */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label htmlFor="wayfinding-search" className="sr-only">Search for a zone or facility</label>
        <input
          id="wayfinding-search"
          type="search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search sections, facilities..."
          aria-label="Search stadium zones and facilities"
          maxLength={200}
          autoComplete="off"
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-bg-input)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--color-text-primary)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
        />
      </div>

      {/* Search Results */}
      {search && matchedZones.length > 0 && (
        <section aria-label="Search results" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>
            Results ({matchedZones.length})
          </h2>
          {matchedZones.map((z) => (
            <div key={z.id} className="glass-card-flat" style={{ marginBottom: 'var(--space-sm)', padding: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{z.name}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                Level {z.level} • {z.type} • {z.accessibleRoute ? '♿ Accessible' : ''}
              </p>
              <span className={`density-badge density-${z.density}`} style={{ marginTop: '4px' }}>
                {z.density} density
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Direction Result */}
      {directionInfo && (
        <section
          className="glass-card"
          style={{ marginBottom: 'var(--space-lg)', borderLeft: '4px solid var(--color-accent-primary)' }}
          aria-label="Navigation directions"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-sm)' }}>
            <h2 className="section-title">📍 Directions</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDest(null)} aria-label="Close directions">✕</button>
          </div>
          {directionInfo.zone && (
            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>
              {directionInfo.zone.name}
            </div>
          )}
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
            {directionInfo.route}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)' }}>🕐 {directionInfo.time}</span>
            {directionInfo.zone?.accessibleRoute && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-green)' }}>♿ Accessible</span>
            )}
          </div>
        </section>
      )}

      {/* Quick Destinations */}
      <section aria-label="Quick navigation destinations">
        <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>
          Quick Navigate
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {DESTINATIONS.map((d) => (
            <button
              key={d.label}
              className="glass-card-flat"
              onClick={() => getDirections(d.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-md)',
                cursor: 'pointer',
                border: selectedDest === d.label ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-glass)',
                background: selectedDest === d.label ? 'rgba(102,126,234,0.08)' : 'var(--color-bg-card)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                textAlign: 'left',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)',
              }}
              aria-label={`Navigate to ${d.label}: ${d.desc}`}
              aria-pressed={selectedDest === d.label}
            >
              <span style={{ fontSize: '1.5rem' }} aria-hidden="true">{d.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{d.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default memo(Wayfinding);
