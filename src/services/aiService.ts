/**
 * @fileoverview GenAI service for StadiumAI.
 * Integrates with Google Gemini API for intelligent stadium assistance.
 * Falls back to rule-based responses when the API key is not configured.
 */

import { sanitizeInput } from '@/utils/sanitize';
import { aiRateLimiter } from '@/utils/rateLimiter';
import { isTrustedOrigin } from '@/config/security';
import type { Language, AppState } from '@/types';

/** Gemini API endpoint. */
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/** System prompt that defines StadiumAI's persona and capabilities. */
const SYSTEM_PROMPT = `You are StadiumAI, an intelligent assistant for FIFA World Cup 2026 stadium operations. You help fans, staff, volunteers, and organizers with:
- Stadium navigation and wayfinding (finding seats, food courts, restrooms, exits)
- Real-time crowd management (density levels, flow optimization, alternate routes)
- Multilingual assistance (respond in the user's language)
- Accessibility support (wheelchair routes, sensory rooms, audio descriptions)
- Transportation coordination (parking, metro, shuttles, rideshare)
- Sustainability awareness (carbon footprint, recycling, water usage)
- Emergency guidance (evacuation routes, medical stations, weather alerts)
- Volunteer task coordination

Always be concise, helpful, and safety-conscious. Prioritize accessibility and inclusivity.
For emergencies, always provide clear, calm instructions and direct to the nearest help.
Current venue: MetLife Stadium, New Jersey. Match: USA vs Brazil.`;

/**
 * Generates a context-aware prompt by including relevant stadium state.
 * @param userMessage - The sanitized user message.
 * @param state - Current application state for context.
 * @returns A contextually enriched prompt.
 */
function buildContextPrompt(userMessage: string, state: AppState): string {
  const crowdedZones = state.zones
    .filter((z) => z.density === 'high' || z.density === 'critical')
    .map((z) => `${z.name} (${z.density})`)
    .join(', ');

  const activeEmergencies = state.emergencies
    .filter((e) => !e.resolved)
    .map((e) => `[${e.severity}] ${e.message}`)
    .join('; ');

  return `User role: ${state.userRole}
Match: ${state.match.teamA} vs ${state.match.teamB} (${state.match.status}, ${state.match.score.home}-${state.match.score.away})
Attendance: ${state.match.attendance.toLocaleString()} / ${state.match.capacity.toLocaleString()}
Crowded areas: ${crowdedZones || 'None'}
Active alerts: ${activeEmergencies || 'None'}
Language preference: ${state.language}

User question: ${userMessage}`;
}

/**
 * Calls the Gemini API for an AI response.
 * @param prompt - The complete prompt to send.
 * @param apiKey - The Gemini API key.
 * @returns The AI-generated response text.
 * @throws Error if the API call fails.
 */
async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  const url = `${GEMINI_API_URL}?key=${apiKey}`;

  if (!isTrustedOrigin(GEMINI_API_URL)) {
    throw new Error('Untrusted API origin');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.9,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return text;
}

/**
 * Generates a fallback response using rule-based logic.
 * Used when the Gemini API key is not configured.
 * @param message - The user's sanitized message.
 * @param state - Current app state.
 * @returns A helpful rule-based response.
 */
