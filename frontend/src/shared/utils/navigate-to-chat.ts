import {type NavigateFunction} from "react-router-dom";

export function navigateToChat(navigate: NavigateFunction, id: string, replace: boolean) {
    navigate(`/chats/${id}`, {replace: replace});
}