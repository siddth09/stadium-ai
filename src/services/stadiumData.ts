/**
 * @fileoverview Mock stadium data for FIFA World Cup 2026.
 * In production, this would come from real-time APIs.
 */

import {
  StadiumZone,
  TransportOption,
  EmergencyAlert,
  VolunteerTask,
  SustainabilityMetrics,
  MatchInfo,
  CrowdDensity,
  EmergencySeverity,
} from '@/types';

/** Current match information. */
export const matchInfo: MatchInfo = {
  id: 'match-001',
  teamA: '🇺🇸 United States',
  teamB: '🇧🇷 Brazil',
  venue: 'MetLife Stadium, New Jersey',
  kickoff: '2026-07-19T20:00:00-04:00',
  status: 'live',
  score: { home: 1, away: 2 },
  attendance: 78200,
  capacity: 82500,
};

/** Stadium zones with real-time occupancy data. */
export const stadiumZones: StadiumZone[] = [
  { id: 'z-101', name: 'Section 101 — Lower Bowl East', type: 'seating', level: 1, capacity: 2400, currentOccupancy: 2280, density: CrowdDensity.High, coordinate: { lat: 40.8135, lng: -74.0745 }, accessibleRoute: true },
  { id: 'z-201', name: 'Section 201 — Upper Deck North', type: 'seating', level: 2, capacity: 3200, currentOccupancy: 2100, density: CrowdDensity.Moderate, coordinate: { lat: 40.8140, lng: -74.0740 }, accessibleRoute: true },
  { id: 'z-vip', name: 'VIP Hospitality Lounge', type: 'vip', level: 3, capacity: 400, currentOccupancy: 320, density: CrowdDensity.Moderate, coordinate: { lat: 40.8138, lng: -74.0742 }, accessibleRoute: true },
  { id: 'z-fc1', name: 'Food Court — Gate A', type: 'food', level: 1, capacity: 500, currentOccupancy: 480, density: CrowdDensity.Critical, coordinate: { lat: 40.8132, lng: -74.0748 }, accessibleRoute: true },
  { id: 'z-fc2', name: 'Food Court — Gate C', type: 'food', level: 1, capacity: 500, currentOccupancy: 200, density: CrowdDensity.Low, coordinate: { lat: 40.8142, lng: -74.0738 }, accessibleRoute: true },
  { id: 'z-rr1', name: 'Restroom — Level 1 East', type: 'restroom', level: 1, capacity: 80, currentOccupancy: 75, density: CrowdDensity.High, coordinate: { lat: 40.8134, lng: -74.0746 }, accessibleRoute: true },
  { id: 'z-rr2', name: 'Restroom — Level 2 West', type: 'restroom', level: 2, capacity: 80, currentOccupancy: 30, density: CrowdDensity.Low, coordinate: { lat: 40.8139, lng: -74.0743 }, accessibleRoute: true },
  { id: 'z-exit-a', name: 'Exit A — East Side', type: 'exit', level: 1, capacity: 1000, currentOccupancy: 150, density: CrowdDensity.Low, coordinate: { lat: 40.8130, lng: -74.0750 }, accessibleRoute: true },
  { id: 'z-exit-b', name: 'Exit B — West Side', type: 'exit', level: 1, capacity: 1000, currentOccupancy: 600, density: CrowdDensity.Moderate, coordinate: { lat: 40.8145, lng: -74.0735 }, accessibleRoute: true },
  { id: 'z-med', name: 'Medical Station — Central', type: 'medical', level: 1, capacity: 30, currentOccupancy: 8, density: CrowdDensity.Low, coordinate: { lat: 40.8137, lng: -74.0743 }, accessibleRoute: true },
  { id: 'z-acc', name: 'Accessibility & Sensory Room', type: 'accessibility', level: 1, capacity: 50, currentOccupancy: 12, density: CrowdDensity.Low, coordinate: { lat: 40.8136, lng: -74.0744 }, accessibleRoute: true },
  { id: 'z-conc', name: 'Main Concourse', type: 'concourse', level: 1, capacity: 5000, currentOccupancy: 3800, density: CrowdDensity.High, coordinate: { lat: 40.8137, lng: -74.0742 }, accessibleRoute: true },
];

