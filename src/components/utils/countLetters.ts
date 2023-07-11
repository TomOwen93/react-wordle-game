export const countLetters = (wordToCheck: string) => {
    const counter: { [letterCount: string]: number } = {};
    for (let letter of wordToCheck) {
        if (counter[letter]) {
            counter[letter] += 1;
        } else {
            counter[letter] = 1;
        }
    }
    return counter;
};
