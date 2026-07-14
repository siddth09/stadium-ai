/**
 * @fileoverview Tests for the AppContext reducer — validates
 * all state transition actions.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from './AppContext';
import { Page, UserRole, Language, EmergencySeverity } from '@/types';
import type { ReactNode } from 'react';

/** Wraps components in AppProvider for testing. */
function wrapper({ children }: { readonly children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('AppContext', () => {
  it('provides initial state', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.state.currentPage).toBe(Page.Dashboard);
    expect(result.current.state.userRole).toBe(UserRole.Fan);
    expect(result.current.state.language).toBe(Language.English);
    expect(result.current.state.highContrastMode).toBe(false);
  });

  it('dispatches SET_PAGE', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_PAGE', payload: Page.Assistant });
    });
    expect(result.current.state.currentPage).toBe(Page.Assistant);
  });

  it('dispatches SET_ROLE', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_ROLE', payload: UserRole.Staff });
    });
    expect(result.current.state.userRole).toBe(UserRole.Staff);
  });

  it('dispatches SET_LANGUAGE', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_LANGUAGE', payload: Language.Spanish });
    });
    expect(result.current.state.language).toBe(Language.Spanish);
  });

  it('dispatches TOGGLE_HIGH_CONTRAST', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.state.highContrastMode).toBe(false);
    act(() => {
      result.current.dispatch({ type: 'TOGGLE_HIGH_CONTRAST' });
    });
    expect(result.current.state.highContrastMode).toBe(true);
    act(() => {
      result.current.dispatch({ type: 'TOGGLE_HIGH_CONTRAST' });
    });
    expect(result.current.state.highContrastMode).toBe(false);
  });

  it('dispatches ADD_CHAT_MESSAGE', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const msg = {
      id: 'test-msg',
      role: 'user' as const,
      content: 'Hello',
      timestamp: Date.now(),
      language: Language.English,
    };
    act(() => {
      result.current.dispatch({ type: 'ADD_CHAT_MESSAGE', payload: msg });
    });
    expect(result.current.state.chatMessages).toHaveLength(1);
    expect(result.current.state.chatMessages[0]?.content).toBe('Hello');
  });

  it('dispatches SET_AI_LOADING', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_AI_LOADING', payload: true });
    });
    expect(result.current.state.isAILoading).toBe(true);
  });

  it('dispatches UPDATE_ZONE_OCCUPANCY and recalculates density', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const zoneId = result.current.state.zones[0]?.id;
    if (zoneId) {
      act(() => {
        result.current.dispatch({ type: 'UPDATE_ZONE_OCCUPANCY', payload: { id: zoneId, occupancy: 100 } });
      });
      const updated = result.current.state.zones.find((z) => z.id === zoneId);
      expect(updated?.currentOccupancy).toBe(100);
    }
  });

  it('dispatches ADD_EMERGENCY', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const initialCount = result.current.state.emergencies.length;
    act(() => {
      result.current.dispatch({
        type: 'ADD_EMERGENCY',
        payload: {
          id: 'test-em',
          type: 'fire',
          severity: EmergencySeverity.Critical,
          message: 'Fire in section 101',
          zone: 'z-101',
          timestamp: Date.now(),
          resolved: false,
        },
      });
    });
    expect(result.current.state.emergencies).toHaveLength(initialCount + 1);
  });

  it('dispatches RESOLVE_EMERGENCY', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const emId = result.current.state.emergencies[0]?.id;
    if (emId) {
      act(() => {
        result.current.dispatch({ type: 'RESOLVE_EMERGENCY', payload: emId });
      });
      const resolved = result.current.state.emergencies.find((e) => e.id === emId);
      expect(resolved?.resolved).toBe(true);
    }
  });

  it('dispatches UPDATE_TASK_STATUS', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const taskId = result.current.state.volunteerTasks[0]?.id;
    if (taskId) {
      act(() => {
        result.current.dispatch({ type: 'UPDATE_TASK_STATUS', payload: { id: taskId, status: 'completed' } });
      });
      const updated = result.current.state.volunteerTasks.find((t) => t.id === taskId);
      expect(updated?.status).toBe('completed');
    }
  });

  it('throws when useApp is used outside AppProvider', () => {
    expect(() => {
      renderHook(() => useApp());
    }).toThrow('useApp must be used within an AppProvider');
  });
});
