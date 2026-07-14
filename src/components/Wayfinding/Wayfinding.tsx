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

  const clearDirections = useCallback(() => {
    setSelectedDest(null);
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
    return { zone: null, route: 'Follow the stadium wayfinding signs. Ask a volunteer for assistance.', time: '~5 min' };
  }, [selectedDest, zones]);

  return (
    <main className="page" id="main-content" role="main">
      <header className="page-header">
        <h1 className="page-title">🧭 {t('wayfinding', language)}</h1>
        <p className="page-subtitle">Navigate the stadium with AI assistance</p>
      </header>

      {/* Search */}
      <div className="section-mb">
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
          className="form-input"
        />
      </div>

      {/* Search Results */}
      {search && matchedZones.length > 0 && (
        <section aria-label="Search results" className="section-mb">
          <h2 className="section-title section-title-mb">Results ({matchedZones.length})</h2>
          {matchedZones.map((z) => (
            <div key={z.id} className="glass-card-flat alert-card" style={{ padding: 'var(--space-md)' }}>
              <h3 className="search-result-title">{z.name}</h3>
              <p className="search-result-meta">
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
        <section className="glass-card section-mb border-left-primary" aria-label="Navigation directions">
          <div className="directions-header">
            <h2 className="section-title">📍 Directions</h2>
            <button className="btn btn-secondary btn-sm" onClick={clearDirections} aria-label="Close directions">✕</button>
          </div>
          {directionInfo.zone && (
            <div className="directions-zone">{directionInfo.zone.name}</div>
          )}
          <p className="directions-route">{directionInfo.route}</p>
          <div className="directions-meta">
            <span className="meta-time">🕐 {directionInfo.time}</span>
            {directionInfo.zone?.accessibleRoute && (
              <span className="meta-accessible">♿ Accessible</span>
            )}
          </div>
        </section>
      )}

      {/* Quick Destinations */}
      <section aria-label="Quick navigation destinations">
        <h2 className="section-title section-title-mb">Quick Navigate</h2>
        <div className="dest-list">
          {DESTINATIONS.map((d) => (
            <button
              key={d.label}
              className={`dest-btn ${selectedDest === d.label ? 'dest-btn--active' : ''}`}
              onClick={() => getDirections(d.label)}
              aria-label={`Navigate to ${d.label}: ${d.desc}`}
              aria-pressed={selectedDest === d.label}
            >
              <span className="dest-icon" aria-hidden="true">{d.icon}</span>
              <div>
                <div className="dest-title">{d.label}</div>
                <div className="dest-desc">{d.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default memo(Wayfinding);
