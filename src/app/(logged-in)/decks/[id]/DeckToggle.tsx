'use client';

import { useRxData } from 'rxdb-hooks';
import Toggle, { ToggleProps } from '@/app/_components/client-side/Toggle';
import { Deck as DeckType } from '@/app/_lib/types';

type DeckToggleProps = {
    deckId: string;
    initialChecked: ToggleProps['checked'];
};

const DeckToggle: React.FC<DeckToggleProps> = ({ initialChecked, deckId }) => {
    const { result: deck } = useRxData<DeckType>('decks', (collection) =>
        collection.findOne(deckId),
    );

    const handlePublish = async (checked: boolean) => {
        await deck.at(0)?.patch({ is_public: !checked });
    };

    return (
        <Toggle
            checked={deck.at(0)?.get('is_public') ?? initialChecked}
            onChange={async (checked) => {
                await handlePublish?.(!checked);
            }}
        />
    );
};

export default DeckToggle;
