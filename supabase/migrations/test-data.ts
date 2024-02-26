export const nCards = (n: number, deckId: string) =>
    [...Array(n)].map((i, index) => ({
        deck_id: deckId,
        front: `Front ${index + 1}`,
        back: `Back ${index + 1}`,
        position: index + 1,
    }));
