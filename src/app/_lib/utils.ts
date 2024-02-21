import { UniqueIdentifier } from '@dnd-kit/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let timerId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>): void => {
        if (timerId !== null) {
            clearTimeout(timerId);
        }

        timerId = setTimeout(() => func(...args), delay);
    };
}

export function swapItemsById<T extends { id: UniqueIdentifier }>(
    array: T[],
    id1: UniqueIdentifier,
    id2: UniqueIdentifier,
): T[] {
    const moveIndex = array.findIndex((card) => card.id === id1);
    const beforeIndex = array.findIndex((card) => card.id === id2);

    if (moveIndex === -1 || moveIndex === beforeIndex) return [...array];

    const itemToMove = array[moveIndex];
    const newArray = array.filter((_, index) => index !== moveIndex);

    if (beforeIndex === -1 || beforeIndex >= newArray.length) {
        newArray.push(itemToMove);
    } else if (moveIndex < beforeIndex) {
        newArray.splice(beforeIndex, 0, itemToMove);
    } else {
        newArray.splice(beforeIndex, 0, itemToMove);
    }

    return newArray;
}
