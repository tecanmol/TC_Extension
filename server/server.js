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
            You are a legal assistant designed to protect consumers. Your task is to analyze the following Terms of Service text.

            1. Provide a 3-sentence summary of what the service does.
            2. Extract 'Red Flags': Clauses that are unusually unfair, such as selling data to 3rd parties, binding arbitration (no court), or aggressive cancellation fees.
            3. Extract 'Good Stuff': User-friendly terms.
            4. Return the answer in strict JSON format: { "summary": string, "red_flags": string[], "good_points": string[] }.

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