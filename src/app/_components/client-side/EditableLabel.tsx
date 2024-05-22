import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { ElementType, useState } from 'react';
import Button from '../Button';
import Input from './Input';

type EditableInputProps<T extends React.ElementType> = {
    classes?: Partial<{
        root: string;
        input: string;
        icon: string;
        button: string;
    }>;
    onConfirm: (value: string) => void;
    value: string;
    as: T;
};

export function EditableLabel<T extends ElementType>({
    classes,
    onConfirm,
    as,
    value,
}: EditableInputProps<T>) {
    const Component = (as || 'span') as ElementType;
    const [isEditing, setEditing] = useState(false);

    return isEditing ? (
        <Input
            data-testid="editable-label-input"
            classes={{ root: classes?.input }}
            autoFocus
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onConfirm(e.currentTarget.value);
                    setEditing(false);
                }
            }}
            defaultValue={value}
        />
    ) : (
        <Component data-testid="editable-label" className={classes?.root}>
            {value}
            <Button
                data-testid="edit-button"
                intent="iconButton"
                className={classes?.button ?? 'ml-2 text-stone-600'}
                onClick={() => setEditing(true)}
            >
                <PencilSquareIcon className={classes?.icon ?? 'h-6 w-6'} />
            </Button>
        </Component>
    );
}
