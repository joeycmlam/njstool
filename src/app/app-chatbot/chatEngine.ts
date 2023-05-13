// chat-engine.ts
import axios from "axios";

interface ChatMessage {
    sender: "user" | "bot";
    content: string;
}

interface ClaudeOpenAPIResponse {
    message: string;
}

export default class ChatEngine {
    private baseUrl = "https://api.claude.com/v1";
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
            const response = await axios.post<ClaudeOpenAPIResponse>(
                `${this.baseUrl}/chat`,
                { message: userMessage },
                { headers: { "Authorization": `Bearer ${this.apiKey}` } }
            );
            return response.data.message;
        } catch (error) {
            console.error("Error in Claude Open API:", error);
            return "Sorry, I couldn't process your message.";
        }
    }

    public getChatHistory(): ChatMessage[] {
        return this.messages;
    }
}

