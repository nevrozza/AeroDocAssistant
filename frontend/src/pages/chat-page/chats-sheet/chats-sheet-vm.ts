import {useQuery} from '@tanstack/react-query';
import {ChatService} from "../api/chat-service.ts";
import type {IChatMetadata} from "../api/chat-models.ts";
import {useNavigate} from "react-router-dom";
import {navigateToChat} from "../../../shared";

export interface ChatSheetViewModel {
    chats: IChatMetadata[];
    pickedId?: string;
    onChatClick: (id: string) => void;
    onCreateChatClick: () => void;
    refetchChats: () => Promise<any>;
}

const chatSheetViewModel = (chatId?: string, chatService: ChatService = new ChatService()): ChatSheetViewModel => {
    const navigate = useNavigate()
    const useChats = useQuery({
        queryKey: ['chats', 'metadata'],
        queryFn: chatService.fetchChatMetadataList,
        retry: 2,
    });

    const onChatClick = (id: string): void => {
        navigateToChat(navigate, id, chatId == null)
    }

    const onCreateChatClick = (): void => {
        navigateToChat(navigate, '', chatId == null)
    }


    return {
        chats: useChats.data ? useChats.data : [],
        pickedId: chatId,
        onChatClick: onChatClick,
        onCreateChatClick: onCreateChatClick,
        refetchChats: useChats.refetch,
    }
}
export default chatSheetViewModel