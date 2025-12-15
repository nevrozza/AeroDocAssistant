import { colors } from "../utils/colors";
import "./select-button.css"

interface SelectButtonProps{
    isSelected?: boolean;
    text?: string;
    color?: string;
    onClick?: () => void;
    width?: string;
    height?: string;
}

const SelectButton = ({isSelected = false, text = "", color = colors.background, onClick, width = "220px", height = "24px"} : SelectButtonProps) => {
    return <button onClick={onClick} className="button-container hoverable clickable" style={{backgroundColor: !isSelected ? color: colors.primaryContainer, height: height, width: width}}>
        <div className="text-container">{text}</div>
    </button>
}

export default SelectButton