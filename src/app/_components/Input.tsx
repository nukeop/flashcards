import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import {
    DetailedHTMLProps,
    ElementType,
    InputHTMLAttributes,
    ReactElement,
    RefObject,
    TextareaHTMLAttributes,
} from 'react';
import { useAutofocus } from '../_hooks/useAutofocus';

const input = cva(
    'flex-grow rounded border-none bg-transparent p-0.5 outline-none',
    {
        variants: {
            error: {
                true: 'border-theme-red',
            },
            textSize: {
                sm: 'text-sm',
                md: 'text-md',
                lg: 'text-lg',
            },
        },
    },
);

const inputFrame = cva(
    'flex h-full w-full flex-row rounded bg-stone-200 px-4 py-2 focus-within:shadow-inner',
    {
        variants: {
            borderless: {
                true: 'border-none',
            },
        },
    },
);

type InputElementProps = {
    ref?: RefObject<HTMLInputElement>;
};

type TextAreaElementProps = {
    ref?: RefObject<HTMLTextAreaElement>;
};

type CommonProps = VariantProps<typeof input> &
    VariantProps<typeof inputFrame> & {
        classes?: Partial<{
            input: string;
            inputFrame: string;
            root: string;
        }>;
        id?: string;
        prefix?: ReactElement;
        label?: string;
        autoFocus?: boolean;
    };

type TextAreaInputProps = Omit<
    DetailedHTMLProps<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
    >,
    'prefix' | 'as' | 'className' | 'autoFocus'
> &
    CommonProps &
    TextAreaElementProps & {
        as: 'textarea';
    };

type InputProps = Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'prefix' | 'as' | 'className' | 'autoFocus'
> &
    CommonProps &
    InputElementProps & {
        as: 'input';
    };

type CombinedProps = InputProps | TextAreaInputProps;

type ElementTypeMap = {
    input: HTMLInputElement;
    textarea: HTMLTextAreaElement;
};

type TagNameToElementType<T extends keyof ElementTypeMap> = ElementTypeMap[T];

function Input({
    id,
    error,
    prefix,
    textSize,
    label,
    borderless,
    classes,
    as,
    autoFocus,
    ...props
}: CombinedProps) {
    const Component = as as ElementType;
    const inputRef = useAutofocus<TagNameToElementType<typeof as>>(autoFocus);
    return (
        <div className={clsx('group w-full text-sm', classes?.root)}>
            <label className="block h-full w-full cursor-text rounded text-sm font-medium">
                {label && (
                    <div className="mb-1 flex cursor-default flex-row items-center justify-start">
                        <span>{label}</span>
                    </div>
                )}
                <div
                    className={clsx(
                        inputFrame({ borderless }),
                        classes?.inputFrame,
                    )}
                >
                    {prefix && (
                        <div className="mr-2 flex flex-row items-center justify-start text-stone-400 group-focus-within:text-stone-600 group-active:text-stone-600">
                            {prefix}
                        </div>
                    )}
                    <Component
                        ref={inputRef}
                        id={id}
                        name={id}
                        className={clsx(
                            input({ error, textSize }),
                            classes?.input,
                        )}
                        aria-invalid={!!error}
                        {...props}
                    />
                    {error && (
                        <p className="text-error mt-2 text-sm">{error}</p>
                    )}
                </div>
            </label>
        </div>
    );
}

Input.displayName = 'Input';

export default Input;
