import { EASY_CONSTRAINTS } from "../constants/constraintListEasy"
import { WORDS } from "../constants/wordList"

export const isWordInWordList = (word: string) => {
    return WORDS.includes(word.toLowerCase())
}

export const getRandomConstaint = (difficulty?: number) => {
    return EASY_CONSTRAINTS[Math.floor(Math.random() * EASY_CONSTRAINTS.length)].toUpperCase()
}