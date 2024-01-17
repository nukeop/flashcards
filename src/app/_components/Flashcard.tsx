'use client';

import { VariantProps, cva } from 'class-variance-authority';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';

import styles from './Flashcard.module.scss';

const card = cva(
    'relative flex bg-surface border border-muted/50 rounded-lg drop-shadow-lg hover:drop-shadow-xl transition-shadow transform-gpu duration-200 ease-in-out overflow-hidden p-2',
);

type FlashcardProps = {
    children?: React.ReactNode;
} & VariantProps<typeof card>;
const Flashcard: React.FC<FlashcardProps> = ({ children }: FlashcardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isInteracting, setInteracting] = useState(false);

    const [{ rotateX, rotateY }, setRotate] = useSpring(() => ({
        rotateX: 0,
        rotateY: 0,
        config: { mass: 1, tension: 170, friction: 26 },
    }));

    const [{ glareX, glareY }, setGlare] = useSpring(() => ({
        glareX: 50,
        glareY: 50,
        config: { mass: 1, tension: 170, friction: 26 },
    }));

    const interact = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        const rotateX = (mouseY / rect.height) * 30; // Arbitrary multiplier for rotation strength
        const rotateY = -(mouseX / rect.width) * 30; // Arbitrary multiplier for rotation strength

        setRotate({
            rotateX,
            rotateY,
        });

        setGlare({
            glareX: (mouseX / rect.width) * 100 + 50,
            glareY: (mouseY / rect.height) * 100 + 50,
        });

        setInteracting(true);
    };

    const interactEnd = () => {
        setRotate({
            rotateX: 0,
            rotateY: 0,
        });

        setGlare({
            glareX: 50,
            glareY: 50,
        });

        setInteracting(false);
    };

    const cardStyles = {
        transform: clsx(
            rotateX.to((x) => `perspective(600px) rotateX(${x}deg)`).calc(),
            rotateY.to((y) => ` rotateY(${y}deg)`).calc(),
        ),
    };

    const glareStyles = {
        backgroundPositionX: glareX.to((gx) => `${gx}%`).calc(),
        backgroundPositionY: glareY.to((gy) => `${gy}%`).calc(),
    };

    console.log(cardStyles, glareStyles);

    return (
        <animated.div
            ref={cardRef}
            className={clsx(card(), styles.flashcard)}
            onMouseMove={interact}
            onMouseLeave={interactEnd}
            onMouseUp={interactEnd}
            style={cardStyles}
        >
            <animated.div className={styles.glare} style={glareStyles}>
                {children}
            </animated.div>
        </animated.div>
    );
};

export default Flashcard;
