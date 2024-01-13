'use client';

import { Switch } from '@headlessui/react';
import clsx from 'clsx';

type ToggleProps = {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
};

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, className }) => {
    return (
        <Switch
            checked={checked}
            onChange={onChange}
            className={clsx(
                {
                    'bg-accent': checked,
                    'bg-base': !checked,
                },
                'border border-muted/75 relative inline-flex h-6 w-11 items-center rounded-full',
                className,
            )}
        >
            <span
                className={`${
                    checked ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
        </Switch>
    );
};

export default Toggle;
