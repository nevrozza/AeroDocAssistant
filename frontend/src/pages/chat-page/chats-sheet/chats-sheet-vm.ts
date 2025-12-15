import {useState} from "react";
import {useQuery} from '@tanstack/react-query';
import {ChatService} from "../api/chat-service.ts";
import type {IChatMetadata} from "../api/chat-models.ts";

export interface ChatSheetViewModel {
    chats: IChatMetadata[];
    pickedId: string;
    onChatClick: (id: string) => void;
    onCreateChatClick: () => void;
}

// TODO
const chatSheetViewModel = (chatService: ChatService = new ChatService()): ChatSheetViewModel => {


    const useChats = useQuery({
        queryKey: ['chats', 'metadata'], // Ключ для кэширования
        queryFn: chatService.fetchChatMetadataList,
        retry: 2
    });

    const [pickedId, setPickedId] = useState<string>("") // it's ok if not null?

    const onChatClick = (id: string): void => {
        setPickedId(id);
    }

    const onCreateChatClick = (): void => {
        setPickedId("new-id")
    }

    return {
        chats: useChats.data ? useChats.data : [],
        pickedId: pickedId,
        onChatClick: onChatClick,
        onCreateChatClick: onCreateChatClick
    }
}
export default chatSheetViewModel