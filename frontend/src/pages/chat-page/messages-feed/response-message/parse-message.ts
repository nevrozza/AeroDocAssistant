import type {IFragment} from "../../../../shared/entities/fragment.ts";
import type {IMessagePart} from "./parts/parts.ts";




export const parseMessage = (message: string, fragmentMap: Map<string, IFragment>): IMessagePart[] => {
    const result: IMessagePart[] = [];

    // Улучшенная регулярка с именованными группами
    const quoteRegex = /\{\{\{\s*\[frag:(?<fragmentId>[a-f0-9\-]+)\]\s*(?<quoteText>.*?)\s*\}\}\}/gs;

    // const fragmentMap = fragments.reduce((map, fragment) => {
    //     map.set(fragment.id, fragment);
    //     return map;
    // }, new Map<string, IFragment>());

    let lastIndex = 0;

    const matches = message.matchAll(quoteRegex);

    for (const match of matches) {
        const {fragmentId, quoteText} = match.groups!;
        const matchIndex = match.index!;

        // Текст перед цитатой
        if (matchIndex > lastIndex) {
            const textBefore = message.slice(lastIndex, matchIndex).trim();
            if (textBefore) {
                result.push({text: textBefore});
            }
        }

        // Обработка цитаты
        const fragment = fragmentMap.get(fragmentId);
        if (fragment) {
            result.push({
                quote: quoteText.trim(),
                fragment
            });
        } else {
            // Если фрагмент не найден, добавляем как текст
            result.push({text: match[0]});
        }

        lastIndex = matchIndex + match[0].length;
    }

    // Оставшийся текст
    if (lastIndex < message.length) {
        const remainingText = message.slice(lastIndex).trim();
        if (remainingText) {
            result.push({text: remainingText});
        }
    }

    return result.length > 0 ? result : message.trim() ? [{text: message.trim()}] : [];
}