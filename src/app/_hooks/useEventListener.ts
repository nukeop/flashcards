import { useEffect, useRef } from 'react';

type Handler = (event: Event) => void;

export const useEventListener = (eventName: string, handler: Handler) => {
    const savedHandler = useRef<Handler>();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const eventListener = (event: Event) =>
            savedHandler.current && savedHandler.current(event);

        document.addEventListener(eventName, eventListener);

        return () => {
            document.removeEventListener(eventName, eventListener);
        };
    }, [eventName]);
};
