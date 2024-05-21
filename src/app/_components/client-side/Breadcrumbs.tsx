'use client';

import { useDecks } from '@/app/_hooks/useDecks';
import { Database } from '@/app/_lib/database.types';
import { Flashcard } from '@/app/_lib/types';
import { HomeIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import Button from '../Button';
import Loader from '../Loader';

const Crumb = ({ href, text }: { href: string; text: string }) => (
    <Fragment>
        <ChevronRightIcon className="h-4 w-4" />
        <Link href={href}>
            <Button
                intent="breadcrumbs"
                className="flex flex-row items-center font-normal"
            >
                {text}
            </Button>
        </Link>
    </Fragment>
);

const Breadcrumbs = () => {
    const [isLoading, setLoading] = useState(true);
    const { decks, isLoading: areDecksLoading } = useDecks();
    const [currentDeckCards, setCurrentDeckCards] = useState<
        Flashcard[] | null
    >(null);

    const pathname = usePathname();
    const crumbs = pathname.split('/').filter((crumb) => crumb);

    useEffect(() => {
        async function getCards() {
            setLoading(true);
            const supabase = createBrowserClient<Database>(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            );

            const fetchedCards = await supabase
                .from('flashcards')
                .select('*')
                .eq('deck_id', crumbs[1]);

            setCurrentDeckCards(fetchedCards.data as Flashcard[]);
            setLoading(false);
        }

        getCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const currentDeckName = decks?.find((deck) => deck.id === crumbs[1])?.name;
    const currentCardName = currentDeckCards?.find(
        (card) => card.id === crumbs[2],
    )?.front;

    return (
        <div className="ml-2 flex h-12 flex-row items-center gap-2 text-sm font-normal text-stone-600">
            {(isLoading || areDecksLoading) && <Loader size="sm" />}

            {!isLoading && !areDecksLoading && (
                <>
                    <Link data-testid="breadcrumbs-root" href="/">
                        <Button
                            intent="breadcrumbs"
                            className="flex flex-row items-center"
                        >
                            <HomeIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    {crumbs.length > 0 && (
                        <Crumb
                            href={`/${crumbs[0]}`}
                            text={
                                crumbs[0][0].toUpperCase() + crumbs[0].slice(1)
                            }
                        />
                    )}
                    {crumbs.length > 1 && (
                        <Crumb
                            href={`/${crumbs[0]}/${crumbs[1]}`}
                            text={
                                currentDeckName
                                    ? currentDeckName
                                    : crumbs[1][0].toUpperCase() +
                                      crumbs[1].slice(1)
                            }
                        />
                    )}
                    {crumbs.length > 2 && (
                        <Crumb
                            href={`/${crumbs[0]}/${crumbs[1]}/${crumbs[2]}`}
                            text={
                                currentCardName
                                    ? currentCardName
                                    : crumbs[2][0].toUpperCase() +
                                      crumbs[2].slice(1)
                            }
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Breadcrumbs;
