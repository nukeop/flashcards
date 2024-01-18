'use client';

import {
    ArrowLeftStartOnRectangleIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

import { useUser } from '../../_hooks/useUser';
import Button from '../Button';
import Loader from '../Loader';
import Tooltip from '../Tooltip';

const TopBarProfile = () => {
    const { session, isLoading } = useUser();
    return (
        <>
            {isLoading && <Loader size="sm" />}
            {!isLoading && (
                <>
                    <Tooltip content={<span>Profile</span>} placement="bottom">
                        <Button
                            className="flex flex-row items-center gap-2 mr-2"
                            intent="topbar"
                            as={Link}
                            href="/me"
                        >
                            <UserCircleIcon className="w-6 h-6" />
                            <div>{session?.user.email}</div>
                        </Button>
                    </Tooltip>

                    <form
                        className="flex items-center justify-center flex-grow-0"
                        action="/auth/logout"
                        method="post"
                    >
                        <Tooltip
                            content={<span>Log out</span>}
                            placement="bottom"
                        >
                            <Button intent="topbar" type="submit">
                                <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                            </Button>
                        </Tooltip>
                    </form>
                </>
            )}
        </>
    );
};

export default TopBarProfile;
