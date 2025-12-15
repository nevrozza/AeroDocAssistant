import ReactDOM from 'react-dom/client';
import App from "./app.tsx";
import './styles/index.css'
import './styles/theme.css'
import './styles/common.css'
import './styles/colors.css'
import {setHtmlTheme} from "../shared";


const root = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(root).render(<App/>);

setHtmlTheme()

setTimeout(() => {
    document.documentElement.style.setProperty("--enable-theme-transitions", "1");
}, 100);
