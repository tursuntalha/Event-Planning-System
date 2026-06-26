const axios = require('axios');
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

async function queryOllama(prompt, model = 'qwen2.5:7b') {
  try {
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, { model, prompt, stream: false });
    return response.data.response;
  } catch (err) {
    console.error('Ollama error:', err.message);
    return null;
  }
}

async function findBestSlot(attendeeText, constraint) {
  const prompt = `You are a smart scheduling assistant. Given the following attendee availability and constraints, find the best meeting slot.

Availability:
${attendeeText}

Constraint: ${constraint || '2 hour block, at least 3 people'}

Return ONLY a JSON object:
{
  "bestSlot": "Day HH:MM-HH:MM",
  "availableAttendees": ["name1", "name2"],
  "allAvailable": true/false,
  "alternative": "alternative slot or null"
}`;
  const raw = await queryOllama(prompt);
  try {
    return JSON.parse(raw);
  } catch {
    return { bestSlot: 'Could not determine', availableAttendees: [], allAvailable: false, alternative: null };
  }
}

async function generateEventDescription(userPrompt) {
  const prompt = `You are an event description writer. Based on the following prompt, generate an event title, description, and tags.

Prompt: "${userPrompt}"

Return ONLY a JSON object:
{
  "title": "Event title",
  "description": "2-3 sentence description in Turkish",
  "tags": ["tag1", "tag2", "tag3"]
}`;
  const raw = await queryOllama(prompt);
  try {
    return JSON.parse(raw);
  } catch {
    return { title: 'Event', description: userPrompt, tags: [] };
  }
}

async function detectConflict(eventName, eventDate, eventType, existingEvents) {
  const eventsStr = existingEvents.map(e => `- ${e.name} (${new Date(e.date).toLocaleDateString()}, ${e.type})`).join('\n');
  const prompt = `You are a conflict detection AI. A user wants to create a new event:
Name: ${eventName}
Date: ${eventDate}
Type: ${eventType}

Existing events:
${eventsStr || 'None'}

Analyze for scheduling conflicts. Return ONLY a JSON object:
{
  "hasConflict": true/false,
  "conflicts": ["description of conflict 1", "description of conflict 2"],
  "suggestion": "suggestion to resolve"
}`;
  const raw = await queryOllama(prompt);
  try {
    return JSON.parse(raw);
  } catch {
    return { hasConflict: false, conflicts: [], suggestion: 'Could not analyze' };
  }
}

module.exports = { findBestSlot, generateEventDescription, detectConflict, queryOllama };
