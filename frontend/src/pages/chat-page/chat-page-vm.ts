import {useQuery} from "@tanstack/react-query";
import {ChatService} from "./api/chat-service.ts";
import type {IChatContent, IChatMetadata} from "./api/chat-models.ts";
import useChatWebSocket from "./api/websocket/use-chat-websocket.ts";
import {navigateToChat, queryClient} from "../../shared";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export interface ChatPageViewModel {
    chatContent?: IChatContent;
    sendMessage: (text: string) => void;
    isWebSocketConnected: boolean;
}

const chatPageViewModel = (chatId: string | undefined, refetchChatsList: () => Promise<any>, chatService: ChatService = new ChatService()): ChatPageViewModel => {

    const navigate = useNavigate()

    const useChatWebsocket = useChatWebSocket(chatId)

    const [pendingMessage, setPendingMessage] = useState<string | null>()


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

    const sendMessage = async (text: string) => {
        if (!chatId) {
            const chat = await chatService.createChat()
            navigateToChat(navigate, chat.chatId, true)
            await refetchChatsList()
            queryClient.setQueryData<IChatMetadata[]>(
                ['chats', 'metadata'],
                (oldData) => {
                    if (!oldData) return oldData;
                    const index = oldData.findIndex(metadata => metadata.chatId === chat.chatId);
                    if (index !== -1) {
                        const newData = [...oldData];
                        newData[index] = {...newData[index], title: text};
                        return newData;
                    }
                    return oldData;
                }
            )
        }
        if (useChatWebsocket.isConnected && useChatWebsocket.isReady) {
            useChatWebsocket.sendMessage(text);
        } else {
            setPendingMessage(text);
        }
    }


    useEffect(() => {
        if (chatId && pendingMessage && useChatWebsocket.isConnected && useChatWebsocket.isReady) {
            useChatWebsocket.sendMessage(pendingMessage);
            setPendingMessage(null);
        }
    }, [chatId, pendingMessage, useChatWebsocket.isConnected, useChatWebsocket.isReady]);

    return {
        chatContent: useChatContent.data,
        sendMessage: sendMessage,
        isWebSocketConnected: useChatWebsocket.isConnected
    }
}
export default chatPageViewModel