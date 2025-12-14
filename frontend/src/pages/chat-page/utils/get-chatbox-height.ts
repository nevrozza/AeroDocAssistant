import {type RefObject, useEffect, useState} from "react";

export const getChatboxHeight = (chatBoxRef: RefObject<HTMLDivElement | null>): number => {
    const [chatBoxHeight, setChatBoxHeight] = useState(0);

    useEffect(() => {
        if (chatBoxRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setChatBoxHeight(entry.contentRect.height);
                }
            });

            resizeObserver.observe(chatBoxRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);
    return chatBoxHeight;
}