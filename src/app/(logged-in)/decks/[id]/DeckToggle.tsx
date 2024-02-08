'use client';

import Toggle, { ToggleProps } from '@/app/_components/client-side/Toggle';
import { startTransition, useOptimistic, useState } from 'react';
import { handleTogglePublicDeck } from './actions';

type DeckToggleProps = {
    deckId: string;
    initialChecked: ToggleProps['checked'];
};

const DeckToggle: React.FC<DeckToggleProps> = ({ initialChecked, deckId }) => {
    const [isChecked, setChecked] = useState<boolean>(initialChecked ?? false);

    const [optimisticChecked, setOptimisticChecked] = useOptimistic<
        boolean,
        boolean
    >(isChecked, (state: boolean, targetState: boolean) => targetState);

    return (
        <Toggle
            checked={optimisticChecked}
            onChange={async (checked) => {
                startTransition(() => {
                    setOptimisticChecked(checked);
                });
                await handleTogglePublicDeck?.(!checked, deckId);
                setChecked(checked);
            }}
        />
    );
};

export default DeckToggle;
