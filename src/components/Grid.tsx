import { WordGuess } from "./WordGuess";
import { useState, useEffect } from "react";
import { countLetters } from "./utils/countLetters";
import { isCorrectLocation } from "./utils/isCorrectLocation";
import { isInWord } from "./utils/isInWord";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type MarkedGuess = {
    [letter: string]: string;
};

const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];

const alphabetObj: { [string: string]: string } = {};

for (const key of alphabet) {
    alphabetObj[key] = "active";
}

export function Grid(): JSX.Element {
    // const [guess, setGuess] = useState<MarkedGuess>([])
    const [targetWord, setTargetWord] = useState<string>("");
    const [guesses, setGuesses] = useState<MarkedGuess[][]>([]);
    const [input, setInput] = useState<string>("");
    const lettersRemaining = alphabetObj;
    const [win, setWin] = useState<boolean>(false);

    const [animationParent] = useAutoAnimate();

    const HandleFetch = async () => {
        const response = await fetch(
            "https://random-word-api.herokuapp.com/word?lang=en&length=5"
        );
        const jsonBody: string = await response.json();
        setTargetWord(jsonBody[0].toUpperCase());
    };

    useEffect(() => {
        HandleFetch();
        setGuesses([]);
    }, []);

    const handleCheckGuess = (guess: string): void => {
        const guessOccurences: { [letterCount: string]: number } = {};
        const guessAsArray = guess.split("");
        guessAsArray.forEach((letter) => (guessOccurences[letter] = 0));

        const newGuess = guessAsArray.map((letter, index) => {
            const occurenceCheck =
                guessOccurences[letter] < countLetters(targetWord)[letter];
            // console.log(`Guess letter occurences: ${guessOccurences[letter]}`, `Target letter occurences: ${countLetters(targetWord)[letter]}` , isCorrectLocation(letter, index, targetWord),occurenceCheck )
            // console.log(`checking letter ${letter}`)
            if (
                occurenceCheck &&
                isCorrectLocation(letter, index, targetWord)
            ) {
                guessOccurences[letter] += 1;
                return { [letter]: "CorrectLocation" };
            } else if (occurenceCheck && isInWord(letter, targetWord)) {
                guessOccurences[letter] += 1;
                return { [letter]: "InWord" };
            } else {
                if (!isInWord(letter, targetWord)) {
                    lettersRemaining[letter] = "inactive";
                }
                guessOccurences[letter] += 1;
                return { [letter]: "NotInWord" };
            }
        });
        setGuesses((prev) => [...prev, newGuess]);
        setInput("");
        setWin(checkWin(newGuess));
    };

    const checkWin = (
        guess: {
            [x: string]: string;
        }[]
    ) => {
        if (
            guess.every((el) =>
                Object.values(el).every((el) => el === "CorrectLocation")
            )
        ) {
            return true;
        } else {
            return false;
        }
    };

    const handleInput = (inputText: string) => {
        if (input.length >= 5) {
            setInput((prev) => prev.slice(0, 4));
        } else {
            setInput((prev) => prev + inputText);
        }
    };

    const handleReset = () => {
        setGuesses([]);
        setWin(false);
        setInput("");
        HandleFetch();
        for (const key of alphabet) {
            alphabetObj[key] = "active";
        }
        if (win === true) {
            localStorage.setItem(
                localStorage.length.toString(),
                JSON.stringify(targetWord)
            );
        }
    };

    const titleButtons = ["T", "O", "M", "'", "S"];
    const colours = ["yellow", "green", "grey", "yellow", "green"];

    const wordsinStorage = Object.values(localStorage).map((el: string) => el);

    return (
        <div className="center-game">
            <div className="title-buttons">
                {titleButtons.map((letter, index) => (
                    <button
                        key={index}
                        className={`title-button-${colours[index]}`}
                    >
                        {letter}
                    </button>
                ))}
            </div>
            <h1>Wordle</h1>
            <hr />
            <div>
                {guesses.map((arr, index) => (
                    <WordGuess key={index} guesses={arr} />
                ))}
            </div>
            <br />
            <div className="guess-button-grid" ref={animationParent}>
                {input.split("").map((el, index) => (
                    <button
                        key={index}
                        onClick={() => setInput((prev) => prev.replace(el, ""))}
                        className="guess-tile"
                    >
                        {el}
                    </button>
                ))}{" "}
            </div>
            {guesses.length < 6 && win !== true && (
                <div>
                    <br />
                    <br />
                    <div className="letter-button-grid">
                        {Object.keys(lettersRemaining).map((letter, index) => (
                            <button
                                className={`letter-button-${lettersRemaining[letter]}`}
                                key={index}
                                onClick={() => handleInput(letter)}
                            >
                                {lettersRemaining[letter] === "active" &&
                                    letter}
                                {lettersRemaining[letter] === "inactive" && (
                                    <s>{letter}</s>
                                )}
                            </button>
                        ))}{" "}
                    </div>
                    {input.length === 5 && (
                        <button
                            className="submit-button"
                            onClick={() => handleCheckGuess(input)}
                        >
                            Submit Guess
                        </button>
                    )}
                </div>
            )}
            {win === true && <h1> You win!!</h1>}
            {win === true ||
                (guesses.length === 6 && (
                    <div>
                        <h1 className="win-text">
                            The word was:
                            <div
                                className="guess-button-grid"
                                ref={animationParent}
                            >
                                {targetWord.split("").map((el, index) => (
                                    <button key={index} className="guess-tile">
                                        {el}
                                    </button>
                                ))}{" "}
                            </div>
                        </h1>
                    </div>
                ))}
            {(win === true || guesses.length === 6) && (
                <button className="submit-button" onClick={handleReset}>
                    {" "}
                    Reset{" "}
                </button>
            )}
            <hr />
            <hr />

            {localStorage.length > 0 && (
                <div>
                    {" "}
                    <h3>Previous Wins:</h3>
                    <hr />
                    <ul>
                        {wordsinStorage.map((el, index) => (
                            <li key={index}>{el}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
