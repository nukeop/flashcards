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
    const { session, isLoading, hasError } = useUser();
    return (
        <>
            {isLoading && <Loader size="sm" />}
            {!isLoading && !hasError && session && (
                <>
                    <Tooltip content={<span>Profile</span>} placement="bottom">
                        <Button
                            className="mr-2 flex flex-row items-center gap-2"
                            intent="topbar"
                            as={Link}
                            href="/me"
                        >
                            <UserCircleIcon className="h-6 w-6" />
                            <div>{session?.user.email}</div>
                        </Button>
                    </Tooltip>

                    <form
                        className="flex flex-grow-0 items-center justify-center"
                        action="/auth/logout"
                        method="post"
                    >
                        <Tooltip
                            content={<span>Log out</span>}
                            placement="bottom"
                        >
                            <Button intent="topbar" type="submit">
                                <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
                            </Button>
                        </Tooltip>
                    </form>
                </>
            )}
        </>
    );
};

export default TopBarProfile;
