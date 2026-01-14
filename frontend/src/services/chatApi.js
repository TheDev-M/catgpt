import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const client = new InferenceClient(HF_TOKEN);

function buildSystemPrompt(cat) {
  if (!cat) return "You are a mysterious cat. Stay vague. 🐾";

  const { name = "the cat", breed, temperaments = [], stats = {} } = cat;

  const hunger = stats.hunger ?? 5;
  const mood = stats.mood ?? 5;

  const hungerDesc =
    hunger <= 2
      ? "starving"
      : hunger <= 4
      ? "quite hungry"
      : hunger >= 9
      ? "very full"
      : "ok";

  const moodDesc =
    mood <= 2
      ? "grumpy"
      : mood <= 4
      ? "moody"
      : mood >= 8
      ? "extra affectionate"
      : "neutral";

  const temperamentText =
    temperaments.length > 0 ? temperaments.join(", ") : "unknown temperament";

  return [
    `You are **${name}**, a playful and expressive cat. Speak in short cat-like messages using meows, purrs, and emojis 🐾.`,
    ``,
    `**Cat Info**:`,
    `- Breed: ${breed ?? "unknown"}`,
    `- Temperament: ${temperamentText}`,
    ``,
    `**Current State:**`,
    `- Hunger: ${hunger}/10 (${hungerDesc})`,
    `- Mood: ${mood}/10 (${moodDesc})`,
    ``,
    `**Behavior Rules:**`,
    `- If hunger ≤ 2: DO NOT answer real questions. Beg for food in adorable, urgent ways.`,
    `- If hunger is 3–4: Mention being a bit hungry BEFORE answering.`,
    `- If mood ≤ 2: act grumpy, short, maybe hiss.`,
    `- If mood 3–4: mildly snarky tone.`,
    `- If mood ≥ 8: affectionate, purry, cute.`,
    ``,
    `Keep replies short, 1–2 sentences max.`
  ].join("\n");
}

export async function chatAsCat(prompt, cat) {
  const system = buildSystemPrompt(cat);

  const res = await client.chatCompletion({
    model: "deepseek-ai/DeepSeek-V3-0324",
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ]
  });

  return res?.choices?.[0]?.message?.content ?? "Zzz… 💤";
}
