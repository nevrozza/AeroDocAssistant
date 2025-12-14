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
       }) => {

    return <button className={enabled ? "container hoverable clickable" : "container"}
                   style={{width: radius, height: radius, backgroundColor: containerColor, color: iconColor}}
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