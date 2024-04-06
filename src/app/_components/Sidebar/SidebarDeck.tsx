import { BookOpenIcon } from '@heroicons/react/20/solid';
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarDeckProps = {
    id: string;
    name: string;
};

const sidebarDeck = cva('flex items-center px-2 py-1 text-sm text-stone-600', {
    variants: {
        isActive: {
            true: 'rounded bg-stone-200',
        },
    },
});

const SidebarDeck: React.FC<SidebarDeckProps> = ({ id, name }) => {
    const pathname = usePathname();
    return (
        <Link
            className={sidebarDeck({ isActive: pathname.includes(id) })}
            href={`/decks/${id}`}
        >
            <BookOpenIcon className="mr-2 h-4 w-4" />
            {name}
        </Link>
    );
};

export default SidebarDeck;
