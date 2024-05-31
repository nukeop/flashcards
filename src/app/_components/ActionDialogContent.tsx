import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

type ActionDialogContentProps = {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

const ActionDialogContent: React.FC<ActionDialogContentProps> = ({
    onClose,
    title,
    children,
}: ActionDialogContentProps) => (
    <div className="flex flex-col items-center justify-center">
        <div className="mb-2 flex w-full flex-row items-center justify-between bg-stone-100 px-4 py-2 text-sm text-stone-500">
            {title}
            <Button intent="iconButton" onClick={onClose}>
                <XMarkIcon className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex flex-col items-center justify-center px-4 py-2">
            {children}
        </div>
    </div>
);

export default ActionDialogContent;