function getFallbackResponse(message: string, state: AppState): string {
  const lower = message.toLowerCase();

  // Navigation
  if (lower.includes('seat') || lower.includes('section') || lower.includes('find')) {
    return '🧭 **Finding your seat:**\n\n1. Check your ticket for Section, Row, and Seat number\n2. Follow the color-coded signs — East (Blue), West (Green), North (Red), South (Yellow)\n3. Level 1 sections are 100s, Level 2 are 200s, Level 3 are 300s\n\n♿ Accessible entrances are at Gates A and D with elevator access to all levels.\n\nNeed help with a specific section? Tell me your ticket details!';
  }

  // Food
  if (lower.includes('food') || lower.includes('eat') || lower.includes('drink') || lower.includes('hungry')) {
    const lesseCrowded = state.zones.find((z) => z.type === 'food' && z.density === 'low');
    return `🍔 **Food Options:**\n\n${lesseCrowded ? `✅ **${lesseCrowded.name}** has low crowd density — recommended!\n` : ''}⚠️ Food Court at Gate A is currently very crowded.\n\n**Tips:**\n- Use the mobile ordering kiosk to skip lines\n- Halal, Kosher, and vegetarian options available at all food courts\n- Water refill stations are free and located near every restroom\n\n♻️ Please use the recycling bins — we're aiming for 75% waste diversion!`;
  }

  // Restroom
  if (lower.includes('restroom') || lower.includes('bathroom') || lower.includes('toilet') || lower.includes('washroom')) {
    const freeRestroom = state.zones.find((z) => z.type === 'restroom' && z.density === 'low');
    return `🚻 **Nearest Restrooms:**\n\n${freeRestroom ? `✅ **${freeRestroom.name}** — Low wait time\n` : ''}♿ All restrooms have accessible stalls\n👶 Family restrooms with baby changing stations at Gates B and D\n\n**Pro tip:** Level 2 restrooms typically have shorter queues during halftime.`;
  }

  // Emergency
  if (lower.includes('emergency') || lower.includes('help') || lower.includes('medical') || lower.includes('injured') || lower.includes('fire')) {
    return '🚨 **Emergency Assistance:**\n\n📞 **Call stadium security: Dial 911 or text HELP to 82650**\n\n🏥 **Medical Station** is located at the Central Concourse (Level 1)\n🚪 **Nearest Exit:** Follow illuminated EXIT signs\n👮 **Security staff** are stationed at every gate\n\n⚠️ If you see something suspicious, report it immediately.\n\nStay calm and follow staff instructions. Help is on the way!';
  }

  // Transport
  if (lower.includes('transport') || lower.includes('parking') || lower.includes('metro') || lower.includes('bus') || lower.includes('uber') || lower.includes('taxi') || lower.includes('ride') || lower.includes('train')) {
    return '🚗 **Getting Home:**\n\n🚇 **NJ Transit Rail** — Meadowlands station (25 min to Penn Station)\n🚌 **Express Bus** — Gate E pickup (40 min to Port Authority)\n🚐 **FIFA Shuttle** — Limited availability, Gate A\n🅿️ **Parking** — Lot K has 800+ spots available\n🚕 **Rideshare** — Designated pickup at Lot J\n🚶 **Walking** — 18 min to train station\n\n♻️ Public transport saves ~0.13 kg CO₂ per person vs driving!';
  }

  // Weather
  if (lower.includes('weather') || lower.includes('rain') || lower.includes('storm')) {
    const weatherAlert = state.emergencies.find((e) => e.type === 'weather' && !e.resolved);
    return weatherAlert
      ? `⛈️ **Weather Alert Active:**\n\n${weatherAlert.message}\n\n🏟️ MetLife Stadium has a retractable roof — closure in progress.\n☂️ Ponchos available at merchandise stands.\n\nStay in your seat; the match will resume after conditions improve.`
      : '☀️ **Current Weather:** Clear skies, 24°C (75°F). Perfect match conditions!\n\n💧 Stay hydrated — free water refill stations are located near every restroom.';
  }

  // Accessibility
  if (lower.includes('wheelchair') || lower.includes('accessible') || lower.includes('disability') || lower.includes('sensory') || lower.includes('hearing') || lower.includes('blind') || lower.includes('deaf')) {
    return '♿ **Accessibility Services:**\n\n🦽 **Wheelchair:** Accessible seating in all sections. Ramp access at Gates A & D.\n👁️ **Visual:** Audio descriptive commentary available on channel 4 of your radio\n👂 **Hearing:** Assistive listening devices at Guest Services\n🧘 **Sensory Room:** Level 1, near Gate B — a quiet space for those who need a break\n🐕 **Service Animals:** Welcome in all areas\n\n📍 **Accessibility Desk:** Main Concourse, Section 108\n\nNeed a volunteer escort? I can arrange one!';
  }

  // Crowd
  if (lower.includes('crowd') || lower.includes('busy') || lower.includes('wait') || lower.includes('line') || lower.includes('queue')) {
    const criticalZones = state.zones.filter((z) => z.density === 'critical');
    const lowZones = state.zones.filter((z) => z.density === 'low');
    return `👥 **Crowd Status:**\n\n${criticalZones.length > 0 ? `🔴 **Avoid:** ${criticalZones.map((z) => z.name).join(', ')}\n` : ''}${lowZones.length > 0 ? `🟢 **Low density:** ${lowZones.map((z) => z.name).join(', ')}\n` : ''}\n**Tips:**\n- Use alternative routes via Level 2 concourse\n- Food lines are shortest 15 min before kickoff and during play\n- Restrooms on Level 2 are typically less crowded`;
  }

  // Sustainability
  if (lower.includes('sustain') || lower.includes('recycle') || lower.includes('carbon') || lower.includes('green') || lower.includes('environment')) {
    return `♻️ **Sustainability at this Match:**\n\n🌱 Carbon Footprint: ${state.sustainability.carbonFootprint} tonnes (target: <${state.sustainability.targetCarbon})\n♻️ Waste Recycled: ${state.sustainability.wasteRecycled}% (target: ${state.sustainability.targetRecycling}%)\n⚡ Renewable Energy: ${state.sustainability.renewablePercentage}%\n💧 Water Usage: ${(state.sustainability.waterUsage / 1000).toFixed(0)}K liters\n\n**How you can help:**\n- Use the 4-bin recycling stations\n- Refill water bottles at free stations\n- Take public transport home (saves 0.13 kg CO₂)`;
  }

  // Volunteer
  if (lower.includes('volunteer') || lower.includes('task') || lower.includes('shift') || lower.includes('assign')) {
    const pendingTasks = state.volunteerTasks.filter((t) => t.status === 'pending').length;
    return `📋 **Volunteer Hub:**\n\n📊 **${pendingTasks} pending tasks** need assignment\n✅ ${state.volunteerTasks.filter((t) => t.status === 'completed').length} tasks completed today\n\nCheck the Volunteer Dashboard for your current assignments, shift schedule, and communication with your team leader.`;
  }

  // Match info
  if (lower.includes('score') || lower.includes('match') || lower.includes('game') || lower.includes('play')) {
    return `⚽ **Match Update:**\n\n${state.match.teamA} ${state.match.score.home} — ${state.match.score.away} ${state.match.teamB}\n\n🏟️ Venue: ${state.match.venue}\n👥 Attendance: ${state.match.attendance.toLocaleString()} / ${state.match.capacity.toLocaleString()}\n📍 Status: ${state.match.status.toUpperCase()}\n\nEnjoy the match! 🎉`;
  }

  // Default
  return `👋 **Hello! I'm StadiumAI, your smart assistant for today's match.**\n\nI can help with:\n\n🧭 **Navigation** — "Where is my seat?"\n🍔 **Food & Drinks** — "Where can I eat?"\n🚻 **Restrooms** — "Nearest restroom?"\n♿ **Accessibility** — "Wheelchair access?"\n🚗 **Transport** — "How do I get home?"\n👥 **Crowd Info** — "Which areas are busy?"\n🚨 **Emergency** — "I need medical help"\n♻️ **Sustainability** — "Recycling options?"\n⚽ **Match Info** — "What's the score?"\n\nJust ask me anything! I speak 12 languages. 🌍`;
}

