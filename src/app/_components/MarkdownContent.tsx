import clsx from 'clsx';
import Markdown from 'react-markdown';
import styles from './MarkdownContent.module.scss';

type MarkdownContentProps = {
    className?: string;
    content: string;
};

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
    className,
    content,
}) => {
    return (
        <Markdown className={clsx(styles['markdown-content'], className)}>
            {content}
        </Markdown>
    );
};
