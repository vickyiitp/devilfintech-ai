# DevilFintech AI - Backend Server

This is the backend server for the DevilFintech AI application. It handles all communication with the Google Gemini API for chat responses, chart generation, and text-to-speech functionality.

## Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   Copy your Google Gemini API key into the `.env` file:

   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

3. **Run the Server**

   For development (with hot reload):

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### POST /api/chat

Handles chat messages with streaming support.

**Request Body:**

```json
{
  "message": "User's message",
  "history": [],
  "userSettings": {},
  "imageUrl": "optional base64 image"
}
```

**Response:** Server-Sent Events stream

### POST /api/text-to-speech

Converts text to speech audio.

**Request Body:**

```json
{
  "text": "Text to convert to speech",
  "voice": "Kore"
}
```

**Response:**

```json
{
  "audioData": "base64 encoded audio"
}
```

## Features

- ✅ Streaming chat responses
- ✅ Chart and graph generation
- ✅ Text-to-speech conversion
- ✅ Secure API key management
- ✅ Comprehensive error logging
- ✅ CORS enabled for frontend communication

## Tech Stack

- Node.js & Express
- TypeScript
- Google Generative AI SDK
- CORS middleware