/** Available transport options. */
export const transportOptions: TransportOption[] = [
  { id: 't-metro', type: 'metro', name: 'NJ Transit — Meadowlands Rail', estimatedTime: 25, availableCapacity: 1200, status: 'available', carbonEmission: 0.02 },
  { id: 't-bus', type: 'bus', name: 'Express Bus — Port Authority', estimatedTime: 40, availableCapacity: 400, status: 'available', carbonEmission: 0.05 },
  { id: 't-shuttle', type: 'shuttle', name: 'Official FIFA Shuttle', estimatedTime: 15, availableCapacity: 80, status: 'limited', carbonEmission: 0.04 },
  { id: 't-park-a', type: 'parking', name: 'Lot A — East Premium', estimatedTime: 5, availableCapacity: 120, status: 'limited', carbonEmission: 0.15 },
  { id: 't-park-b', type: 'parking', name: 'Lot K — General', estimatedTime: 12, availableCapacity: 800, status: 'available', carbonEmission: 0.15 },
  { id: 't-ride', type: 'rideshare', name: 'Rideshare Pickup Zone', estimatedTime: 20, availableCapacity: 50, status: 'available', carbonEmission: 0.10 },
  { id: 't-walk', type: 'walking', name: 'Walking Path — Train Station', estimatedTime: 18, availableCapacity: 9999, status: 'available', carbonEmission: 0 },
];

/** Active emergency alerts. */
export const emergencyAlerts: EmergencyAlert[] = [
  { id: 'em-1', type: 'weather', severity: EmergencySeverity.Warning, message: 'Thunderstorm advisory: Lightning detected within 10 miles. Roof closure in progress.', zone: 'All Zones', timestamp: Date.now() - 600000, resolved: false },
  { id: 'em-2', type: 'medical', severity: EmergencySeverity.Info, message: 'Medical assistance dispatched to Section 101. Fan experiencing heat exhaustion.', zone: 'z-101', timestamp: Date.now() - 300000, resolved: false },
];

/** Volunteer task assignments. */
export const volunteerTasks: VolunteerTask[] = [
  { id: 'vt-1', title: 'Gate A Crowd Flow', description: 'Assist with crowd flow management at Gate A. Direct fans to less crowded food court at Gate C.', zone: 'z-fc1', priority: 'high', status: 'in-progress', assignedTo: 'Team Alpha', dueTime: Date.now() + 3600000 },
  { id: 'vt-2', title: 'Accessibility Escort', description: 'Escort wheelchair users from Lot A parking to accessible entrance via ramp route.', zone: 'z-acc', priority: 'high', status: 'pending', assignedTo: 'Team Bravo', dueTime: Date.now() + 1800000 },
  { id: 'vt-3', title: 'Recycling Station Monitor', description: 'Ensure fans sort waste correctly at Level 1 recycling stations. Provide guidance.', zone: 'z-conc', priority: 'medium', status: 'in-progress', assignedTo: 'Team Charlie', dueTime: Date.now() + 7200000 },
  { id: 'vt-4', title: 'Multilingual Info Desk', description: 'Staff the multilingual information desk. Handle queries in Spanish, French, and Portuguese.', zone: 'z-conc', priority: 'medium', status: 'pending', assignedTo: 'Team Delta', dueTime: Date.now() + 3600000 },
  { id: 'vt-5', title: 'Post-Match Exit Guidance', description: 'Guide fans to exit routes and transport zones after the match. Prioritize accessible exits.', zone: 'z-exit-a', priority: 'low', status: 'pending', assignedTo: 'Team Echo', dueTime: Date.now() + 10800000 },
];

/** Sustainability metrics for the venue. */
export const sustainabilityMetrics: SustainabilityMetrics = {
  carbonFootprint: 42.5,
  wasteRecycled: 68,
  waterUsage: 125000,
  energyConsumption: 8500,
  renewablePercentage: 72,
  targetCarbon: 50,
  targetRecycling: 75,
};
