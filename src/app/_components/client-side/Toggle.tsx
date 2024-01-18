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
                            'bg-accent': checked || renderProps.checked,
                            'bg-base': !checked && !renderProps.checked,
                        },
                        'border border-muted relative inline-flex h-6 w-11 items-center rounded-full',
                        className,
                    )}
                >
                    <span
                        className={`${
                            checked || renderProps.checked
                                ? 'translate-x-6'
                                : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-surface shadow-md transition border border-muted`}
                    />
                </button>
            )}
        </Switch>
    );
};

export default Toggle;
