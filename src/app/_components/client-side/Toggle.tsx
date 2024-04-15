'use client';

import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment } from 'react';

type BaseToggleProps = {
    className?: string;
    name?: string;
};

export type ControlledToggleProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    defaultChecked?: never;
} & BaseToggleProps;

export type UncontrolledToggleProps = {
    defaultChecked: boolean;
    onChange?: never;
    checked?: never;
} & BaseToggleProps;

export type ToggleProps = ControlledToggleProps | UncontrolledToggleProps;

const Toggle: React.FC<ToggleProps> = ({
    checked,
    onChange,
    defaultChecked,
    className,
    name,
}) => {
    return (
        <Switch
            data-testid="toggle"
            checked={checked}
            onChange={onChange}
            defaultChecked={defaultChecked}
            name={name}
            as={Fragment}
        >
            {(renderProps) => (
                <button
                    className={clsx(
                        {
                            'bg-stone-500': checked || renderProps.checked,
                            'bg-stone-300': !checked && !renderProps.checked,
                        },
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2',
                        className,
                    )}
                >
                    <span
                        className={`${
                            checked || renderProps.checked
                                ? 'translate-x-6'
                                : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-stone-50 shadow-md transition`}
                    />
                </button>
            )}
        </Switch>
    );
};

export default Toggle;
