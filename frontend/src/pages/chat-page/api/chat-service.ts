import type {IChatMetadata} from "./chat-models.ts";
import {ChatMapper} from "./chat-mapper.ts";
import {chatApi} from "./chat-api.ts";

export class ChatService {
    async fetchChatMetadataList(): Promise<IChatMetadata[]> {
        try {
            const chatMetadataDTOs = await chatApi.fetchChatMetadataList();
            return chatMetadataDTOs.map(ChatMapper.metadataToDomain)
        } catch (error: any) {
            throw new Error(`Failed to fetch post: ${error.message}`);
        }
    }
}