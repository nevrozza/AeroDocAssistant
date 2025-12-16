import {StringUtils} from "../../shared";
import {type RefObject, useRef} from "react";

export interface AIChatBoxViewModel {
    onSendClick: () => void,
    textFieldRef: RefObject<HTMLTextAreaElement | null>
}

const aiChatBoxViewModel = (onSend: (text: string) => void): AIChatBoxViewModel => {

    const textFieldRef = useRef<HTMLTextAreaElement>(null);

    const onSendClick = (): void => {
        const text = textFieldRef.current?.value;
        if (StringUtils.isBlank(text)) {
            return;
        }
        onSend(text!!)
    }

    return {onSendClick: onSendClick, textFieldRef: textFieldRef}
}
export default aiChatBoxViewModel