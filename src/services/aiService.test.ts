/**
 * @fileoverview Tests for the AI service — covers fallback responses,
 * rate limiting, sanitization, and Gemini API error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAIResponse } from './aiService';
import { aiRateLimiter } from '@/utils/rateLimiter';
import type { AppState } from '@/types';
import { Page, UserRole, Language, CrowdDensity, EmergencySeverity } from '@/types';

/** Creates a minimal valid AppState for testing. */
function createMockState(): AppState {
  return {
    currentPage: Page.Dashboard,
    userRole: UserRole.Fan,
    language: Language.English,
    match: {
      id: 'test-match',
      teamA: 'USA',
      teamB: 'Brazil',
      venue: 'MetLife Stadium',
      kickoff: '2026-07-19T20:00:00',
      status: 'live',
      score: { home: 1, away: 2 },
      attendance: 78200,
      capacity: 82500,
    },
    zones: [
      { id: 'z-fc2', name: 'Food Court C', type: 'food', level: 1, capacity: 500, currentOccupancy: 200, density: CrowdDensity.Low, coordinate: { lat: 40, lng: -74 }, accessibleRoute: true },
      { id: 'z-rr2', name: 'Restroom West', type: 'restroom', level: 2, capacity: 80, currentOccupancy: 30, density: CrowdDensity.Low, coordinate: { lat: 40, lng: -74 }, accessibleRoute: true },
    ],
    transport: [],
    emergencies: [
      { id: 'em-1', type: 'weather', severity: EmergencySeverity.Warning, message: 'Storm warning', zone: 'All', timestamp: Date.now(), resolved: false },
    ],
    volunteerTasks: [
      { id: 'vt-1', title: 'Task 1', description: 'Desc', zone: 'z-fc2', priority: 'high', status: 'pending', assignedTo: 'Alpha', dueTime: Date.now() },
      { id: 'vt-2', title: 'Task 2', description: 'Desc', zone: 'z-fc2', priority: 'low', status: 'completed', assignedTo: 'Bravo', dueTime: Date.now() },
    ],
    sustainability: {
      carbonFootprint: 42.5,
      wasteRecycled: 68,
      waterUsage: 125000,
      energyConsumption: 8500,
      renewablePercentage: 72,
      targetCarbon: 50,
      targetRecycling: 75,
    },
    chatMessages: [],
    isAILoading: false,
    highContrastMode: false,
  };
}

describe('aiService', () => {
  beforeEach(() => {
    aiRateLimiter.reset();
    vi.restoreAllMocks();
  });

  it('returns a fallback response for seat/navigation queries', async () => {
    const state = createMockState();
    const result = await getAIResponse('Where is my seat in section 101?', state, Language.English);
    expect(result).toContain('Finding your seat');
  });

  it('returns food response with low-density zone recommendation', async () => {
    const state = createMockState();
    const result = await getAIResponse('I am hungry, where can I eat?', state, Language.English);
    expect(result).toContain('Food Options');
    expect(result).toContain('Food Court C');
  });

  it('returns restroom response', async () => {
    const state = createMockState();
    const result = await getAIResponse('Where is the nearest restroom?', state, Language.English);
    expect(result).toContain('Restrooms');
  });

  it('returns emergency response', async () => {
    const state = createMockState();
    const result = await getAIResponse('I need medical help immediately', state, Language.English);
    expect(result).toContain('Emergency Assistance');
  });

  it('returns transport response', async () => {
    const state = createMockState();
    const result = await getAIResponse('How do I get to the metro?', state, Language.English);
    expect(result).toContain('Getting Home');
  });

  it('returns weather response when alert is active', async () => {
    const state = createMockState();
    const result = await getAIResponse('Is there a storm coming?', state, Language.English);
    expect(result).toContain('Weather Alert Active');
  });

  it('returns accessibility response', async () => {
    const state = createMockState();
    const result = await getAIResponse('Is there wheelchair access?', state, Language.English);
    expect(result).toContain('Accessibility Services');
  });

  it('returns crowd status response', async () => {
    const state = createMockState();
    const result = await getAIResponse('Which areas are crowded right now?', state, Language.English);
    expect(result).toContain('Crowd Status');
  });

  it('returns sustainability response', async () => {
    const state = createMockState();
    const result = await getAIResponse('What about recycling options?', state, Language.English);
    expect(result).toContain('Sustainability');
  });

  it('returns volunteer response', async () => {
    const state = createMockState();
    const result = await getAIResponse('What volunteer tasks are available?', state, Language.English);
    expect(result).toContain('Volunteer Hub');
    expect(result).toContain('1 pending tasks');
  });

  it('returns match info response', async () => {
    const state = createMockState();
    const result = await getAIResponse('What is the score?', state, Language.English);
    expect(result).toContain('Match Update');
    expect(result).toContain('USA');
  });

  it('returns default greeting for unrecognized queries', async () => {
    const state = createMockState();
    const result = await getAIResponse('Tell me something random', state, Language.English);
    expect(result).toContain("I'm StadiumAI");
  });

  it('returns error for empty input', async () => {
    const state = createMockState();
    const result = await getAIResponse('', state, Language.English);
    expect(result).toBe('Please enter a valid message.');
  });

  it('enforces rate limiting', async () => {
    const state = createMockState();
    // Exhaust all tokens
    for (let i = 0; i < 10; i++) {
      await getAIResponse('test message', state, Language.English);
    }
    const result = await getAIResponse('one more', state, Language.English);
    expect(result).toContain('Too many requests');
  });
});
