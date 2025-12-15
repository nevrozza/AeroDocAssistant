import {colors} from "../utils/colors";
import "./select-button.css"

interface SelectButtonProps {
    isSelected?: boolean;
    text?: string;
    onClick?: () => void;
    width?: string;
}

const SelectButton = ({
                          isSelected = false,
                          text = "Select me!",
                          onClick,
                          width = ""
                      }: SelectButtonProps) => {
    return <button onClick={onClick} className="select-button-container hoverable clickable" style={{
        backgroundColor: isSelected ? colors.primaryContainer : colors.background,
        color: isSelected ? colors.onPrimaryContainer : colors.onBackground,
        width: width,
        // Тут, т.к. в стилях оно перезаписывается transition clickable и из-за этого выходит не оч(
        transition: "var(--clickable-transition), color 400ms, background-color 400ms"
    }}>
        <div className="select-button-text">{text}</div>
    </button>
}

export default SelectButton