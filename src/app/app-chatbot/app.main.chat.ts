import PoeChatEngine from "./poeChatEngine";


(async () => {
    const chat = new PoeChatEngine();

    await chat.sendMessage("Hello, Poe Chatbot!");
    await chat.sendMessage("What can you do?");

    console.log(chat.getChatHistory());
})();
