import {useQuery} from "@tanstack/react-query";
import {ChatService} from "./api/chat-service.ts";
import type {IChatContent} from "./api/chat-models.ts";

export interface ChatPageViewModel {
    chatContent?: IChatContent;
}

const chatPageViewModel = (chatId?: string, chatService: ChatService = new ChatService()): ChatPageViewModel => {

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
        chatContent: useChatContent.data
    }
}
export default chatPageViewModel