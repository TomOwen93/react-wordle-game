interface WordGuessProps {
    guess: {
        text: string;
        inCorrectLocation: string[];
        inWord: string[];
        notInWord: string[];
    };
}

export function WordGuess({ guess }: WordGuessProps): JSX.Element {
    return (
        <div>
            <p>
                {guess.text.split("").map((letter) => (
                    <span className="tile">{letter}</span>
                ))}
            </p>
        </div>
    );
}
