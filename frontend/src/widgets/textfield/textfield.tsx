import type { Icon } from "../utils/icon";
import "./textfield.css"
import {colors, IconButton} from "../../widgets"
import { type FC, type RefObject } from "react";

interface TextFieldProps {
    value?: string;
    onChange?: (value: string) => void;
    trailingIcon?: Icon;
    onTrailingIconClick?: () => void;
    ref: RefObject<HTMLInputElement | null>
}

const TextField: FC<TextFieldProps> = (props: TextFieldProps) => {

    const handleChange = () => {
        const value = props.ref.current?.value
        props.onChange?.(value || "")
    };
    return (
        <div className="textbox-container" style={{backgroundColor: colors.containerHigh}}>
            <input
                ref={props.ref}
                placeholder="Введите запрос"

                className="textbox"
                onChange={handleChange}
            />
            {props.trailingIcon && (
                <div className="trailing-icon">
                    <IconButton onClick={props.onTrailingIconClick} icon={props.trailingIcon} radius={48}></IconButton>
                </div>
            )}
        </div>
    );
};

export default TextField;