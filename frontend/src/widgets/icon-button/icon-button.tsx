import  {type FC} from "react";

import "./icon-button.css"
import {colors, type Icon} from "../../widgets"
import * as React from "react";


interface IconButtonProps {
    radius?: number,
    iconColor?: string,
    containerColor?: string,
    opacity?: number,
    onClick?: (event?: React.MouseEvent) => void,
    icon: Icon;
}

const IconButton: FC<IconButtonProps>
    = ({
           radius = 48,
           iconColor = colors.onBackground,
           containerColor = colors.containerHigh,
           opacity = iconColor !== colors.onBackground ? 1 : .7,
           onClick = () => null,
           icon: Icon
       }) => {
    const iconSize = radius - 20;

    return <button className="container hoverable clickable"
                   style={{width: radius, height: radius, backgroundColor: containerColor, color: iconColor}}
                   onClick={ (event) => onClick(event)}
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