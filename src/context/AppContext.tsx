/**
 * @fileoverview Global application state management using React Context + useReducer.
 * Provides type-safe state and dispatch to all components.
 */

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, AppAction } from '@/types';
import { Page, UserRole, Language, CrowdDensity } from '@/types';
import {
  matchInfo,
  stadiumZones,
  transportOptions,
  emergencyAlerts,
  volunteerTasks,
  sustainabilityMetrics,
} from '@/services/stadiumData';

/** Initial application state. */
const initialState: AppState = {
  currentPage: Page.Dashboard,
  userRole: UserRole.Fan,
  language: Language.English,
  match: matchInfo,
  zones: stadiumZones,
  transport: transportOptions,
  emergencies: emergencyAlerts,
  volunteerTasks: volunteerTasks,
  sustainability: sustainabilityMetrics,
  chatMessages: [],
  isAILoading: false,
  highContrastMode: false,
};

/**
 * Pure reducer function for state transitions.
 * Each action type handles a specific state update immutably.
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'SET_ROLE':
      return { ...state, userRole: action.payload };

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };

    case 'SET_AI_LOADING':
      return { ...state, isAILoading: action.payload };

    case 'UPDATE_ZONE_OCCUPANCY':
      return {
        ...state,
        zones: state.zones.map((z) => {
          if (z.id !== action.payload.id) return z;
          const occupancy = action.payload.occupancy;
          const ratio = occupancy / z.capacity;
          const density =
            ratio > 0.9
              ? CrowdDensity.Critical
              : ratio > 0.7
                ? CrowdDensity.High
                : ratio > 0.4
                  ? CrowdDensity.Moderate
                  : CrowdDensity.Low;
          return { ...z, currentOccupancy: occupancy, density };
        }),
      };

    case 'ADD_EMERGENCY':
      return { ...state, emergencies: [...state.emergencies, action.payload] };

    case 'RESOLVE_EMERGENCY':
      return {
        ...state,
        emergencies: state.emergencies.map((e) =>
          e.id === action.payload ? { ...e, resolved: true } : e,
        ),
      };

    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        volunteerTasks: state.volunteerTasks.map((t) =>
          t.id === action.payload.id ? { ...t, status: action.payload.status } : t,
        ),
      };

    case 'TOGGLE_HIGH_CONTRAST':
      return { ...state, highContrastMode: !state.highContrastMode };

    default:
      return state;
  }
}

/** Context type with both state and dispatch. */
interface AppContextType {
  readonly state: AppState;
  readonly dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

/**
 * Provider component that wraps the app with global state.
 * @param children - Child components.
 */
export function AppProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook to access global state and dispatch.
 * @throws Error if used outside AppProvider.
 * @returns The state and dispatch function.
 */
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
