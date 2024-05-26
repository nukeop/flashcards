'use client';

import { animated, useSpring } from '@react-spring/web';
import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { MarkdownContent } from '../MarkdownContent';
import styles from './Flashcard.module.scss';
import FlashcardContextMenu from './FlashcardContextMenu';

const card = cva(
    'duration-400 relative flex transform-gpu select-none overflow-hidden rounded-lg border border-b-4 border-stone-200 bg-stone-50 p-2 text-stone-600 shadow-md transition-shadow ease-in-out hover:shadow-smooth',
    {
        variants: {
            isDragging: {
                true: 'shadow-smooth-high',
            },
        },
    },
);

const clamp = (value: number, min = 0, max = 100) => {
    return Math.min(Math.max(value, min), max);
};

type FlashcardProps = {
    front: string;
    back: string;
    isFlipped?: boolean;
    flipBackOnMouseLeave?: boolean;
    isDragging?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
} & VariantProps<typeof card>;

const Flashcard: React.FC<FlashcardProps> = ({
    front,
    back,
    isFlipped: propIsFlipped,
    flipBackOnMouseLeave,
    isDragging,
    onClick,
    onDelete,
    onEdit,
}: FlashcardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isInteracting, setInteracting] = useState(false);
    const [isFlipped, setFlipped] = useState(propIsFlipped ?? false);

    const [{ rotateX, rotateY }, setRotate] = useSpring(() => ({
        rotateX: 0,
        rotateY: 0,
        config: { mass: 0.1, tension: 200, friction: 26 },
    }));

    const interact = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!cardRef.current || isDragging) return;
        const rect = cardRef.current.getBoundingClientRect();

        const absolute = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        const percent = {
            x: clamp(Math.round((100 / rect.width) * absolute.x)),
            y: clamp(Math.round((100 / rect.height) * absolute.y)),
        };

        const center = {
            x: percent.x - 50,
            y: percent.y - 50,
        };

        const rotateX = Math.round(-center.x / 4) + (isFlipped ? 180 : 0);
        const rotateY = Math.round(center.y / 4);

        setRotate({
            rotateX,
            rotateY,
        });

        setInteracting(true);
    };

    const interactEnd = () => {
        setRotate({
            rotateX: isFlipped ? 180 : 0,
            rotateY: 0,
        });

        if (isInteracting) {
            setInteracting(false);
        }
    };

    useEffect(
        () => {
            if (isFlipped) {
                setRotate({
                    rotateX: 180,
                    rotateY: 0,
                });
            } else {
                setRotate({
                    rotateX: 0,
                    rotateY: 0,
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isFlipped],
    );

    useEffect(() => {
        if (isDragging) {
            interactEnd();
        }
    }, [isDragging]);

    useEffect(
        () => {
            if (propIsFlipped !== undefined) {
                setFlipped(propIsFlipped);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [propIsFlipped, isFlipped],
    );

    return (
        <div className={clsx(styles['flashcard-wrapper'], 'group')}>
            <FlashcardContextMenu onDelete={onDelete} onEdit={onEdit} />
            <div
                ref={cardRef}
                className={styles['flashcard-body']}
                onClick={(e) => {
                    setFlipped((prevFlipped) => {
                        return !prevFlipped;
                    });
                    interact(e);
                    onClick?.();
                    e.stopPropagation();
                }}
                onMouseLeave={() => {
                    if (flipBackOnMouseLeave) {
                        setFlipped(false);
                    }
                }}
            >
                <animated.div
                    className={clsx(card({ isDragging }), styles['flashcard'])}
                    onMouseMove={interact}
                    onMouseLeave={interactEnd}
                    onMouseUp={interactEnd}
                    style={{
                        rotateY: rotateX,
                        rotateX: rotateY,
                    }}
                >
                    <animated.div
                        className={clsx(
                            'z-[2] flex h-full w-full flex-col items-center justify-center p-4',
                            styles.front,
                        )}
                        style={{
                            rotateY: rotateX,
                        }}
                    >
                        <MarkdownContent content={front} />
                    </animated.div>
                    <animated.div
                        className={clsx(
                            'flex h-full w-full flex-col items-center justify-center',
                            styles.back,
                        )}
                        style={{
                            rotateY: rotateX.to((x) => x + 180),
                            scaleX: -1,
                        }}
                    >
                        <MarkdownContent content={back} />
                    </animated.div>
                </animated.div>
            </div>
        </div>
    );
};

export default Flashcard;
