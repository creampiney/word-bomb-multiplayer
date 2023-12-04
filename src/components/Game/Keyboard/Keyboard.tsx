import React, { useEffect } from 'react'
import Key from './Key'

import typingSfx from '../../../sounds/typing.mp3'
import useSound from 'use-sound'

const Keyboard = ({typingWord, handleTyping, checkAnswer} : {typingWord: string, handleTyping: (value: string) => void, checkAnswer: () => void}) => {
  
    const [playTyping] = useSound(typingSfx)
    
    
    const row_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
    const row_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
    const row_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']

    function handleKeyType(key: string) {
        if(key.toUpperCase() === "ENTER") {
            checkAnswer()
        }
        else if(key.toUpperCase() === "BACKSPACE") {
            if(typingWord.length > 1) {
                playTyping()
                handleTyping(typingWord.slice(0, typingWord.length-1))
            }
            else if(typingWord.length === 1) {
                playTyping()
                handleTyping("")
            }
        }
        else if(key.length === 1 && key >= 'A' && key <= 'Z') {
            playTyping()
            handleTyping(typingWord + key)
        }
        else if(key.length === 4 && key.slice(0, 3) === "Key" && key.slice(-1) >= 'A' && key.slice(-1) <= 'Z') {
            playTyping()
            handleTyping(typingWord + key.slice(-1))
        }
    }

     // Keyboard typing
    const listener = (e: KeyboardEvent) => {
        handleKeyType(e.code)
    }

    useEffect(() => {
        
        window.addEventListener('keydown', listener, false)
        return () => {
          window.removeEventListener('keydown', listener, false)
        }
    }, [handleKeyType])

    return (
        <div className="space-y-2">
            <div className="space-x-2 flex justify-center">
                {
                    row_1.map((key) => (
                        <Key value={key} key={key} handleKeyType={handleKeyType} />
                    ))
                }
            </div>
            <div className="space-x-2 flex justify-center">
                {
                    row_2.map((key) => (
                        <Key value={key} key={key} handleKeyType={handleKeyType} />
                    ))
                }
            </div>
            <div className="space-x-2 flex justify-center">
                <Key value="ENTER" key="ENTER" handleKeyType={handleKeyType} />
                {
                    row_3.map((key) => (
                        <Key value={key} key={key} handleKeyType={handleKeyType} />
                    ))
                }
                <Key value="BACKSPACE" key="BACKSPACE" handleKeyType={handleKeyType} />
            </div>
            
        </div>
    )
}

export default Keyboard