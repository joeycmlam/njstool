// poe-chat-engine.ts
import axios from "axios";

interface ChatMessage {
    sender: "user" | "bot";
    content: string;
}

interface PoeChatAPIResponse {
    message: string;
}

export default class PoeChatEngine {
    private baseUrl = "https://api.poe.com/v1";
    private apiKey = "your_api_key";
    private messages: ChatMessage[] = [];

    constructor() {}

    public async sendMessage(userMessage: string): Promise<void> {
        this.messages.push({ sender: "user", content: userMessage });
        const botMessage = await this.getBotResponse(userMessage);
        this.messages.push({ sender: "bot", content: botMessage });
    }

    private async getBotResponse(userMessage: string): Promise<string> {
        try {
            const response = await axios.post<PoeChatAPIResponse>(
                `${this.baseUrl}/chat`,
                { message: userMessage },
                { headers: { "Authorization": `Bearer ${this.apiKey}` } }
            );
            return response.data.message;
        } catch (error) {
            console.error("Error in Poe Chat API:", error);
            return "Sorry, I couldn't process your message.";
        }
    }

    public getChatHistory(): ChatMessage[] {
        return this.messages;
    }
}

