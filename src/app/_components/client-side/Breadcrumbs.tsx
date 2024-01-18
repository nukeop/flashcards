'use client';

import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import Button from '../Button';

const Breadcrumbs = () => {
    const pathname = usePathname();
    const crumbs = pathname.split('/').filter((crumb) => crumb);
    return (
        <div className="flex flex-row items-center gap-2 text-sm ml-2 font-bold">
            {crumbs.map((crumb, index) => (
                <Fragment key={index}>
                    <ChevronRightIcon className="w-4 h-4" />
                    <Button
                        intent="topbar"
                        className="flex flex-row items-center"
                    >
                        <Link href={`/${crumbs.slice(0, index + 1).join('/')}`}>
                            {crumb}
                        </Link>
                    </Button>
                </Fragment>
            ))}
        </div>
    );
};

export default Breadcrumbs;
