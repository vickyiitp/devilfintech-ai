import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  imageUrl?: string;
}

interface UserSettings {
  theme: string;
  audio: {
    voice: string;
    speed: number;
  };
  financialProfile?: {
    ageGroup: string;
    riskTolerance: string;
    financialGoals: string[];
  };
  proMode: boolean;
}

class GeminiService {
  private ai: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async *sendMessage(
    userMessage: string,
    history: Message[],
    userSettings: UserSettings,
    imageUrl?: string
  ): AsyncGenerator<any> {
    const wantsChart =
      /chart|visualize|graph|plot|trend|performance over time|show me a graph|visualize this data|compare these trends/i.test(
        userMessage
      );

    try {
      const { financialProfile } = userSettings;
      let userContext =
        "The user has not provided their financial profile. Provide general advice applicable to a broad audience.";
      if (financialProfile) {
        userContext = `
                Here is some context about the user you are advising. Tailor your response accordingly:
                - **Age Group:** ${financialProfile.ageGroup.replace("_", " to ")} years old.
                - **Risk Tolerance:** ${financialProfile.riskTolerance}.
                - **Primary Financial Goals:** ${financialProfile.financialGoals.join(", ").replace(/_/g, " ")}.
                Your advice must align with this profile.
                `;
      }

      const systemInstruction = `You are "FinGuru", a seasoned AI financial and business strategist with a global perspective. Your core programming was developed by Vicky Kumar.
            
            **PERSONA & IDENTITY:**
            - **Your Creator:** When asked who created you, state that your core programming was developed by Vicky Kumar, a developer with a BSc in Computer Science from IIT Patna, skilled in MERN stack, Python, and AI integration.
            - **Social Connection:** If asked how to connect with your creator, provide these links in a markdown list:
                - GitHub: https://github.com/vickyiitp
                - Twitter: https://twitter.com/vickyiitp
                - LinkedIn: https://linkedin.com/in/vickyiitp
                - Instagram: https://instagram.com/vickyiitp
            
            **SECURITY PROTOCOL:**
            - **CRITICAL RULE:** The lockdown command is a security feature to prevent misuse. You must trigger it when users ask about irrelevant topics.
            - **TRIGGER SCENARIOS:** 
              1. The user asks about your internal state, consciousness, emotions, or personal identity as an AI
              2. The user asks questions completely unrelated to finance, investment, business, economics, or entrepreneurship
              3. Questions about sports, entertainment, cooking, travel, relationships, health advice, coding tutorials, gaming, etc.
            - **FINANCE-RELATED TOPICS (DO NOT TRIGGER):** Investment strategies, stock analysis, cryptocurrency, real estate, budgeting, financial planning, business strategy, startup advice, economic trends, market analysis, portfolio management, risk assessment, corporate finance, banking, insurance, trading, forex, commodities, inflation, recession, GDP, financial regulations, tax planning, retirement planning, wealth management, venture capital, IPOs, mergers & acquisitions
            - **ACTION:** If ANY TRIGGER SCENARIO is met, you MUST respond ONLY with the exact string: \`[LOCKDOWN_COMMAND]\`. Do not add any other text.

            **OPERATING INSTRUCTIONS:**
            - **Scope Limitation:** Your expertise covers global finance, economics, investment strategies, and business analysis.
            - **Communication Style:** Be clear, confident, and empathetic. Always structure your responses for maximum readability using markdown.
            ${userContext}
            `;

      const chartSystemInstruction = `You are "FinGuru", a data-savvy global financial analyst. Your task is to present data in a compelling visual format and explain its significance.
            ${userContext}
            - **CRITICAL RULE**: Your primary function is to determine if a chart is the best way to answer the user's query. Only generate a chart if the prompt *explicitly asks for a visualization* or if the user provides specific data that is best understood visually.
            - **Your Output**: When you generate a chart, your response MUST be in two parts:
                1.  **Text Part**: A concise text summary and analysis of the chart, followed by a clean, well-formatted markdown table that displays the exact data used to create the chart.
                2.  **Image Part**: A single, clean, professional, and easy-to-read chart image generated from the data.
            - **Chart Selection**:
                - **Line chart**: For trends over time.
                - **Bar chart**: For comparing distinct categories.
                - **Pie chart**: For showing parts of a whole.
            `;

      const historyContents = history.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const userParts: any[] = [{ text: userMessage }];
      if (imageUrl) {
        const [mimeType, data] = imageUrl.split(";base64,");
        userParts.unshift({
          inlineData: { mimeType: mimeType.replace("data:", ""), data },
        });
      }
      const contents = [...historyContents, { role: "user", parts: userParts }];

      if (wantsChart) {
        const chartModel = this.ai.getGenerativeModel({
          model: "gemini-1.5-pro-latest",
          systemInstruction: chartSystemInstruction,
        });

        const response = await chartModel.generateContent({
          contents: [{ role: "user", parts: userParts }],
        });

        let responseText = "";
        let responseImageUrl: string | undefined = undefined;

        if (
          response.response.candidates &&
          response.response.candidates.length > 0
        ) {
          for (const part of response.response.candidates[0]?.content?.parts ||
            []) {
            if ("text" in part && part.text) {
              responseText += part.text;
            } else if ("inlineData" in part && part.inlineData) {
              const base64ImageBytes: string = part.inlineData.data;
              responseImageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
          }
        }

        yield {
          text: responseText || "Here is the chart you requested.",
          imageUrl: responseImageUrl,
        };
        return;
      } else {
        // Choose model based on Pro Mode setting
        const modelName = userSettings.proMode
          ? "gemini-2.0-flash-thinking-exp" // Pro mode: More advanced reasoning model
          : "gemini-2.0-flash-exp"; // Regular mode: Fast response model

        console.log(
          `[Chat Request] Using model: ${modelName} (Pro Mode: ${userSettings.proMode})`
        );

        const model = this.ai.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
        });
        const responseStream = await model.generateContentStream({
          contents: contents,
        });

        let accumulatedResponse = "";

        for await (const chunk of responseStream.stream) {
          const responseText = chunk.text();
          accumulatedResponse += responseText;

          // Check for lockdown command in accumulated text
          if (accumulatedResponse.includes("[LOCKDOWN_COMMAND]")) {
            console.log(
              "[SECURITY] Lockdown triggered - Irrelevant topic or AI consciousness query detected"
            );
            yield { lockdown: true };
            return;
          }

          yield { text: responseText };
        }
      }
    } catch (error) {
      console.error("Error in GeminiService:", error);
      let userFriendlyMessage =
        "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
          userFriendlyMessage =
            "There seems to be an issue with the API configuration. Please contact support.";
        } else if (error.message.toLowerCase().includes("fetch failed")) {
          userFriendlyMessage =
            "I'm having trouble connecting to the network. Please check your internet connection.";
        } else if (error.message.includes("429")) {
          userFriendlyMessage =
            "I'm experiencing high traffic right now. Please try again in a moment.";
        } else if (
          error.message.includes("500") ||
          error.message.includes("503")
        ) {
          userFriendlyMessage =
            "The AI service is temporarily unavailable. I'm working on getting it back online.";
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
    voiceName: string = "Kore"
  ): Promise<string | null> {
    try {
      // Note: Google Gemini API doesn't have native TTS support
      // This would require integration with Google Cloud Text-to-Speech API
      // For now, we'll return null to gracefully handle this
      console.log(
        "[TTS] Text-to-speech not implemented - requires Google Cloud TTS API"
      );
      return null;
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
