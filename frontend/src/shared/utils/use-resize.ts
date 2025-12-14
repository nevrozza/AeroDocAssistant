import {useEffect, useState} from "react";

export function useResize(container: Window) {
    const [windowSize, setWindowSize] = useState({
        width: container.innerWidth,
        height: container.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: container.innerWidth,
                height: container.innerHeight,
            });
        }

        container.addEventListener('resize', handleResize);

        // Вызываем сразу для получения начальных размеров
        handleResize();

        // Очистка
        return () => container.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}