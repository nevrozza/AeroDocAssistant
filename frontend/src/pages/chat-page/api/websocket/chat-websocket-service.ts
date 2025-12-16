import type {IChatContent, IDocument, IFragment} from "../chat-models.ts";
import type {DocumentDTO, FragmentDTO} from "../chat-dtos.ts";
import {ChatMapper} from "../chat-mapper.ts";

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
            this.ws.onopen = null;
            this.ws.onmessage = null;
            this.ws.onerror = null;
            this.ws.onclose = null;

            if (this.ws.readyState === WebSocket.OPEN ||
                this.ws.readyState === WebSocket.CONNECTING) {
                this.ws.close(1000, 'Manual disconnect');
            }
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
                const chunkText: string = data.chunk_text
                const newFragments = (data.new_fragments as FragmentDTO[]).map(ChatMapper.fragmentToDomain)
                const newDocuments = (data.new_documents as DocumentDTO[]).map(ChatMapper.documentToDomain)
                this.handleMessageChunk(chunkText, newFragments, newDocuments);
                console.log("chunk:", data.chunk_text);
                this.notifyEventHandlers({
                    type: WebSocketEventType.MESSAGE_CHUNK,
                    payload: { chunkText: chunkText, newFragments: newFragments, newDocuments: newDocuments },
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

    private handleMessageChunk(chunkText: string, newFragments: IFragment[], newDocuments: IDocument[]): void {
        if (!this.chatUpdateHandler) return;

        this.chatUpdateHandler((oldData) => {
            if (!oldData) {
                throw new Error("There is no chat!")
            }

            const messages = [...oldData.messages];
            const lastMessage = messages[messages.length - 1];


            const updatedUsedDocuments = Array.from(
                new Set([
                    ...oldData.usedDocuments,
                    ...newDocuments
                ])
            )

            if (lastMessage && !lastMessage.isMine) {

                const updatedUsedFragments = Array.from(
                    new Set([
                        ...lastMessage.usedFragments,
                        ...newFragments
                    ])
                );
                messages[messages.length - 1] = {
                    ...lastMessage,
                    text: lastMessage.text + chunkText,
                    usedFragments: updatedUsedFragments
                };
            } else {
                messages.push({
                    isMine: false,
                    text: chunkText,
                    usedFragments: newFragments
                });
            }

            return {
                ...oldData,
                messages: messages,
                documents: updatedUsedDocuments
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