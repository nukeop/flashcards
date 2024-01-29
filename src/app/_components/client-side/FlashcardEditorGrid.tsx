import { DeckCardView } from '@/app/_lib/types';
import clsx from 'clsx';
import Flashcard from '../Flashcard';
import styles from './FlashcardEditorGrid.module.scss';

type FlashcardEditorGridProps = {
    cards: DeckCardView[];
};

const FlashcardEditorGrid: React.FC<FlashcardEditorGridProps> = ({ cards }) => {
    return (
        <div
            className={clsx(
                'grid w-full gap-4',
                styles['flashcard-grid-container'],
            )}
        >
            {cards.map((card) => (
                <Flashcard
                    key={card.card_id}
                    front={card.card_front}
                    back={card.card_back}
                    flipBackOnMouseLeave
                />
            ))}
        </div>
    );
};

export default FlashcardEditorGrid;
