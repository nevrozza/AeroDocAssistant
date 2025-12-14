import {StringUtils} from "../../shared";
import {type RefObject, useRef} from "react";

export interface AiChatBoxViewModel {
    onSendClick: () => void,
    textFieldRef: RefObject<HTMLTextAreaElement | null>
}

const aiChatBox = (): AiChatBoxViewModel => {

    const textFieldRef = useRef<HTMLTextAreaElement>(null);

    const onSendClick = (): void => {
        const text = textFieldRef.current?.value;
        if (StringUtils.isBlank(text)) {
            return;
        }
        console.log('onSendClick', text);
    }

    return {onSendClick: onSendClick, textFieldRef: textFieldRef}
}
export default aiChatBox