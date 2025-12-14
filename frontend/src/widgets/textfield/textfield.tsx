import type {Icon} from "../utils/icon";
import "./textfield.css"
import {colors, IconButton} from "../../widgets"
import {type FC, type RefObject, useEffect, useState} from "react";
import * as React from "react";
import {StringUtils} from "../../shared";

interface TextFieldProps {
    ref: RefObject<HTMLTextAreaElement | null>;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    trailingIcon?: Icon;
    trailingIconHidable?: boolean;
    onTrailingIconClick?: () => void;
    placeholder?: string;
    minLines?: number;
    maxLines?: number;
}

const TextField: FC<TextFieldProps> = (props: TextFieldProps) => {
    const minBorderRadius = 20; // минимальное скругление при максимальном количестве строк
    const maxBorderRadius = 30; // максимальное скругление при одной строке
    const [currentLines, setCurrentLines] = useState(props.minLines || 1);
    const [borderRadius, setBorderRadius] = useState(maxBorderRadius);

    const trailingIconHidable = props.trailingIconHidable || true
    const [trailingIconVisible, setTrailingIconVisible] = useState(true);


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
        props.onChange?.(e);
        setTrailingIconVisible(StringUtils.isEmpty(e.target.value) || !trailingIconHidable);

        // Auto-resize
        const textarea = e.target;
        textarea.style.height = 'auto';

        const lineHeight = 16 * 1.5;
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
                ref={props.ref}
                placeholder={props.placeholder || "Введите запрос"}
                className="textbox"
                onChange={handleChange}
                rows={props.minLines || 1}
                style={{
                    minHeight: `${(props.minLines || 1) * 16 * 1.5}px`,
                    maxHeight: `${(props.maxLines || 5) * 16 * 1.5}px`,
                    paddingLeft: 30,
                    paddingRight: trailingIconHidable ? 30 : 0,
                }}
            />
            {props.trailingIcon && (
                <div className="trailing-icon"
                     style={{
                         transition: 'all 0.3s ease',
                         opacity: trailingIconVisible ? 1 : 0,
                         transform: `translateX(${trailingIconVisible ? 0 : '10px'})`,
                         pointerEvents: trailingIconVisible ? 'auto' : 'none',
                         position: trailingIconVisible ? 'initial' : 'absolute',
                         right: 0, // абсолют в правой части
                     }}>
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