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
type Flashcard = Database['public']['Tables']['flashcards']['Row'];

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
    const [decks, setDecks] = useState<Deck[] | null>(null);
    const [currentDeckCards, setCurrentDeckCards] = useState<
        Flashcard[] | null
    >(null);

    const pathname = usePathname();
    const crumbs = pathname.split('/').filter((crumb) => crumb);

    useEffect(() => {
        async function getDecks() {
            setLoading(true);
            const supabase = createBrowserClient<Database>(
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
    }, [pathname]);

    const currentDeckName = decks?.find((deck) => deck.id === crumbs[1])?.name;
    const currentCardName = currentDeckCards?.find(
        (card) => card.id === crumbs[2],
    )?.front;

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
