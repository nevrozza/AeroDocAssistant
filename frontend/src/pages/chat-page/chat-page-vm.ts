import {useQuery} from "@tanstack/react-query";
import {ChatService} from "./api/chat-service.ts";
import type {IChatContent} from "./api/chat-models.ts";
import {useChatWebSocket} from "./api/websocket/use-chat-websocket.ts";

export interface ChatPageViewModel {
    chatContent?: IChatContent;
    sendMessage: (text: string) => void;
    isWebSocketConnected: boolean;
}

const chatPageViewModel = (chatId?: string, chatService: ChatService = new ChatService()): ChatPageViewModel => {

    const useChatWebsocket = useChatWebSocket(chatId)

    const useChatContent = useQuery({
        queryKey: ['chats', 'content', chatId],
        queryFn: () => {
            if (!chatId) {
                throw new Error('No chatId provided');
            }
            return chatService.fetchChatContent(chatId!!)
        },
        retry: 2,
        enabled: !!chatId,
        refetchOnMount: false,
    });

    return {
        chatContent: useChatContent.data,
        sendMessage: useChatWebsocket.sendMessage,
        isWebSocketConnected: useChatWebsocket.isConnected
    }
}
export default chatPageViewModel