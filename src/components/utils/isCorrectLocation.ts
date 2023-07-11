export function isCorrectLocation(
    letter: string,
    index: number,
    targetWord: string
): boolean {
    if (letter === targetWord.charAt(index)) {
        console.log(
            letter === targetWord.charAt(index),
            letter,
            " is equal to",
            targetWord.charAt(index),
            "at index",
            index
        );
        return true;
    } else {
        return false;
    }
}
