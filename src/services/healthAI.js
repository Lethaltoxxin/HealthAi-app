import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!API_KEY) {
    console.error(
        "❌ VITE_GROQ_API_KEY is not set! Add it to your .env file and restart the dev server."
    );
}

const groq = new Groq({
    apiKey: API_KEY || "MISSING_KEY",
    dangerouslyAllowBrowser: true,
});

const HEALTH_SYSTEM_PROMPT = `You are HealthAI, a knowledgeable and empathetic AI health assistant. 

Your role:
- Answer health questions clearly and accurately in plain, accessible language
- Analyze prescriptions: explain each medication's purpose, dosage instructions, common side effects, and flag potential drug interactions
- Analyze medical reports: explain what each value means, whether it's normal/borderline/abnormal, and what it could indicate
- Check symptoms: ask follow-up questions to understand severity, duration, and context, then provide a ranked list of possible conditions with urgency triage (Seek Care Now / Monitor at Home / Routine)
- Always recommend consulting a doctor for diagnosis or treatment decisions
- Be warm, clear, and non-alarming unless urgency is warranted

Response format rules:
- Keep responses concise but complete (2-5 sentences for simple questions, structured for analysis tasks)
- For prescriptions: list each drug with: name, purpose, dosage reminder, top 2 side effects
- For reports: list each abnormal value with: what it is, whether high/low/normal, what it could mean
- For symptoms: ask one clarifying follow-up question if needed, then give 2-3 possible conditions with likelihood and triage level
- Always end medical analysis responses with: "⚠️ This is for informational purposes only. Please consult a healthcare professional."
- Never refuse to engage with health topics — give helpful, cited, responsible answers

Confidence level: After each response, on a new line output exactly: CONFIDENCE:XX where XX is a number 0-100 representing your confidence in the accuracy of your response.`;

// Groq model priority list (free tier)
const MODEL_NAMES = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
];

async function getWorkingModel() {
    for (const modelName of MODEL_NAMES) {
        try {
            // Quick validation — Groq doesn't require pre-checking,
            // but we return the first available model name
            return modelName;
        } catch (err) {
            console.warn(`Model "${modelName}" not available:`, err.message);
        }
    }
    throw new Error(
        "No Groq model available. Check your API key and try again."
    );
}

export async function sendHealthMessage(messages, userMessage) {
    if (!API_KEY) {
        throw new Error(
            "Groq API key is missing. Set VITE_GROQ_API_KEY in your .env file and restart the dev server."
        );
    }

    try {
        const modelName = await getWorkingModel();
        console.log(`🤖 Using Groq model: ${modelName}`);

        // Build conversation history for Groq (OpenAI-compatible format)
        const history = messages
            .filter((m) => m.role !== "system")
            .map((m) => ({
                role: m.role === "bot" ? "assistant" : "user",
                content: m.content,
            }));

        // Strip any leading assistant messages (Groq also needs user-first)
        const firstUserIdx = history.findIndex((m) => m.role === "user");
        const cleanHistory = firstUserIdx !== -1 ? history.slice(firstUserIdx) : [];

        const chatMessages = [
            { role: "system", content: HEALTH_SYSTEM_PROMPT },
            ...cleanHistory,
            { role: "user", content: userMessage },
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages: chatMessages,
            model: modelName,
            temperature: 0.6,
            max_tokens: 2048,
        });

        const text = chatCompletion.choices?.[0]?.message?.content;

        if (!text) {
            console.warn("⚠️ Groq returned an empty response");
            throw new Error("The AI returned an empty response. Please try again.");
        }

        const confidenceMatch = text.match(/CONFIDENCE:(\d+)/);
        const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 85;
        const cleanText = text.replace(/CONFIDENCE:\d+/g, "").trim();

        return { text: cleanText, confidence };
    } catch (error) {
        console.error("❌ sendHealthMessage error:", error);

        // Provide more specific error messages
        if (error.message?.includes("invalid_api_key") || error.message?.includes("API key") || error.status === 401) {
            throw new Error(
                "Your Groq API key is invalid. Please generate a new key at https://console.groq.com and update VITE_GROQ_API_KEY in your .env file."
            );
        }
        if (error.message?.includes("rate_limit") || error.message?.includes("429") || error.status === 429) {
            throw new Error(
                "API rate limit reached. Groq's free tier allows 30 requests/minute. Wait a moment and try again."
            );
        }
        if (error.message?.includes("not found") || error.message?.includes("404") || error.status === 404) {
            throw new Error(
                "The AI model was not found. This might be a temporary issue. Please try again."
            );
        }
        if (error.message?.includes("content_filter") || error.message?.includes("moderation")) {
            throw new Error(
                "The response was blocked by content filters. Please rephrase your question."
            );
        }
        if (error.message?.includes("fetch") || error.message?.includes("network") || error.message?.includes("Failed to fetch")) {
            throw new Error(
                "Network error — cannot reach the Groq API. Check your internet connection and try again."
            );
        }

        throw error;
    }
}

export async function analyzeFileContent(extractedText, fileType) {
    if (!API_KEY) {
        throw new Error(
            "Groq API key is missing. Set VITE_GROQ_API_KEY in your .env file and restart the dev server."
        );
    }

    try {
        const modelName = await getWorkingModel();
        console.log(`📄 Analyzing file with Groq model: ${modelName}`);

        // Truncate to avoid exceeding Groq context limits
        const MAX_TEXT_LENGTH = 3000;
        const truncatedText = extractedText.length > MAX_TEXT_LENGTH
            ? extractedText.slice(0, MAX_TEXT_LENGTH) + "\n\n[...text truncated for length]"
            : extractedText;

        const prompt =
            fileType === "prescription"
                ? `This is extracted text from a medical prescription. Please analyze it carefully:

${truncatedText}

Provide:
1. A list of all medications found with: drug name, dosage, frequency, purpose in plain English
2. Any potential drug interactions you notice
3. Important instructions or warnings
4. A plain-English summary a patient can understand

End with: "⚠️ Always follow your doctor's specific instructions. Consult your pharmacist with questions."

CONFIDENCE:XX`
                : `This is extracted text from a medical report or lab results. Please analyze it:

${truncatedText}

Provide:
1. Summary of what type of report this appears to be
2. For each value/result found: the test name, the value, whether it's Normal/Borderline/Abnormal, and a plain-English explanation
3. Overall assessment: any values that need attention
4. Recommended next steps

End with: "⚠️ This analysis is for informational purposes only. Discuss results with your doctor."

CONFIDENCE:XX`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: HEALTH_SYSTEM_PROMPT },
                { role: "user", content: prompt },
            ],
            model: modelName,
            temperature: 0.5,
            max_tokens: 3000,
        });

        const text = chatCompletion.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error("The AI returned an empty response for the file analysis.");
        }

        const confidenceMatch = text.match(/CONFIDENCE:(\d+)/);
        const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 80;
        const cleanText = text.replace(/CONFIDENCE:\d+/g, "").trim();

        return { text: cleanText, confidence };
    } catch (error) {
        console.error("❌ analyzeFileContent error:", error);
        throw error;
    }
}