/**
 * Sends a message to the AI assistant and returns a response.
 * Sanitizes input, checks rate limits, and falls back gracefully.
 * @param rawMessage - The raw user message.
 * @param state - Current application state for context.
 * @param language - The user's preferred language.
 * @returns The AI assistant's response.
 */
export async function getAIResponse(
  rawMessage: string,
  state: AppState,
  language: Language,
): Promise<string> {
  // 1. Sanitize input
  const message = sanitizeInput(rawMessage);
  if (!message) {
    return 'Please enter a valid message.';
  }

  // 2. Check rate limit
  if (!aiRateLimiter.tryConsume()) {
    const waitMs = aiRateLimiter.getWaitTime();
    return `⏳ Too many requests. Please wait ${Math.ceil(waitMs / 1000)} seconds and try again.`;
  }

  // 3. Try Gemini API if key is configured
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (apiKey && apiKey.length > 0) {
    try {
      const prompt = buildContextPrompt(message, state);
      const response = await callGeminiAPI(prompt, apiKey);
      return response;
    } catch (error) {
      console.warn('Gemini API fallback:', error);
      // Fall through to rule-based response
    }
  }

  // 4. Fallback to rule-based responses
  void language; // Language used for context in Gemini prompt
  return getFallbackResponse(message, state);
}
