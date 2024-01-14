'use client';

import Toggle, { ToggleProps } from '@/app/_components/Toggle';
import { startTransition, useOptimistic } from 'react';

const DeckToggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
    const [optimisticChecked, setOptimisticChecked] = useOptimistic<boolean>(
        checked,
        // @ts-expect-error "Type error: Expected 1 arguments, but got 2."
        () => {
            onChange?.(!checked);
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
