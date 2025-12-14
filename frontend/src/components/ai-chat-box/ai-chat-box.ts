import {StringUtils} from "../../shared";

export interface AiChatBoxViewModel {
    onSendClick: (text: string) => void,
}

const aiChatBox = (): AiChatBoxViewModel => {

    const onSendClick = (text: string): void => {
        if (StringUtils.isBlank(text)) {
            return;
        }
        console.log('onSendClick', text);
    }

    return {onSendClick: onSendClick}
}
export default aiChatBox