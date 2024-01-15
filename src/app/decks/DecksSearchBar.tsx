'use client';

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import Button from '../_components/Button';
import Input from '../_components/Input';

type DecksSearchBarProps = {
    onSearch?: (query: string) => void;
};

const DecksSearchBar: React.FC<DecksSearchBarProps> = () => {
    return (
        <div className="relative flex flex-row justify-between items-center rounded-lg mb-4 px-2 py-1 bg-surface">
            <div>
                <Input
                    prefix={<MagnifyingGlassIcon className="w-6 h-6" />}
                    textSize="lg"
                    placeholder="Type to search..."
                />
            </div>
            <Link href="/decks/new" passHref>
                <Button intent="green">
                    <PlusIcon className="w-6 h-6 mr-2" />
                    Add
                </Button>
            </Link>
        </div>
    );
};

export default DecksSearchBar;
