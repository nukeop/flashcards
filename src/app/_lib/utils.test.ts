import { describe, expect, it } from 'vitest';
import { swapItemsById } from './utils';

describe('Swap array elements', () => {
    it('should move two values in a three-element array', () => {
        const result = swapItemsById(
            [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
            'a',
            'b',
        );

        expect(result).toEqual([{ id: 'b' }, { id: 'a' }, { id: 'c' }]);
    });

    it('should move the first element to the end', () => {
        const result = swapItemsById(
            [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
            'a',
            'c',
        );

        expect(result).toEqual([{ id: 'b' }, { id: 'c' }, { id: 'a' }]);
    });

    it('should move the first element to the end', () => {
        const result = swapItemsById(
            [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
            '1',
            '4',
        );

        expect(result).toEqual([
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '1' },
        ]);
    });

    it('should move two values in a more complex array', () => {
        const result = swapItemsById(
            [
                { id: 'a' },
                { id: 'b' },
                { id: 'c' },
                { id: 'd' },
                { id: 'e' },
                { id: 'f' },
            ],
            'a',
            'f',
        );

        expect(result).toEqual([
            { id: 'b' },
            { id: 'c' },
            { id: 'd' },
            { id: 'e' },
            { id: 'f' },
            { id: 'a' },
        ]);
    });
});
