import type { Icon } from "../utils/icon";
import "./textfield.css"
import {colors, IconButton} from "../../widgets"
import { useState, type FC } from "react";

interface TextFieldProps {
    value?: string;
    onChange?: (value: string) => void;
    trailingIcon?: Icon;
    onTrailingIconClick?: () => void;
}

const TextField: FC<TextFieldProps> = (props: TextFieldProps) => {

    const [value, setValue] = useState<string>(props.value || "")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    };
    return (
        <div className="textbox-container" style={{backgroundColor: colors.containerHigh}}>
            <input 
                value={value}
                placeholder="Введите запрос" 
                className="textbox"
                onChange={handleChange}
                style={{backgroundColor: colors.containerHigh}}
            />
            {props.trailingIcon && (
                <div className="trailing-icon">
                    <IconButton onClick={props.onTrailingIconClick} icon={props.trailingIcon} radius={50}></IconButton>
                </div>
            )}
        </div>
    );
};

export default TextField;