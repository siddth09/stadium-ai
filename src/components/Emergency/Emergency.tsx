/**
 * @fileoverview Emergency — incident reporting and emergency response.
 */

import { memo, useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { EmergencySeverity, type EmergencyAlert } from '@/types';
import { t } from '@/utils/i18n';
import { sanitizeInput } from '@/utils/sanitize';
import { validateInput, emergencyReportSchema } from '@/utils/validation';
import { LiveRegion } from '@/components/common/Accessibility';

/** Emergency type options with icons. */
const EMERGENCY_TYPES = [
  { value: 'medical', icon: '🏥', label: 'Medical' },
  { value: 'security', icon: '👮', label: 'Security' },
  { value: 'fire', icon: '🔥', label: 'Fire' },
  { value: 'weather', icon: '⛈️', label: 'Weather' },
  { value: 'evacuation', icon: '🚪', label: 'Evacuation' },
] as const;

/** Maps alert severity to a border color class. */
function severityBorderClass(severity: string): string {
  switch (severity) {
    case 'critical': return 'border-left-red';
    case 'urgent': return 'border-left-yellow';
    case 'warning': return 'border-left-yellow';
    default: return 'border-left-primary';
  }
}

/** Maps alert severity to a density badge class for visual consistency. */
function severityBadgeClass(severity: string): string {
  switch (severity) {
    case 'critical': return 'density-critical';
    case 'urgent': return 'density-high';
    default: return 'density-moderate';
  }
}

function Emergency() {
  const { state, dispatch } = useApp();
  const { emergencies, zones, language } = state;
  const [reportType, setReportType] = useState<EmergencyAlert['type']>('medical');
  const [reportMessage, setReportMessage] = useState('');
  const [reportZone, setReportZone] = useState(zones[0]?.id ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const sanitized = sanitizeInput(reportMessage);
      const validation = validateInput(emergencyReportSchema, {
        type: reportType,
        message: sanitized,
        zone: reportZone,
      });

      if (!validation.success) {
        setErrors(validation.errors);
        return;
      }

      const alert: EmergencyAlert = {
        id: `em-${Date.now()}`,
        type: reportType,
        severity: EmergencySeverity.Urgent,
        message: sanitized,
        zone: reportZone,
        timestamp: Date.now(),
        resolved: false,
      };

      dispatch({ type: 'ADD_EMERGENCY', payload: alert });
      setSubmitted(true);
      setReportMessage('');
      setErrors([]);
      setAnnouncement('Emergency report submitted successfully. Help is on the way.');
      setTimeout(() => setSubmitted(false), 5000);
    },
    [reportType, reportMessage, reportZone, dispatch],
  );

  const resolveAlert = useCallback(
    (id: string) => dispatch({ type: 'RESOLVE_EMERGENCY', payload: id }),
    [dispatch],
  );

  const activeAlerts = emergencies.filter((e) => !e.resolved);
  const resolvedAlerts = emergencies.filter((e) => e.resolved);

  return (
    <main className="page" id="main-content" role="main">
      <LiveRegion message={announcement} politeness="assertive" />

      <header className="page-header">
        <h1 className="page-title">🚨 {t('emergency', language)}</h1>
        <p className="page-subtitle">Report incidents & view emergency alerts</p>
      </header>

      {/* Emergency contacts */}
      <section className="glass-card emergency-banner border-left-red section-mb" aria-label="Emergency contacts">
        <h2 className="emergency-contacts-title">📞 Emergency Contacts</h2>
        <div className="emergency-contacts-list">
          <div><strong>911</strong> — Local Emergency Services</div>
          <div><strong>Text HELP → 82650</strong> — Stadium Security</div>
          <div><strong>Gate Info Desk</strong> — Any gate entrance</div>
        </div>
      </section>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <section aria-label="Active emergency alerts" className="section-mb">
          <h2 className="section-title section-title-mb">⚠️ Active Alerts ({activeAlerts.length})</h2>
          {activeAlerts.map((alert) => (
            <article
              key={alert.id}
              className={`glass-card-flat alert-card ${severityBorderClass(alert.severity)}`}
              role="alert"
              style={{ padding: 'var(--space-md)' }}
            >
              <div className="alert-header-row">
                <h3 className="alert-title">
                  {EMERGENCY_TYPES.find((et) => et.value === alert.type)?.icon} {alert.type.toUpperCase()}
                </h3>
                <span className={`density-badge ${severityBadgeClass(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
              <p className="alert-body" style={{ marginBottom: 'var(--space-sm)' }}>{alert.message}</p>
              <div className="alert-footer">
                <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => resolveAlert(alert.id)}
                  aria-label={`Mark ${alert.type} alert as resolved`}
                >
                  ✓ Resolve
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Report Form */}
      <section aria-label="Report an emergency" className="section-mb">
        <h2 className="section-title section-title-mb">📝 {t('reportEmergency', language)}</h2>

        {submitted && (
          <div className="glass-card-flat border-left-green" role="alert" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-md)' }}>
            ✅ Report submitted! Help is being dispatched.
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card-flat" style={{ padding: 'var(--space-lg)' }}>
          {/* Type */}
          <fieldset className="form-fieldset">
            <legend className="form-legend">Type of Emergency</legend>
            <div className="btn-row">
              {EMERGENCY_TYPES.map((et) => (
                <button
                  key={et.value}
                  type="button"
                  className={`btn btn-sm ${reportType === et.value ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setReportType(et.value)}
                  aria-pressed={reportType === et.value}
                >
                  {et.icon} {et.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Zone */}
          <div className="form-group">
            <label htmlFor="em-zone" className="form-label">Zone / Location</label>
            <select
              id="em-zone"
              value={reportZone}
              onChange={(e) => setReportZone(e.target.value)}
              aria-label="Select the zone where the emergency occurred"
              className="form-select"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="em-msg" className="form-label">Description</label>
            <textarea
              id="em-msg"
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              placeholder="Describe what happened..."
              maxLength={500}
              rows={3}
              aria-label="Describe the emergency situation"
              className="form-textarea"
            />
          </div>

          {errors.length > 0 && (
            <div role="alert" className="form-error">
              {errors.map((err, i) => <p key={i}>⚠️ {err}</p>)}
            </div>
          )}

          <button type="submit" className="btn btn-danger w-full">
            🚨 Submit Emergency Report
          </button>
        </form>
      </section>

      {resolvedAlerts.length > 0 && (
        <section aria-label="Resolved alerts">
          <h2 className="section-title section-title-mb resolved-title">✅ Resolved ({resolvedAlerts.length})</h2>
          {resolvedAlerts.map((alert) => (
            <div key={alert.id} className="glass-card-flat alert-card resolved-card" style={{ padding: 'var(--space-md)' }}>
              <div className="resolved-text">{alert.message}</div>
              <div className="resolved-meta">Resolved • {new Date(alert.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default memo(Emergency);
