import {useEffect, useState} from "react"
import {setHtmlTheme} from "../../shared";



export interface ThemeViewModel {
    theme: string,
    toggleTheme: () => void,
}

const themeButton = (): ThemeViewModel => {


    const [theme, setTheme] = useState<string>("light dark")

    useEffect(() => {
        const theme = localStorage.getItem('theme')
        setTheme(theme ? theme : "light dark")
    }, [])

    const updateTheme =  (theme: string) => {
        localStorage.setItem('theme', theme)
        setHtmlTheme(theme)
        setTheme(theme)
    }

    const toggleTheme =  () => {
        const theme = localStorage.getItem('theme');
        switch (theme) {
            case 'dark':
                updateTheme('light')
                break;
            case 'light':
                updateTheme('light dark')
                break;

            case null:
            case 'light dark':
                updateTheme('dark')
                break;
        }
    }
    return {theme, toggleTheme}
}
export default themeButton