import type { IChatContent } from "../chat-models.ts";

export type WebSocketEventHandler = (event: WebSocketEvent) => void;
export type ChatUpdateHandler = (updateFn: (oldData: IChatContent | undefined) => IChatContent) => void;

// @ts-ignore
export enum WebSocketEventType {
    MESSAGE_CHUNK = "MESSAGE_CHUNK",
    ERROR = "ERROR",
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED"
}

export interface WebSocketEvent {
    type: WebSocketEventType;
    payload?: any;
}

export class ChatWebSocketService {
    private ws: WebSocket | null = null;
    private eventHandlers: WebSocketEventHandler[] = [];
    private chatUpdateHandler: ChatUpdateHandler | null = null;

    connect(chatId: string): void {
        this.disconnect();
        this.ws = new WebSocket(`ws://localhost:8000/chat/${chatId}`); // TODO

        this.ws.onopen = () => {
            this.notifyEventHandlers({ type: WebSocketEventType.CONNECTED });
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleIncomingMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
                this.notifyEventHandlers({
                    type: WebSocketEventType.ERROR,
                    payload: { error: 'Failed to parse message' }
                });
            }
        };

        this.ws.onerror = (error) => {
            this.notifyEventHandlers({
                type: WebSocketEventType.ERROR,
                payload: { error }
            });
        };

        this.ws.onclose = () => {
            this.notifyEventHandlers({ type: WebSocketEventType.DISCONNECTED });
            this.ws = null;
        };
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    sendMessage(text: string): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
        }
        this.ws.send(JSON.stringify({ event_type: "USER_MESSAGE", text }));
    }

    addEventHandler(handler: WebSocketEventHandler): void {
        this.eventHandlers.push(handler);
    }

    removeEventHandler(handler: WebSocketEventHandler): void {
        this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    }

    setChatUpdateHandler(handler: ChatUpdateHandler): void {
        this.chatUpdateHandler = handler;
    }

    private handleIncomingMessage(data: any): void {
        switch (data.event_type) {
            case "MESSAGE_CHUNK":
                this.handleMessageChunk(data.chunk_text);
                console.log("chunk:", data.chunk_text);
                this.notifyEventHandlers({
                    type: WebSocketEventType.MESSAGE_CHUNK,
                    payload: { chunkText: data.chunk_text }
                });
                break;
            case "ERROR":
                this.notifyEventHandlers({
                    type: WebSocketEventType.ERROR,
                    payload: { error: data.error_text }
                });
                break;
        }
    }

    private handleMessageChunk(chunkText: string): void {
        if (!this.chatUpdateHandler) return;

        this.chatUpdateHandler((oldData) => {
            if (!oldData) {
                throw new Error("There is no chat!")
            }

            const messages = [...oldData.messages];
            const lastMessage = messages[messages.length - 1];

            if (lastMessage && !lastMessage.isMine) {
                messages[messages.length - 1] = {
                    ...lastMessage,
                    text: lastMessage.text + chunkText
                };
            } else {
                messages.push({
                    isMine: false,
                    text: chunkText,
                    usedFragments: []
                });
            }

            return {
                ...oldData,
                messages
            };
        });
    }

    private notifyEventHandlers(event: WebSocketEvent): void {
        this.eventHandlers.forEach(handler => handler(event));
    }

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
}