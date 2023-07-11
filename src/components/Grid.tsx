import { WordGuess } from "./WordGuess";
import { useState, ChangeEvent, useEffect } from "react";
import { countLetters } from "./utils/countLetters";
import { isCorrectLocation } from "./utils/isCorrectLocation";
import { isInWord } from "./utils/isInWord";

/*
 * pseudocode:
 *
 * create a new variable called occurrencesInTarget = {actual occurences} ***helper function
 * create a new variable called correctOccurrencesInGuess = {}
 * create new variable called markedGuess = {}
 * for each letter in guess
 *  if correctOccurrencesInGuess.letter < occurrencesInTarget.letter AND letter is in the correct location*** helper function
 *      then add letter to markedGuess.inCorrectLocation
 *      and add letter occurrence to correctOccurrencesInGuess
 *  else correctOccurrencesInGuess.letter < occurrencesInTarget.letter AND if letter is in the word*** helper function
 *      then add letter to markedGuess.inWord
 *      and add letter occurrence to correctOccurrencesInGuess
 *  else
 *      add letter to markedGuess.notInWord
 *
 */

interface MarkedGuess {
    guess: {
        text: string;
        inCorrectLocation: string[];
        inWord: string[];
        notInWord: string[];
    };
}

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

export function Grid(): JSX.Element {
    // const [guess, setGuess] = useState<MarkedGuess>([])
    const [targetWord, setTargetWord] = useState<string>("");
    const [guesses, setGuesses] = useState<MarkedGuess[]>([]);
    const [input, setInput] = useState<string>("");
    const [lettersRemaining, setLettersRemaining] =
        useState<string[]>(alphabet);

    const HandleFetch = async () => {
        const response = await fetch(
            "https://random-word-api.herokuapp.com/word?length=5"
        );
        const jsonBody: string = await response.json();
        setTargetWord(jsonBody[0].toUpperCase());
    };

    useEffect(() => {
        HandleFetch();
    }, []);

    useEffect(() => {
        console.log(guesses);
    }, [guesses]);

    const handleCheckGuess = (guess: string): void => {
        let guessOccurences: { [letterCount: string]: number } = {};
        let guessAsArray = guess.split("");

        const newGuess = {
            guess: {
                text: guess,
                inCorrectLocation: [],
                inWord: [],
                notInWord: [],
            },
        };

        let updatedGuess: {
            text: string;
            inCorrectLocation: string[];
            inWord: string[];
            notInWord: string[];
        } = { ...newGuess.guess };

        guessAsArray.forEach((letter) => (guessOccurences[letter] = 0));

        guessAsArray.map((letter, index) => {
            let occurenceCheck =
                guessOccurences[letter] < countLetters(targetWord)[letter];
            // console.log(`Guess letter occurences: ${guessOccurences[letter]}`, `Target letter occurences: ${countLetters(targetWord)[letter]}` , isCorrectLocation(letter, index, targetWord),occurenceCheck )
            // console.log(`checking letter ${letter}`)

            if (
                occurenceCheck &&
                isCorrectLocation(letter, index, targetWord)
            ) {
                updatedGuess.inCorrectLocation = [
                    ...updatedGuess.inCorrectLocation,
                    letter,
                ];
                console.log(guesses);
                guessOccurences[letter] += 1;
            } else if (occurenceCheck && isInWord(letter, targetWord)) {
                updatedGuess.inWord = [...updatedGuess.inWord, letter];
                guessOccurences[letter] += 1;
            } else {
                updatedGuess.notInWord = [...updatedGuess.notInWord, letter];
            }
            return updatedGuess;
        });

        setGuesses((prev) => [...prev, { guess: updatedGuess }]);
    };

    const handleInput = (inputText: string) => {
        if (input.length >= 5) {
            setInput((prev) => prev.slice(0, 4));
        } else {
            setInput((prev) => prev + inputText);
        }
    };

    return (
        <div>
            <h1>Wordle</h1>
            <hr />
            <div>
                {guesses.map((el, index) => (
                    <ul>
                        <li className="grid-buttons" key={index}>
                            <WordGuess guess={el.guess} />
                        </li>
                    </ul>
                ))}
            </div>
            <br />
            {guesses.length < 6 && (
                <div>
                    <input value={input} maxLength={5} />
                    <br />
                    <br />
                    <div className="letter-button-grid">
                        {lettersRemaining.map((letter, index) => (
                            <button
                                className="letter-button"
                                key={index}
                                onClick={() => handleInput(letter)}
                            >
                                {letter}
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
            <p>REMOVE THIS: {targetWord}</p>
            <hr />
            <hr />
        </div>
    );
}
