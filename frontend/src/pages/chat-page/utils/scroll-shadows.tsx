import {colors} from "../../../widgets";

export const TopScrollShadow = () => {
  return (
      <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "70px",
          background: `linear-gradient(to bottom, 
                ${colors.background} 0%, 
                ${colors.transparent} 100%)`,
          pointerEvents: "none", /* Чтобы клики проходили сквозь */
          zIndex: 1
      }} />
  )
}
export const BottomScrollShadow = () => {
  return (
      <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100px",
          background: `linear-gradient(to top, 
                ${colors.background} 0%, 
                ${colors.transparent} 100%)`,
          pointerEvents: "none", /* Чтобы клики проходили сквозь */
          zIndex: 1
      }} />
  )
}