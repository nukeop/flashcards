'use client';

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import Button from '../_components/Button';
import Input from '../_components/Input';
import Panel from '../_components/Panel';

type DecksSearchBarProps = {
    onSearch?: (query: string) => void;
};

const DecksSearchBar: React.FC<DecksSearchBarProps> = () => {
    return (
        <Panel layout="row" className="justify-between">
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
        </Panel>
    );
};

export default DecksSearchBar;
