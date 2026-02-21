
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function dietGenerate(userData) {
    const response = await fetch(`${API_BASE_URL}/api/diet/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to generate diet');
    return await response.json();
}

export async function symptomCheck(data) {
    // data: { text, vitals }
    const response = await fetch(`${API_BASE_URL}/api/symptom/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Triage failed');
    return await response.json();
}

export async function workoutGenerate(profile) {
    // profile: { goal, level, equipment, days_per_week, injuries }
    const response = await fetch(`${API_BASE_URL}/api/workout/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
    });
    if (!response.ok) throw new Error('Workout generation failed');
    return await response.json();
}

export async function sendChat(message, context = {}) {
    // message: string, context: object
    const response = await fetch(`${API_BASE_URL}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
    });
    if (!response.ok) throw new Error('Chat failed');
    return await response.json();
}

export async function logEvent(type, payload) {
    try {
        await fetch(`${API_BASE_URL}/api/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_type: type, payload })
        });
    } catch (e) {
        console.warn("Event logging failed", e);
    }
}
