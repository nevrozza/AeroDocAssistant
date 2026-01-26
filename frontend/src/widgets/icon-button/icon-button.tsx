import {type FC} from "react";

import "./icon-button.css"
import {colors, type Icon} from "../../widgets"
import * as React from "react";


interface IconButtonProps {
    radius?: number,
    iconSize?: number,
    iconColor?: string,
    containerColor?: string,
    opacity?: number,
    onClick?: (event?: React.MouseEvent) => void,
    icon: Icon;
    enabled?: boolean;
    border?: string
}

const IconButton: FC<IconButtonProps>
    = ({
           radius = 48,
           iconSize = radius - 20,
           iconColor = colors.onBackground,
           containerColor = colors.containerHigh,
           opacity = iconColor !== colors.onBackground ? 1 : .7,
           onClick = () => null,
           icon: Icon,
           enabled = true,
           border = "0 solid transparent"
       }) => {

    return <button className={enabled ? "icon-button-container hoverable clickable" : "icon-button-container"}
                   style={{
                       width: radius, height: radius, backgroundColor: containerColor, color: iconColor,
                       transition: "var(--clickable-transition), color 600ms", border: border
                   }}
                   onClick={enabled ? onClick : undefined}
    >
        <Icon
            style={
                {
                    height: iconSize, width:
                    iconSize,
                    opacity: opacity,
                }
            }
        />
    </button>

};


export default IconButton;