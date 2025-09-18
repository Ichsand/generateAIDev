import { GoogleGenAI } from "@google/genai";

import 'dotenv/config';
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const upload = multer();
const ai = new GoogleGenAI({});

//init model AI
const geminiModels = {
    text: "gemini-2.5-flash-lite",
    image: "gemini-2.5-flash",
    audio: "gemini-2.5-flash",
    document: "gemini-2.5-flash-lite",
}

//init headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init route
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("AI server running on port", PORT);
});
app.post('/generate-text', async(req, res) => {
    const { body } = req;
    const { message } = body;

    if(!message || typeof message !== "string") {
        res.status(400).send("Bad request, no request payload found");
        return;
    }

    //init logic
    const response = await ai.models.generateContent({
        contents: message,
        model: geminiModels.text
    })
    
    res.status(200).send({reply: response.text});
})
app.post('/generate-image', async(req, res) => {
    const { body } = req;
    const { message } = body;

    if(!message || typeof message !== "string") {
        res.status(400).send("Bad request, no request payload found");
        return;
    }

    //init logic
    const response = await ai.models.generateImages({
        contents: message,
        model: geminiModels.image
    })
    
    res.status(200).send({reply: response.generatedImages});
})

app.post('/generate-documents', async(req, res) => {
    const { body } = req;
    const { message } = body;

    if(!message || typeof message !== "string") {
        res.status(400).send("Bad request, no request payload found");
        return;
    }

    //init logic
    const response = await fs.readFile({
        contents: message,
        model: geminiModels.document
    })
    
    res.status(200).send({reply: response});
})

app.post('/generate-audio', async(req, res) => {
    const { body } = req;
    const { message } = body;

    if(!message || typeof message !== "string") {
        res.status(400).send("Bad request, no request payload found");
        return;
    }

    //init logic
    const response = await ai.models.generateContent({
        contents: message,
        model: geminiModels.audio
    })
    
    res.status(200).send({reply: response});
})

//

// /**
//  * Main function to generate content using the Gemini model.
//  * @returns {Promise<void>} The generated content.
//  */
// async function main() {
//   // Generate content using the Gemini model.
//   // The model is set to "gemini-2.5-flash" and the contents is set to "tolong bantu saya cara membuat roti".
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "tolong bantu saya cara membuat roti",
//   });
//   // Log the generated content to the console.
//   console.log(response.text);
// }

// await main();
