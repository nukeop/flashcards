'use client';

import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { useUser } from '../../_hooks/useUser';
import Button from '../Button';
import SidebarTooltip from '../SidebarTooltip';

const SidebarProfile = () => {
    const { session } = useUser();
    return (
        <SidebarTooltip content={session && <div>{session.user.email}</div>}>
            <Button intent="sidebar" as={Link} href="/me">
                <UserCircleIcon className="w-6 h-6" />
            </Button>
        </SidebarTooltip>
    );
};

export default SidebarProfile;
