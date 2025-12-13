import ReactDOM from 'react-dom/client';
import App from "./app.tsx";
import './styles/index.css'
import './styles/theme.css'
import './styles/common.css'


const root = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(root).render(<App/>);

setTimeout(() => {
    document.documentElement.style.cssText = `
    --enable-theme-transitions: 1;
  `;
}, 100);