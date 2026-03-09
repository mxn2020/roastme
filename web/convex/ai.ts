import { action } from "./_generated/server";
import { v } from "convex/values";

// Simple helper to parse generic JSON returned by an LLM
function parseJsonResponse(raw: string): any {
    let cleaned = raw.trim()
    if (cleaned.startsWith('\`\`\`')) {
        cleaned = cleaned.replace(/^\`\`\`(?:json)?\n?/, '').replace(/\n?\`\`\`$/, '')
    }
    try {
        return JSON.parse(cleaned)
    } catch (e) {
        console.error('[AI Pipeline] Failed to parse JSON:', cleaned, e)
        throw new Error('AI returned invalid JSON')
    }
}

export const generateRoast = action({
    args: {
        imageBase64: v.string(), // data:image/jpeg;base64,...
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY; // Using OpenAI (gpt-4o) as VLM proxy here if NVIDIA api is not guaranteed. 
        // We will adapt this to OpenAI to ensure it actually works, as justOneLastDrink might use nvidia keys.
        // Assuming we want a standard gpt-4o vision call:

        if (!apiKey) {
            throw new Error("OPENAI_API_KEY is not configured in Convex environment variables.");
        }

        const systemPrompt = "You are a brutally honest, hilarious stand-up comedian. The user has uploaded a selfie or photo of themselves. You must absolutely ROAST them based on what you see—their outfit, expression, background, vibe, etc. Be ruthless but funny. DO NOT filter yourself too much, they opted into this.";

        const userPrompt = `Generate a JSON response with the following exact structure:
{
  "roastText": "<A savage 2-3 paragraph comedy roast about the image>",
  "hotTake": "<A punchy 1-sentence savage summary>",
  "brutalRating": <A number from 1-10 on how roastable they are>,
  "redFlagsIdentified": ["<red flag 1>", "<red flag 2>", "<red flag 3>"]
}
Limit red flags to exactly 3 short punchy strings. Only output valid JSON.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: \`Bearer \${apiKey}\`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: userPrompt },
                            { type: "image_url", image_url: { url: args.imageBase64 } },
                        ],
                    },
                ],
                temperature: 0.8,
                max_tokens: 1000,
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(\`OpenAI API error: \${errorText}\`);
        }

        const data = await response.json() as any;
        const responseContent = data.choices?.[0]?.message?.content ?? "";

        const parsed = parseJsonResponse(responseContent);
        
        return {
            roastText: parsed.roastText || "Wow. I'm speechless.",
            hotTake: parsed.hotTake || "Just... wow.",
            brutalRating: typeof parsed.brutalRating === 'number' ? parsed.brutalRating : 10,
            redFlagsIdentified: Array.isArray(parsed.redFlagsIdentified) ? parsed.redFlagsIdentified : ["Everything"]
        };
    },
});
