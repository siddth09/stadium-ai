/**
 * @fileoverview Dashboard — main overview page showing match info,
 * stadium stats, crowd heatmap summary, and quick actions.
 */

import { memo, useMemo, useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, CrowdDensity } from '@/types';
import { t } from '@/utils/i18n';
import { getAIResponse } from '@/services/aiService';
import DOMPurify from 'dompurify';

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

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useCallback(async () => {
    setIsGenerating(true);
    try {
      const prompt = "Generate a short, bulleted Operational Intelligence report for stadium staff based on current crowd densities and emergencies. Provide 3 actionable real-time decisions to optimize flow and safety.";
      const report = await getAIResponse(prompt, state, language);
      setAiReport(DOMPurify.sanitize(report.replace(/\n/g, '<br/>')));
    } catch (_err) {
      setAiReport("Failed to generate operational report.");
    } finally {
      setIsGenerating(false);
    }
  }, [state, language]);

  const navigateTo = useCallback(
    (page: Page) => dispatch({ type: 'SET_PAGE', payload: page }),
    [dispatch],
  );

  return (
    <main className="page" id="main-content" role="main">
      <header className="page-header">
        <h1 className="page-title">⚽ {t('dashboard', language)}</h1>
        <p className="page-subtitle">FIFA World Cup 2026 — Live Operations</p>
      </header>

      {/* Match Banner */}
      <section className="glass-card match-banner" aria-label="Current match information">
        <div className="match-venue">🏟️ {match.venue}</div>
        <div className="match-score-row">
          <div className="match-team">{match.teamA}</div>
          <div className="match-score" aria-label={`Score: ${match.score.home} to ${match.score.away}`}>
            {match.score.home} — {match.score.away}
          </div>
          <div className="match-team">{match.teamB}</div>
        </div>
        <div className={`match-status ${match.status === 'live' ? 'match-status--live' : 'match-status--default'}`} aria-live="polite">
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
        <section aria-label="Active emergency alerts" className="section-mb">
          <h2 className="section-title section-title-mb">🚨 Active Alerts</h2>
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`glass-card-flat alert-card ${alert.severity === 'critical' ? 'border-left-red' : 'border-left-yellow'}`}
              role="alert"
            >
              <div className="alert-header">
                {alert.type === 'weather' ? '⛈️' : '🏥'} {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} — {alert.severity.toUpperCase()}
              </div>
              <p className="alert-body">{alert.message}</p>
            </div>
          ))}
        </section>
      )}

      {/* Crowd Heatmap Summary */}
      <section aria-label="Crowd density overview" className="section-mb">
        <h2 className="section-title section-title-mb">👥 Zone Density</h2>
        <div className="glass-card-flat">
          {zoneSummary.critical > 0 && (
            <p style={{ color: 'var(--color-accent-red)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>
              ⚠️ {zoneSummary.critical} zone(s) at critical capacity
            </p>
          )}
          <div className="zone-list">
            {zones.slice(0, 6).map((zone) => {
              const info = densityInfo(zone.density, language);
              const pct = Math.round((zone.currentOccupancy / zone.capacity) * 100);
              return (
                <div key={zone.id} className="zone-row">
                  <div className="zone-row__info">
                    <div className="zone-row__name">{zone.name}</div>
                    <div
                      className="zone-row__bar"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${zone.name}: ${pct}% capacity`}
                    >
                      <div
                        className="zone-row__fill"
                        style={{ width: `${pct}%`, background: `var(--color-density-${zone.density})` }}
                      />
                    </div>
                  </div>
                  <span className={`density-badge ${info.cls}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
          <button
            className="btn btn-secondary btn-sm w-full"
            style={{ marginTop: 'var(--space-md)' }}
            onClick={() => navigateTo(Page.Crowd)}
            aria-label="View full crowd management dashboard"
          >
            View All Zones →
          </button>
        </div>
      </section>

      {/* AI Operational Intelligence */}
      <section aria-label="Operational Intelligence" className="section-mb">
        <h2 className="section-title section-title-mb">🧠 AI Operational Intelligence</h2>
        <div className="glass-card-flat border-left-purple">
          <p className="ai-report-desc">
            Generate a real-time decision support report based on live stadium data.
          </p>
          <button
            className="btn btn-primary"
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? 'Analyzing live data...' : 'Generate Live Report'}
          </button>

          {aiReport && (
            <div
              className="ai-report-output"
              dangerouslySetInnerHTML={{ __html: aiReport }}
            />
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <h2 className="section-title section-title-mb">⚡ Quick Actions</h2>
        <div className="action-grid">
          {[
            { icon: '🤖', label: t('assistant', language), page: Page.Assistant },
            { icon: '🧭', label: t('wayfinding', language), page: Page.Wayfinding },
            { icon: '🚗', label: t('transport', language), page: Page.Transport },
            { icon: '🚨', label: t('emergency', language), page: Page.Emergency },
          ].map((action) => (
            <button
              key={action.page}
              className="action-btn"
              onClick={() => navigateTo(action.page)}
              aria-label={`Go to ${action.label}`}
            >
              <span aria-hidden="true" className="action-icon">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default memo(Dashboard);
