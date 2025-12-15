import type {ChatMetadataDTO} from "./chat-dtos.ts";
import {apiClient} from "../../../shared";

export const chatApi = {
    fetchChatMetadataList: async (): Promise<ChatMetadataDTO[]> => {
        return (await apiClient.get("/chat/list/")).data
    }
}