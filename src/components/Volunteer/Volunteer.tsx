/**
 * @fileoverview Volunteer Dashboard — task management and coordination.
 */

import { memo, useMemo, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/utils/i18n';
import type { VolunteerTask } from '@/types';

/** Priority badge colors. */
function priorityStyle(p: VolunteerTask['priority']) {
  switch (p) {
    case 'high': return { bg: 'rgba(248,113,113,0.15)', color: 'var(--color-accent-red)' };
    case 'medium': return { bg: 'rgba(251,191,36,0.15)', color: 'var(--color-accent-yellow)' };
    case 'low': return { bg: 'rgba(52,211,153,0.15)', color: 'var(--color-accent-green)' };
  }
}

/** Status icon. */
function statusIcon(s: VolunteerTask['status']) {
  switch (s) {
    case 'pending': return '⏳';
    case 'in-progress': return '🔄';
    case 'completed': return '✅';
  }
}

function VolunteerDashboard() {
  const { state, dispatch } = useApp();
  const { volunteerTasks, language } = state;

  const stats = useMemo(() => ({
    pending: volunteerTasks.filter((t) => t.status === 'pending').length,
    inProgress: volunteerTasks.filter((t) => t.status === 'in-progress').length,
    completed: volunteerTasks.filter((t) => t.status === 'completed').length,
  }), [volunteerTasks]);

  const updateStatus = useCallback(
    (id: string, status: VolunteerTask['status']) => {
      dispatch({ type: 'UPDATE_TASK_STATUS', payload: { id, status } });
    },
    [dispatch],
  );

  const sortedTasks = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const statusOrder = { pending: 0, 'in-progress': 1, completed: 2 };
    return [...volunteerTasks].sort((a, b) => {
      const sd = statusOrder[a.status] - statusOrder[b.status];
      if (sd !== 0) return sd;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [volunteerTasks]);

  return (
    <main className="page" id="main-content" role="main">
      <header className="page-header">
        <h1 className="page-title">📋 {t('volunteer', language)}</h1>
        <p className="page-subtitle">Manage tasks and coordinate with your team</p>
      </header>

      {/* Stats */}
      <div className="stat-grid" aria-label="Volunteer task statistics">
        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: 'var(--color-accent-yellow)' }}>{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: 'var(--color-accent-cyan)' }}>{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: 'var(--color-accent-green)' }}>{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Task list */}
      <section aria-label="Volunteer tasks">
        <h2 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>
          Tasks ({volunteerTasks.length})
        </h2>
        {sortedTasks.map((task) => {
          const ps = priorityStyle(task.priority);
          return (
            <article
              key={task.id}
              className="glass-card-flat"
              style={{
                marginBottom: 'var(--space-sm)',
                padding: 'var(--space-md)',
                opacity: task.status === 'completed' ? 0.6 : 1,
              }}
              aria-label={`Task: ${task.title}, Priority: ${task.priority}, Status: ${task.status}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {statusIcon(task.status)} {task.title}
                </h3>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  background: ps.bg,
                  color: ps.color,
                }}>
                  {task.priority}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                {task.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span>👤 {task.assignedTo}</span>
                <span>📍 {task.zone}</span>
              </div>

              {task.status !== 'completed' && (
                <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)' }}>
                  {task.status === 'pending' && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => updateStatus(task.id, 'in-progress')}
                      aria-label={`Start task: ${task.title}`}
                    >
                      ▶ Start
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => updateStatus(task.id, 'completed')}
                      aria-label={`Complete task: ${task.title}`}
                    >
                      ✓ Complete
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default memo(VolunteerDashboard);
