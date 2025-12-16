import type {ChatContentDTO, ChatMetadataDTO} from "./chat-dtos.ts";
import {apiClient} from "../../../shared";

export const chatApi = {
    fetchChatMetadataList: async (): Promise<ChatMetadataDTO[]> => {
        return (await apiClient.get("/chat/list/")).data
    },

    fetchChatContent: async (chatId: string): Promise<ChatContentDTO> => {
        return (await apiClient.get(`/chat/${chatId}/`)).data
    },

    createChat: async (documentId: string | undefined): Promise<ChatMetadataDTO> => {
        return (await (documentId ? apiClient.get(`chat/?document=${documentId}`) : apiClient.post(`/chat/create`))).data
    }
}