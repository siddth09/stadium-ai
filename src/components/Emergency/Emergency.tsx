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

/** Emergency type options. */
const EMERGENCY_TYPES = [
  { value: 'medical', icon: '🏥', label: 'Medical' },
  { value: 'security', icon: '👮', label: 'Security' },
  { value: 'fire', icon: '🔥', label: 'Fire' },
  { value: 'weather', icon: '⛈️', label: 'Weather' },
  { value: 'evacuation', icon: '🚪', label: 'Evacuation' },
] as const;

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
      <section
        className="glass-card"
        style={{
          marginBottom: 'var(--space-lg)',
          background: 'linear-gradient(135deg, rgba(248,113,113,0.1), rgba(251,146,60,0.1))',
          borderLeft: '4px solid var(--color-accent-red)',
        }}
        aria-label="Emergency contacts"
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>📞 Emergency Contacts</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem' }}>
          <div><strong>911</strong> — Local Emergency Services</div>
          <div><strong>Text HELP → 82650</strong> — Stadium Security</div>
          <div><strong>Gate Info Desk</strong> — Any gate entrance</div>
        </div>
      </section>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <section aria-label="Active emergency alerts" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>
            ⚠️ Active Alerts ({activeAlerts.length})
          </h2>
          {activeAlerts.map((alert) => (
            <article
              key={alert.id}
              className="glass-card-flat"
              role="alert"
              style={{
                marginBottom: 'var(--space-sm)',
                padding: 'var(--space-md)',
                borderLeft: `4px solid ${
                  alert.severity === 'critical' ? 'var(--color-accent-red)' :
                  alert.severity === 'urgent' ? 'var(--color-accent-orange)' :
                  alert.severity === 'warning' ? 'var(--color-accent-yellow)' :
                  'var(--color-accent-cyan)'
                }`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {EMERGENCY_TYPES.find((t) => t.value === alert.type)?.icon} {alert.type.toUpperCase()}
                </h3>
                <span className={`density-badge density-${alert.severity === 'critical' ? 'critical' : alert.severity === 'urgent' ? 'high' : 'moderate'}`}>
                  {alert.severity}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                {alert.message}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => dispatch({ type: 'RESOLVE_EMERGENCY', payload: alert.id })}
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
      <section aria-label="Report an emergency" style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>
          📝 {t('reportEmergency', language)}
        </h2>

        {submitted && (
          <div
            className="glass-card-flat"
            role="alert"
            style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-md)', borderLeft: '4px solid var(--color-accent-green)' }}
          >
            ✅ Report submitted! Help is being dispatched.
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card-flat" style={{ padding: 'var(--space-lg)' }}>
          {/* Type */}
          <fieldset style={{ border: 'none', marginBottom: 'var(--space-md)' }}>
            <legend style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
              Type of Emergency
            </legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
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
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="em-zone" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
              Zone / Location
            </label>
            <select
              id="em-zone"
              value={reportZone}
              onChange={(e) => setReportZone(e.target.value)}
              aria-label="Select the zone where the emergency occurred"
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                background: 'var(--color-bg-input)',
                border: '1px solid var(--color-border-glass)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
              }}
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="em-msg" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              id="em-msg"
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              placeholder="Describe what happened..."
              maxLength={500}
              rows={3}
              aria-label="Describe the emergency situation"
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                background: 'var(--color-bg-input)',
                border: '1px solid var(--color-border-glass)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                resize: 'vertical',
              }}
            />
          </div>

          {errors.length > 0 && (
            <div role="alert" style={{ color: 'var(--color-accent-red)', fontSize: '0.8125rem', marginBottom: 'var(--space-sm)' }}>
              {errors.map((e, i) => <p key={i}>⚠️ {e}</p>)}
            </div>
          )}

          <button type="submit" className="btn btn-danger" style={{ width: '100%' }}>
            🚨 Submit Emergency Report
          </button>
        </form>
      </section>

      {resolvedAlerts.length > 0 && (
        <section aria-label="Resolved alerts">
          <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-text-muted)' }}>
            ✅ Resolved ({resolvedAlerts.length})
          </h2>
          {resolvedAlerts.map((alert) => (
            <div key={alert.id} className="glass-card-flat" style={{ marginBottom: 'var(--space-sm)', padding: 'var(--space-md)', opacity: 0.6 }}>
              <div style={{ fontSize: '0.8125rem' }}>{alert.message}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Resolved • {new Date(alert.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default memo(Emergency);
