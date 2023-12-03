import React, { useEffect, useState } from 'react'
import LetterDisplay from './LetterDisplay'

const WordDisplay = ({typingWord, constraint}:
    {
        typingWord: string,
        constraint: string
    }
) => {

    const [displayWord, setDisplayWord] = useState<string>("")

    const [consFilledIdx, setConsFilledIdx] = useState<number>(-1)
    const [consEmptyIdx, setConsEmptyIdx] = useState<number>(-1)

    useEffect(() => {
        setConsFilledIdx(typingWord.toUpperCase().indexOf(constraint.toUpperCase()))

        if (typingWord.toUpperCase().indexOf(constraint.toUpperCase()) !== -1) {
            setConsEmptyIdx(typingWord.length + 100)
            setDisplayWord(typingWord.toUpperCase())
            return
        }

        setConsEmptyIdx(typingWord.length)
        if (constraint.length === 3 && typingWord.length >= 2 && constraint.toUpperCase().slice(0, 2) === typingWord.toUpperCase().slice(-2)) {
            setConsFilledIdx(typingWord.length - 2)
            setDisplayWord(typingWord.toUpperCase() + constraint.toUpperCase().slice(2))
        }
        else if (typingWord.length >= 1 && constraint.toUpperCase().slice(0, 1) === typingWord.toUpperCase().slice(-1)) {
            setConsFilledIdx(typingWord.length - 1)
            setDisplayWord(typingWord.toUpperCase() + constraint.toUpperCase().slice(1))
        }
        else {
            setConsFilledIdx(typingWord.length + 100)
            setDisplayWord(typingWord.toUpperCase() + constraint.toUpperCase())
        }
    }, [typingWord, constraint])

    return (
        <div className="space-y-1">
            <div className="pb-12 pt-4 space-x-1 flex justify-center">
            {
                displayWord.toUpperCase( ).split('').map((letter, idx) => (
                    <LetterDisplay 
                        letter={letter} 
                        key={idx} 
                        status={(idx >= consFilledIdx && idx < consFilledIdx + constraint.length && idx < typingWord.length) ? 
                                "Filled"
                            :
                            ((idx >= consEmptyIdx) ? "Empty" : "Normal")
                        }
                    />
                ))
            }
            </div>
        </div>
    )
}

export default WordDisplay