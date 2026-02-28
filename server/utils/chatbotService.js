import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.error('FATAL ERROR: GEMINI_API_KEY is not set');
    process.exit(1);
}

// ✅ Safe to instantiate here — dotenv.config() is called in THIS file too
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildFacultyContext = (facultyData) =>
    facultyData
        .map(f => `• ${f.name} — ${f.areas_of_interest.join(', ')}`)
        .join('\n');

const buildHistoryString = (history) =>
    history.length > 0
        ? history.map(h => `${h.role === 'user' ? 'Student' : 'Advisor'}: ${h.parts}`).join('\n')
        : 'No previous conversation.';

// ─── Main Chat ─────────────────────────────────────────────────────────────────

/**
 * Multi-turn chat with the Academic Project Advisor
 * @param {string} userMessage - Student's question
 * @param {Array}  history     - Previous chat history [{ role: "user"|"model", parts: "..." }]
 * @param {Array}  facultyData - JSON array of professors
 * @returns {Promise<{ reply: string, updatedHistory: Array }>}
 */
export const chatWithAdvisor = async (userMessage, history = [], facultyData) => {

    const facultyContext = buildFacultyContext(facultyData);
    const historyString  = buildHistoryString(history);

    const prompt = `
You are an expert Academic Project Advisor for the ECE (Electronics & Communication Engineering) department.
Your job is to help B.Tech final-year students find the right project and the right supervisor.

════════════════════════════════════════
AVAILABLE FACULTY & THEIR EXPERTISE
════════════════════════════════════════
${facultyContext}

════════════════════════════════════════
CONVERSATION SO FAR
════════════════════════════════════════
${historyString}

════════════════════════════════════════
STUDENT'S MESSAGE
════════════════════════════════════════
${userMessage}

════════════════════════════════════════
YOUR INSTRUCTIONS
════════════════════════════════════════
1. Suggest 2–3 specific, modern, and feasible project ideas that match the student's interest.
2. For EACH project provide:
   - A clear project title
   - A 2–3 sentence description explaining what the project does and its real-world impact
   - The best-matched professor from the list above and WHY they are the right fit
3. If the student is asking a follow-up or narrowing down, refine your suggestions accordingly.
4. If the question is unrelated to projects or faculty, politely redirect.
5. Keep your tone encouraging, professional, and concise.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

### 🔬 Project 1: [Title]
**Description:** [2–3 sentences]
**Supervisor:** [Professor Name]
**Why this supervisor:** [1 sentence reason]

---

### 🔬 Project 2: [Title]
**Description:** [2–3 sentences]
**Supervisor:** [Professor Name]
**Why this supervisor:** [1 sentence reason]

---

### 🔬 Project 3: [Title]  ← (optional, include only if relevant)
**Description:** [2–3 sentences]
**Supervisor:** [Professor Name]
**Why this supervisor:** [1 sentence reason]

---
Begin with a single friendly sentence acknowledging what the student is looking for, then show the projects.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const reply = response.text;

        const updatedHistory = [
            ...history,
            { role: 'user',  parts: userMessage },
            { role: 'model', parts: reply },
        ];

        return { reply, updatedHistory };

    } catch (error) {
        console.error('Gemini Advisor Error:', error);
        throw new Error('Failed to get response from Advisor');
    }
};

// ─── Quick One-Shot Recommendation ────────────────────────────────────────────

/**
 * Direct project recommendation without chat history
 * @param {string} interest    - Student's area of interest
 * @param {Array}  facultyData - Faculty JSON
 * @returns {Promise<string>}
 */
export const getQuickRecommendation = async (interest, facultyData) => {

    const facultyContext = buildFacultyContext(facultyData);

    const prompt = `
You are an expert Academic Project Advisor for the ECE department.

════════════════════════════════════════
AVAILABLE FACULTY & THEIR EXPERTISE
════════════════════════════════════════
${facultyContext}

════════════════════════════════════════
STUDENT INTEREST
════════════════════════════════════════
"${interest}"

════════════════════════════════════════
YOUR TASK
════════════════════════════════════════
Suggest exactly 3 specific, modern, and impactful project ideas based on the student's interest.
For each project:
- Give a specific title (not generic)
- Write 2 sentences describing what it involves and its real-world value
- Pick the single best professor from the list and explain why in one sentence

FORMAT:

### 🔬 Project 1: [Title]
**Description:** [2 sentences]
**Best Supervisor:** [Professor Name] — [Why they're the right fit]

---

### 🔬 Project 2: [Title]
**Description:** [2 sentences]
**Best Supervisor:** [Professor Name] — [Why they're the right fit]

---

### 🔬 Project 3: [Title]
**Description:** [2 sentences]
**Best Supervisor:** [Professor Name] — [Why they're the right fit]

---
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error('Quick Rec Error:', error);
        throw new Error('Failed to generate quick recommendations');
    }
};