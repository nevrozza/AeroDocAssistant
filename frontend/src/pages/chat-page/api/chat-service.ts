import type {IChatContent, IChatMetadata} from "./chat-models.ts";
import {ChatMapper} from "./chat-mapper.ts";
import {chatApi} from "./chat-api.ts";

export class ChatService {
    async fetchChatMetadataList(): Promise<IChatMetadata[]> {
        try {
            const chatMetadataDTOs = await chatApi.fetchChatMetadataList();
            return chatMetadataDTOs.reverse().map(ChatMapper.metadataToDomain)
        } catch (error: any) {
            throw new Error(`Failed to fetch chatList: ${error.message}`);
        }
    }

    async fetchChatContent(chatId: string): Promise<IChatContent> {
        try {
            const chatContentDTO = await chatApi.fetchChatContent(chatId);
            return ChatMapper.contentToDomain(chatContentDTO);
        } catch (error: any) {
            throw new Error(`Failed to fetch chatContent: ${error.message}`);
        }
    }

    async createChat(chatId: string | undefined): Promise<IChatMetadata> {
        try {
            const chatMetadataDTO = await chatApi.createChat(chatId);
            return ChatMapper.metadataToDomain(chatMetadataDTO);
        } catch (error: any) {
            throw new Error(`Failed to create chat: ${error.message}`);
        }
    }
}