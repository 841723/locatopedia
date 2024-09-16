import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// Hook personalizado para manejar cookies de forma reactiva
export const useCookie = (cookieName) => {
    const [cookieValue, setCookieValue] = useState(() =>
        Cookies.get(cookieName)
    );

    // Función para actualizar la cookie y el estado
    const updateCookie = (value, options = {}) => {
        Cookies.set(cookieName, value, options);
        setCookieValue(value);
    };

    // Función para eliminar la cookie
    const removeCookie = () => {
        Cookies.remove(cookieName);
        setCookieValue(null);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const newValue = Cookies.get(cookieName);
            if (newValue !== cookieValue) {
                setCookieValue(newValue); // Si el valor cambia, actualizar el estado
            }
        }, 1000); // Comprobar cambios cada segundo

        return () => clearInterval(interval); // Limpiar el intervalo cuando se desmonte el componente
    }, [cookieValue, cookieName]);

    return [cookieValue, updateCookie, removeCookie];
};

