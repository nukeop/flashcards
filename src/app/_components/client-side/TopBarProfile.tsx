'use client';

import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { useUser } from '../../_hooks/useUser';
import Button from '../Button';

const TopBarProfile = () => {
    const { session } = useUser();
    return (
        <Button as={Link} href="/me">
            <UserCircleIcon className="w-6 h-6" />
            <div>{session?.user.email}</div>
        </Button>
    );
};

export default TopBarProfile;
