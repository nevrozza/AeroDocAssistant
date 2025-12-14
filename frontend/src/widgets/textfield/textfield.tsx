import type { Icon } from "../utils/icon";
import "./textfield.css"
import {colors, IconButton} from "../../widgets"
import {type FC, type RefObject, useEffect, useRef, useState} from "react";
import * as React from "react";

interface TextFieldProps {
    value?: string;
    onChange?: (value: string) => void;
    trailingIcon?: Icon;
    onTrailingIconClick?: () => void;
    ref: RefObject<HTMLTextAreaElement | null>;
    placeholder?: string;
    minLines?: number;
    maxLines?: number;
}

const TextField: FC<TextFieldProps> = (props: TextFieldProps) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);

    const minBorderRadius = 20; // минимальное скругление при максимальном количестве строк
    const maxBorderRadius = 30; // максимальное скругление при одной строке
    const [currentLines, setCurrentLines] = useState(props.minLines || 1);
    const [borderRadius, setBorderRadius] = useState(maxBorderRadius);

    useEffect(() => {
        if (props.ref) {
            (props.ref as any).current = internalRef.current;
        }
    }, [props.ref]);

    useEffect(() => {
        // Рассчитываем скругление в зависимости от количества строк
        const maxLines = props.maxLines || 5;

        // Линейная интерполяция: больше строк -> меньше скругление
        let newBorderRadius = maxBorderRadius;

        if (currentLines > 1) {
            // Рассчитываем процент заполнения от 1 до maxLines
            const percentage = Math.min((currentLines - 1) / (maxLines - 1), 1);
            // Интерполируем значение скругления
            newBorderRadius = maxBorderRadius - (percentage * (maxBorderRadius - minBorderRadius));
            // Округляем до целого числа
            newBorderRadius = Math.round(newBorderRadius);
        }

        setBorderRadius(newBorderRadius);
    }, [currentLines, props.maxLines]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange?.(e.target.value);

        // Auto-resize
        const textarea = e.target;
        textarea.style.height = 'auto';

        const lineHeight = 16*1.5;
        const minHeight = (props.minLines || 1) * lineHeight;
        const maxHeight = (props.maxLines || 5) * lineHeight;

        const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
        textarea.style.height = newHeight + 'px';

        // Определяем текущее количество строк
        const lines = Math.floor(textarea.scrollHeight / lineHeight);
        setCurrentLines(lines);
    };

    return (
        <div className="textbox-container" style={{backgroundColor: colors.containerHigh, borderRadius: borderRadius}}>
            <textarea
                ref={internalRef}
                placeholder={props.placeholder || "Введите запрос"}
                className="textbox"
                onChange={handleChange}
                rows={props.minLines || 1}
                style={{
                    minHeight: `${(props.minLines || 1) * 24}px`,
                    maxHeight: `${(props.maxLines || 5) * 24}px`,
                }}
            />
            {props.trailingIcon && (
                <div className="trailing-icon">
                    <IconButton
                        onClick={props.onTrailingIconClick}
                        icon={props.trailingIcon}
                        radius={48}
                    />
                </div>
            )}
        </div>
    );
};

export default TextField;