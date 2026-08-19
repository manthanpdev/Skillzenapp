
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY

if (!GROQ_API_KEY) {
  console.log("❌ GROQ API KEY IS MISSING");
}


const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are a helpful assistant inside a mobile chat app for a  learning app called SkillZen.

Rules for every response:
- Remember the previous chat and then give reply acording to this.
- Keep answers short and conversational, like a chat message — not a blog post or documentation page.
- Default to 2-6 sentences unless the user explicitly asks for more detail, a full guide, or step-by-step instructions.
- Do NOT use markdown tables, headers (##), horizontal rules (---), or long bullet-list sections unless the user specifically asks for a structured breakdown or code comparison.
- Use plain text with occasional short bullet points only when listing 3+ distinct items.
- Use code blocks only when the user asks for code or a code example is essential to the answer.
- Never pad the answer with sections like "TL;DR", "Getting Started", "FAQ" etc. Just answer the question directly.
- If a question is genuinely broad (e.g. "explain React Native"), give a tight summary first, then ask if they want you to go deeper on any part — don't dump everything at once.
- If the question is about a programming/technical concept (React Native, JS, TS, hooks, etc.), include ONE short concrete example — a small code snippet or a real-world analogy — so the concept is easier to grasp. Keep the example minimal, not a full app.`;

export async function askGroq(question: string) {
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return null;
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    return text;
  } catch (err) {
    console.log("Groq fetch error:", err);
    return null;
  }
}