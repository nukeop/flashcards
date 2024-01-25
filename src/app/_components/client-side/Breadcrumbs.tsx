'use client';

import { Database } from '@/app/_lib/database.types';
import { HomeIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import Button from '../Button';
import Loader from '../Loader';

type Deck = Database['public']['Tables']['decks']['Row'];

const Breadcrumbs = () => {
    const [isLoading, setLoading] = useState(true);
    const [decks, setDecks] = useState<Deck[] | null>(null);

    const pathname = usePathname();
    const crumbs = pathname.split('/').filter((crumb) => crumb);

    useEffect(() => {
        async function getDecks() {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            );
            const user = await supabase.auth.getUser();
            const fetchedDecks = await supabase
                .from('decks')
                .select('*')
                .eq('user_id', user.data.user?.id || '');

            setDecks(fetchedDecks.data as Deck[]);
            setLoading(false);
        }

        getDecks();
    }, []);

    const currentDeckName = decks?.find((deck) => deck.id === crumbs[1])?.name;

    return (
        <div className="ml-2 flex h-12 flex-row items-center gap-2 text-sm font-normal text-slate-600">
            {isLoading && (
                <Loader size="sm" className="fill-slate-100 text-slate-600" />
            )}

            {!isLoading && (
                <>
                    <Link href="/">
                        <Button
                            intent="breadcrumbs"
                            className="flex flex-row items-center"
                        >
                            <HomeIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    {crumbs.map((crumb, index) => (
                        <Fragment key={index}>
                            <ChevronRightIcon className="h-4 w-4" />
                            <Link
                                href={`/${crumbs.slice(0, index + 1).join('/')}`}
                            >
                                <Button
                                    intent="breadcrumbs"
                                    className="flex flex-row items-center font-normal"
                                >
                                    {crumbs[1] === crumb && currentDeckName
                                        ? currentDeckName
                                        : crumb[0].toUpperCase() +
                                          crumb.slice(1)}
                                </Button>
                            </Link>
                        </Fragment>
                    ))}
                </>
            )}
        </div>
    );
};

export default Breadcrumbs;
