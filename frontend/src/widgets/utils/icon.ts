import * as React from "react";
import type {CSSProperties} from "react";

export type Icon = React.ComponentType<{ style?: CSSProperties, size?: string | number; color?: string; }>;