import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Tooltip, { TooltipProps } from './Tooltip';

type HelpTooltipProps = {
    content: TooltipProps['content'];
};

export const HelpTooltip = ({ content }: HelpTooltipProps) => {
    return (
        <Tooltip content={content} placement="top">
            <QuestionMarkCircleIcon className="mr-1 h-6 w-6 text-stone-300 hover:text-stone-600" />
        </Tooltip>
    );
};
