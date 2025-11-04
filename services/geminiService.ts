// services/geminiService.ts
import { Message, PrebuiltVoice, UserSettings } from "../types";

const BACKEND_URL =
  (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:3001";

class GeminiService {
  async *sendMessage(
    userMessage: string,
    history: Message[],
    userSettings: UserSettings,
    imageUrl?: string
  ): AsyncGenerator<Partial<Message> | { lockdown: boolean }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history,
          userSettings,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              return;
            }
            try {
              const chunk = JSON.parse(data);
              yield chunk;
            } catch (e) {
              console.error("Failed to parse chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in GeminiService:", error);
      let userFriendlyMessage =
        "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("HTTP error")) {
          userFriendlyMessage =
            "Unable to connect to the backend server. Please make sure it's running.";
        } else if (error.message.toLowerCase().includes("fetch failed")) {
          userFriendlyMessage =
            "I'm having trouble connecting to the network. Please check your internet connection.";
        }
      }

      yield {
        text: userFriendlyMessage,
        isError: true,
      };
    }
  }

  async textToSpeech(
    text: string,
    voiceName: PrebuiltVoice = "Kore"
  ): Promise<string | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/text-to-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice: voiceName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.audioData || null;
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
