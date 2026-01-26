import {apiClient} from "../../../shared";
import type { GraphData } from "./graph-dtos.ts";

export const graphApi = {
    getGraph: async (): Promise<GraphData> => {
        return (await apiClient.get("/graph/")).data
    },
}