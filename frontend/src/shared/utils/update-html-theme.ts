export function setHtmlTheme(theme: string = localStorage.getItem("theme") ? localStorage.getItem("theme")!! : "dark") {
    const html = document.querySelector('html');
    html?.style.setProperty('color-scheme', theme);
}