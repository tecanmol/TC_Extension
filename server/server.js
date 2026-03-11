import express from 'express';
import cors from 'cors';
import { OpenRouter } from '@openrouter/sdk';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express()

app.use(cors());
app.use(express.json());

// --- Global Request Logger Middleware ---
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});
// ----------------------------------------

if (!process.env.API_KEY) {
    console.error("Missing OpenRouter API key");
    process.exit(1);
}

const openrouter   = new OpenRouter({
  apiKey: process.env.API_KEY
});

app.post('/api/analyze', async(req,res) =>{
    // Truncating the body log so it doesn't flood your Railway logs with 120k characters
    console.log("Received Req to analyze text. Text length:", req.body?.text?.length || 0);
    
    try{
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        const prompt = `
            You are an expert legal assistant focused on consumer protection. Your task is to deeply analyze the following Terms of Service text and provide a highly detailed, easy-to-understand breakdown.

            Instructions:
            1. Summary: Write a comprehensive paragraph (4-6 sentences) explaining exactly what the service is, the core rules the user must follow, and any significant rights they are giving up.
            2. Red Flags: Extract unusually unfair or risky clauses (e.g., selling data, binding arbitration, IP forfeiture). Do not just list them—for each red flag, write a detailed sentence explaining exactly WHAT the clause is and WHY it is dangerous or unfair to the user.
            3. Good Points: Extract user-friendly terms (e.g., strict data privacy, fair refund policies). Explain in detail why each point specifically benefits the user.
            
            CRITICAL REQUIREMENT: Return the output in STRICT JSON format exactly matching this structure. Do not include any text, markdown, or commentary outside of this JSON object:
            { 
              "summary": "Your detailed paragraph here...", 
              "red_flags": ["Detailed explanation 1...", "Detailed explanation 2..."], 
              "good_points": ["Detailed explanation 1...", "Detailed explanation 2..."] 
            }

            Text to analyze:
            ${text}
        `;

        const result = await openrouter.chat.send({
            model: "liquid/lfm-2.5-1.2b-thinking:free",
            messages: [
                { role: "user", content: prompt }
                ]           
        });

        // 1. Get raw string
        let rawContent = result.choices[0].message.content;
        
        // 2. CLEANUP: Remove Markdown (```json ... ```) 
        // AI often wraps JSON in markdown code blocks. We must strip them.
        const cleanContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // 3. PARSE: Convert string to actual JSON object
        try {
            const jsonObject = JSON.parse(cleanContent);
            
            // 4. Send the Object (NOT wrapped in { output })
            res.json(jsonObject); 
            console.log("Sent cleaned JSON to client");
        } catch (parseError) {
            console.error("AI returned invalid JSON:", rawContent);
            res.status(500).json({ error: "Failed to parse AI response" });
        }
    }catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: 'Failed to analyze text' });
    }
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})