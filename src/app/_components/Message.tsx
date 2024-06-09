import {
    CheckBadgeIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { cva, VariantProps } from 'class-variance-authority';

type MessageProps = {
    title: string;
    children: React.ReactNode;
};

const messageHeader = cva(
    'flex flex-row items-center justify-center gap-2 py-1 text-base font-bold text-stone-50',
    {
        variants: {
            type: {
                success: 'bg-nier-cyan-500',
                error: 'bg-nier-red-500',
                info: 'bg-blue-500',
            },
        },
    },
);

const Message: React.FC<MessageProps & VariantProps<typeof messageHeader>> = ({
    type,
    title,
    children,
}) => {
    return (
        <div className="bg-stone-300 text-stone-600">
            <div className={messageHeader({ type })}>
                {type === 'success' && (
                    <CheckBadgeIcon className="h-6 w-6 text-stone-50" />
                )}
                {type === 'error' && (
                    <ExclamationCircleIcon className="h-6 w-6 text-stone-50" />
                )}
                {type === 'info' && (
                    <InformationCircleIcon className="h-6 w-6 text-stone-50" />
                )}
                <h2 className="text-base font-bold text-stone-50">{title}</h2>
            </div>
            <div className="px-4 py-2">{children}</div>
        </div>
    );
};

export default Message;
