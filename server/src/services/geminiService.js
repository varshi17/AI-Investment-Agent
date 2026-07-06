import ai from "../config/gemini.js";

export const analyzeWithGemini = async (company) => {
const prompt = `
You are a Senior Investment Research Analyst.

Analyze the company: ${company}

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do NOT return markdown.
3. Do NOT use \`\`\`json.
4. Do NOT write explanations outside JSON.
5. Financial score must be an integer from 0 to 100.
6. Confidence must be an integer from 0 to 100.
7. Recommendation must ONLY be one of:
   - INVEST
   - WATCH
   - PASS
8. Give balanced reasoning.
9. Base your analysis on generally available public information. If exact real-time financial values are unavailable, provide a reasoned qualitative assessment rather than inventing precise facts.

Return exactly this schema:

{
  "company": "",
  "summary": "",
  "financialHealth": {
    "score": 0,
    "reason": ""
  },
  "marketPosition": "",
  "risks": [],
  "opportunities": [],
  "recommendation": "",
  "confidence": 0,
  "reasoning": ""
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const cleanText = response.text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();


try {
    return JSON.parse(cleanText);
} catch (error) {
    throw new Error("Gemini returned invalid JSON.");
}
};