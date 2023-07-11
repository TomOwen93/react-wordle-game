export function isInWord(letter: string, targetWord: string): boolean {
    if (targetWord.includes(letter)) {
        console.log(`${letter} is in targetword: ${targetWord}`);
        return true;
    } else {
        return false;
    }
}
