import { useAutoAnimate } from "@formkit/auto-animate/react";

type Guess = { [letter: string]: string };
type Guesses = Guess[];

interface WordGuessProps {
    guesses: Guesses;
}
export function WordGuess(props: WordGuessProps): JSX.Element {
    const [animationParent] = useAutoAnimate();
    console.log("props is:", props);
    return (
        <div className="guess-button-grid">
            {props.guesses.map((guess, index) => (
                <div key={index} ref={animationParent}>
                    {Object.entries(guess).map(([letter, status]) => (
                        <button className={`${status}-tile`} key={letter}>
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
