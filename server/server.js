import express from 'express';
import cors from 'cors';
import { OpenRouter } from '@openrouter/sdk';
import dotenv from 'dotenv';

dotenv.config();

const port= 3000;
const app = express()

app.use(cors());
app.use(express.json());

const openrouter   = new OpenRouter({
  apiKey: process.env.API_KEY
});

app.post('/api/analyze', async(req,res) =>{
    try{
        const { text } = req.body;
        // const text = `What you can do. Subject to your compliance with these Terms, you may access and use our Services. In using our Services, you must comply with all applicable laws as well as our Sharing & Publication Policy⁠, Usage Policies⁠, and any other documentation, guidelines, or policies we make available to you.
        //             What you cannot do. You may not use our Services for any illegal, harmful, or abusive activity. For example, you may not:
        //             Use our Services in a way that infringes, misappropriates or violates anyone’s rights.
        //             Modify, copy, lease, sell or distribute any of our Services.
        //             Attempt to or assist anyone to reverse engineer, decompile or discover the source code or underlying components of our Services, including our models, algorithms, or systems (except to the extent this restriction is prohibited by applicable law).
        //             Automatically or programmatically extract data or Output (defined below).
        //             Represent that Output was human-generated when it was not.
        //             Interfere with or disrupt our Services, including circumvent any rate limits or restrictions or bypass any protective measures or safety mitigations we put on our Services.
        //             Use Output to develop models that compete with OpenAI.`

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
            model: "x-ai/grok-4.1-fast:free",
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
    console.log("http://localhost:3000")
})