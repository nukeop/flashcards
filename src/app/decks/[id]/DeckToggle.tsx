'use client';

import Toggle, { ToggleProps } from '@/app/_components/client-side/Toggle';
import { startTransition, useOptimistic } from 'react';

type DeckToggleProps = {
    deckId: string;
    onTogglePublic?: (checked: boolean, deckId: string) => Promise<void>;
    checked: ToggleProps['checked'];
};

const DeckToggle: React.FC<DeckToggleProps> = ({
    checked,
    onTogglePublic,
    deckId,
}) => {
    const [optimisticChecked, setOptimisticChecked] = useOptimistic<boolean>(
        checked,
        // @ts-expect-error "Type error: Expected 1 arguments, but got 2."
        () => {
            onTogglePublic?.(!checked, deckId);
            return !checked;
        },
    );

    return (
        <Toggle
            checked={optimisticChecked}
            onChange={() => {
                startTransition(() => {
                    setOptimisticChecked(optimisticChecked);
                });
            }}
        />
    );
};

export default DeckToggle;
