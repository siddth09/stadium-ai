/**
 * @fileoverview Core type definitions for StadiumAI.
 * All shared interfaces and enums used throughout the application.
 */

/* ------------------------------------------------------------------ */
/*  Enums                                                              */
/* ------------------------------------------------------------------ */

/** User persona roles within the stadium ecosystem. */
export enum UserRole {
  Fan = 'fan',
  Staff = 'staff',
  Volunteer = 'volunteer',
  Organizer = 'organizer',
}

/** Supported languages for multilingual assistance. */
export enum Language {
  English = 'en',
  Spanish = 'es',
  French = 'fr',
  Arabic = 'ar',
  Portuguese = 'pt',
  German = 'de',
  Japanese = 'ja',
  Korean = 'ko',
  Chinese = 'zh',
  Hindi = 'hi',
  Russian = 'ru',
  Dutch = 'nl',
}

/** Crowd density levels for zone monitoring. */
export enum CrowdDensity {
  Low = 'low',
  Moderate = 'moderate',
  High = 'high',
  Critical = 'critical',
}

/** Emergency severity levels. */
export enum EmergencySeverity {
  Info = 'info',
  Warning = 'warning',
  Urgent = 'urgent',
  Critical = 'critical',
}

/** Navigation page identifiers. */
export enum Page {
  Dashboard = 'dashboard',
  Assistant = 'assistant',
  Crowd = 'crowd',
  Wayfinding = 'wayfinding',
  Transport = 'transport',
  Sustainability = 'sustainability',
  Emergency = 'emergency',
  Volunteer = 'volunteer',
}

/* ------------------------------------------------------------------ */
/*  Data Models                                                        */
/* ------------------------------------------------------------------ */

/** A geographic coordinate within the stadium. */
export interface Coordinate {
  readonly lat: number;
  readonly lng: number;
}

/** A named zone within the stadium venue. */
export interface StadiumZone {
  readonly id: string;
  readonly name: string;
  readonly type: 'seating' | 'concourse' | 'food' | 'restroom' | 'exit' | 'medical' | 'vip' | 'accessibility';
  readonly level: number;
  readonly capacity: number;
  readonly currentOccupancy: number;
  readonly density: CrowdDensity;
  readonly coordinate: Coordinate;
  readonly accessibleRoute: boolean;
}

/** A transportation option available to fans. */
export interface TransportOption {
  readonly id: string;
  readonly type: 'metro' | 'bus' | 'shuttle' | 'parking' | 'rideshare' | 'walking';
  readonly name: string;
  readonly estimatedTime: number;
  readonly availableCapacity: number;
  readonly status: 'available' | 'limited' | 'full';
  readonly carbonEmission: number;
}

/** A single chat message in the AI assistant. */
export interface ChatMessage {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly timestamp: number;
  readonly language: Language;
}

/** An emergency alert or incident report. */
export interface EmergencyAlert {
  readonly id: string;
  readonly type: 'medical' | 'security' | 'weather' | 'evacuation' | 'fire';
  readonly severity: EmergencySeverity;
  readonly message: string;
  readonly zone: string;
  readonly timestamp: number;
  readonly resolved: boolean;
}

/** A volunteer task assignment. */
export interface VolunteerTask {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly zone: string;
  readonly priority: 'low' | 'medium' | 'high';
  readonly status: 'pending' | 'in-progress' | 'completed';
  readonly assignedTo: string;
  readonly dueTime: number;
}

/** Sustainability metrics for the venue. */
export interface SustainabilityMetrics {
  readonly carbonFootprint: number;
  readonly wasteRecycled: number;
  readonly waterUsage: number;
  readonly energyConsumption: number;
  readonly renewablePercentage: number;
  readonly targetCarbon: number;
  readonly targetRecycling: number;
}

/** Match information for the current event. */
export interface MatchInfo {
  readonly id: string;
  readonly teamA: string;
  readonly teamB: string;
  readonly venue: string;
  readonly kickoff: string;
  readonly status: 'upcoming' | 'live' | 'halftime' | 'completed';
  readonly score: { readonly home: number; readonly away: number };
  readonly attendance: number;
  readonly capacity: number;
}

/* ------------------------------------------------------------------ */
/*  Application State                                                  */
/* ------------------------------------------------------------------ */

/** Global application state shape. */
export interface AppState {
  readonly currentPage: Page;
  readonly userRole: UserRole;
  readonly language: Language;
  readonly match: MatchInfo;
  readonly zones: readonly StadiumZone[];
  readonly transport: readonly TransportOption[];
  readonly emergencies: readonly EmergencyAlert[];
  readonly volunteerTasks: readonly VolunteerTask[];
  readonly sustainability: SustainabilityMetrics;
  readonly chatMessages: readonly ChatMessage[];
  readonly isAILoading: boolean;
  readonly highContrastMode: boolean;
}

/** Discriminated union of all dispatch actions. */
export type AppAction =
  | { readonly type: 'SET_PAGE'; readonly payload: Page }
  | { readonly type: 'SET_ROLE'; readonly payload: UserRole }
  | { readonly type: 'SET_LANGUAGE'; readonly payload: Language }
  | { readonly type: 'ADD_CHAT_MESSAGE'; readonly payload: ChatMessage }
  | { readonly type: 'SET_AI_LOADING'; readonly payload: boolean }
  | { readonly type: 'UPDATE_ZONE_OCCUPANCY'; readonly payload: { id: string; occupancy: number } }
  | { readonly type: 'ADD_EMERGENCY'; readonly payload: EmergencyAlert }
  | { readonly type: 'RESOLVE_EMERGENCY'; readonly payload: string }
  | { readonly type: 'UPDATE_TASK_STATUS'; readonly payload: { id: string; status: VolunteerTask['status'] } }
  | { readonly type: 'TOGGLE_HIGH_CONTRAST' };
