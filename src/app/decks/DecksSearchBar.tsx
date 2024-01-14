'use client';

import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

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
            <Button intent="green">
                Add
                <ChevronDownIcon className="w-6 h-6 ml-2" />
            </Button>
        </div>
    );
};

export default DecksSearchBar;
