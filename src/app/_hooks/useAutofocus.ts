import { useEffect, useRef } from 'react';

export function useAutofocus<T extends HTMLInputElement | HTMLTextAreaElement>(
    shouldFocus: boolean = false,
) {
    const elementRef = useRef<T>(null);

    useEffect(() => {
        if (elementRef.current && shouldFocus) {
            elementRef.current.focus();
        }
    }, []);

    return elementRef;
}
