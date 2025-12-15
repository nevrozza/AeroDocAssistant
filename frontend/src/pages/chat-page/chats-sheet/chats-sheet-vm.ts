import {useQuery} from '@tanstack/react-query';
import {ChatService} from "../api/chat-service.ts";
import type {IChatMetadata} from "../api/chat-models.ts";
import {useNavigate} from "react-router-dom";

export interface ChatSheetViewModel {
    chats: IChatMetadata[];
    pickedId?: string;
    onChatClick: (id: string) => void;
    createChat: () => void;
}

const chatSheetViewModel = (chatId?: string, chatService: ChatService = new ChatService()): ChatSheetViewModel => {
    const navigate = useNavigate();

    const useChats = useQuery({
        queryKey: ['chats', 'metadata'],
        queryFn: chatService.fetchChatMetadataList,
        retry: 2
    });

    const onChatClick = (id: string): void => {
        navigateToChat(id)
    }

    const createChat = (): void => {
        const newChatId = 'new'
        navigateToChat(newChatId)
    }

    const navigateToChat = (id: string): void => {
        navigate(`/chats/${id}`, {replace: chatId == null});
    }

    return {
        chats: useChats.data ? useChats.data : [],
        pickedId: chatId,
        onChatClick: onChatClick,
        createChat: createChat
    }
}
export default chatSheetViewModel