import type {IChatContent, IChatMetadata} from "./chat-models.ts";
import {ChatMapper} from "./chat-mapper.ts";
import {chatApi} from "./chat-api.ts";

export class ChatService {
    async fetchChatMetadataList(): Promise<IChatMetadata[]> {
        try {
            const chatMetadataDTOs = await chatApi.fetchChatMetadataList();
            return chatMetadataDTOs.map(ChatMapper.metadataToDomain)
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
}