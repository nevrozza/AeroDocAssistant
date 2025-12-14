import {colors, type Icon, IconButton} from "../../widgets";
import themeButtonViewModel, {type ThemeViewModel} from "./theme-button-vm.ts";
import {LuSunMedium, LuMoon, LuSunMoon} from 'react-icons/lu'


const ThemeButton = () => {
    const viewModel: ThemeViewModel = themeButtonViewModel();

    const getThemeIcon = (theme: string): Icon => {
        return (theme === null || theme === "light dark")
            ? LuSunMoon : (theme === "dark" ? LuMoon : LuSunMedium)
    }

    return (
        <IconButton icon={getThemeIcon(viewModel.theme)} containerColor={colors.transparent} opacity={1}
                    onClick={viewModel.toggleTheme}/>
    )
};

export default ThemeButton;