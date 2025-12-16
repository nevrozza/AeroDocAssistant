
import {useEffect, useRef, useCallback, useState} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {ChatWebSocketService, WebSocketEventType} from './chat-websocket-service.ts';
import type { IChatContent } from '../chat-models.ts';

const useChatWebSocket = (chatId?: string) => {
    const queryClient = useQueryClient();
    const wsServiceRef = useRef<ChatWebSocketService | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!chatId) {
            wsServiceRef.current?.disconnect();
            wsServiceRef.current = null;
            setIsReady(false)
            return;
        }

        if (!wsServiceRef.current) {
            wsServiceRef.current = new ChatWebSocketService();
        }

        const handleConnected = () => {
            setIsReady(true);
        };

        const handleDisconnected = () => {
            setIsReady(false);
        };

        const wsService = wsServiceRef.current;


        wsService.addEventHandler((event) => {
            if (event.type === WebSocketEventType.CONNECTED) {
                handleConnected();
            } else if (event.type === WebSocketEventType.DISCONNECTED) {
                handleDisconnected();
            }
        });

        wsService.setChatUpdateHandler((setNewData) => {
            queryClient.setQueryData<IChatContent>(
                ['chats', 'content', chatId],
                setNewData
            );
        });
        console.log("connect to:", chatId);
        wsService.connect(chatId);


        return () => {
            console.log("disconnect from:", chatId);
            wsService.disconnect();
        };
    }, [chatId, queryClient]);

    const sendMessage = useCallback((text: string) => {
        console.log('sendMessage', chatId, text);
        if (!chatId || !wsServiceRef.current) {
            throw new Error(`WebSocket is not ready ${chatId}`);
        }
        queryClient.setQueryData<IChatContent>(
            ['chats', 'content', chatId],
            (oldData) => {
                if (!oldData) {
                    return;
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
        isConnected: wsServiceRef.current?.isConnected() || false,
        isReady: isReady
    };
};
export default useChatWebSocket