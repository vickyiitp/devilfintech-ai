import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables FIRST before any other imports that use them
dotenv.config();

import { geminiService } from "./geminiService";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("DevilFintech AI Backend Server is running!");
});

// Chat endpoint with streaming support
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, userSettings, imageUrl } = req.body;

    console.log("[Chat Request]:", { message, historyLength: history?.length });

    // Set headers for Server-Sent Events
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = geminiService.sendMessage(
      message,
      history,
      userSettings,
      imageUrl
    );

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("[Chat Error]:", error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Text-to-speech endpoint
app.post("/api/text-to-speech", async (req, res) => {
  try {
    const { text, voice } = req.body;

    console.log("[TTS Request]:", { textLength: text?.length, voice });

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const audioData = await geminiService.textToSpeech(text, voice);

    if (audioData) {
      res.json({ audioData });
    } else {
      res.status(500).json({ error: "Failed to generate audio" });
    }
  } catch (error) {
    console.error("[TTS Error]:", error);
    res.status(500).json({
      error: "An error occurred while generating audio.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend server is running on http://localhost:${port}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - POST http://localhost:${port}/api/chat`);
  console.log(`   - POST http://localhost:${port}/api/text-to-speech`);
});
