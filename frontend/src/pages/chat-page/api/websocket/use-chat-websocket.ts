
import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ChatWebSocketService } from './chat-websocket-service.ts';
import type { IChatContent } from '../chat-models.ts';

export const useChatWebSocket = (chatId?: string) => {
    const queryClient = useQueryClient();
    const wsServiceRef = useRef<ChatWebSocketService | null>(null);

    useEffect(() => {
        if (!chatId) {
            wsServiceRef.current?.disconnect();
            return;
        }

        if (!wsServiceRef.current) {
            wsServiceRef.current = new ChatWebSocketService();
        }

        const wsService = wsServiceRef.current;

        wsService.setChatUpdateHandler((setNewData) => {
            queryClient.setQueryData<IChatContent>(
                ['chats', 'content', chatId],
                setNewData
            );
        });

        wsService.connect(chatId);

        return () => {
            wsService.disconnect();
        };
    }, [chatId, queryClient]);

    const sendMessage = useCallback((text: string) => {
        if (!chatId || !wsServiceRef.current) {
            throw new Error('WebSocket is not ready');
        }
        queryClient.setQueryData<IChatContent>(
            ['chats', 'content', chatId],
            (oldData) => {
                // TODO: Создать чат + navigation + обновить меню слева
                if (!oldData) {
                    return {
                        chatId,
                        title: 'Новый чат',
                        messages: [{
                            isMine: true,
                            text,
                            usedFragments: []
                        }],
                        usedDocuments: []
                    };
                }

                return {
                    ...oldData,
                    messages: [
                        ...oldData.messages,
                        {
                            isMine: true,
                            text,
                            usedFragments: []
                        }
                    ]
                };
            }
        );

        wsServiceRef.current.sendMessage(text);
    }, [chatId, queryClient]);

    return {
        sendMessage,
        isConnected: wsServiceRef.current?.isConnected() || false
    };
};