import { BookOpenIcon } from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';
import SidebarLink from './SidebarLink';

type SidebarDeckProps = {
    id: string;
    name: string;
};

const SidebarDeck: React.FC<SidebarDeckProps> = ({ id, name }) => {
    const pathname = usePathname();
    return (
        <SidebarLink
            data-testid="sidebar-deck"
            isActive={pathname.includes(id)}
            href={`/decks/${id}`}
        >
            <BookOpenIcon className="mr-2 h-4 w-4" />
            {name}
        </SidebarLink>
    );
};

export default SidebarDeck;
