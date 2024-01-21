'use client';

import { animated, useSpring } from '@react-spring/web';
import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import styles from './Flashcard.module.scss';

const card = cva(
    'relative flex h-48 transform-gpu select-none overflow-hidden rounded-lg border border-muted/50 bg-surface p-2 shadow-lg drop-shadow-lg transition-shadow duration-200 ease-in-out hover:drop-shadow-xl',
);

const clamp = (value: number, min = 0, max = 100) => {
    return Math.min(Math.max(value, min), max);
};

type FlashcardProps = {
    front: React.ReactNode;
    back: React.ReactNode;
} & VariantProps<typeof card>;
const Flashcard: React.FC<FlashcardProps> = ({
    front,
    back,
}: FlashcardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isInteracting, setInteracting] = useState(false);
    const [isFlipped, setFlipped] = useState(false);

    const [{ rotateX, rotateY }, setRotate] = useSpring(() => ({
        rotateX: 0,
        rotateY: 0,
        config: { mass: 0.1, tension: 200, friction: 26 },
    }));

    const interact = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!cardRef.current) return;
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

    useEffect(() => {
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
    }, [isFlipped]);

    console.log({ isFlipped, rotateX: rotateX.get() });

    return (
        <div
            className={styles['flashcard-wrapper']}
            onClick={(e) => {
                setFlipped((prevFlipped) => {
                    return !prevFlipped;
                });
                interact(e);
                e.stopPropagation();
            }}
        >
            <animated.div
                ref={cardRef}
                className={clsx(card(), styles.flashcard)}
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
                        rotateX: rotateY,
                    }}
                >
                    <h3>{front}</h3>
                </animated.div>
                <animated.div
                    className={clsx(
                        'flex h-full w-full flex-col items-center justify-center',
                        styles.back,
                    )}
                    style={{
                        rotateY: rotateX.to((x) => x + 180),
                        rotateX: rotateY,
                        scaleX: -1,
                    }}
                >
                    <h3>{back}</h3>
                </animated.div>
            </animated.div>
        </div>
    );
};

export default Flashcard;
