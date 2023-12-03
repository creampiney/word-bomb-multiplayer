import React, { useEffect, useState } from 'react'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { db, getRoomData, realtimeDb, writeCurrentTyping } from '../firebase/firebase';
import { DocumentData, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { onValue, ref } from 'firebase/database';
import Key from './Keyboard/Key';
import Keyboard from './Keyboard/Keyboard';
import WordDisplay from './Display/WordDisplay';
import { getRandomConstaint, isWordInWordList } from '../../lib/wordManager';
import GameTimer from '../../utils/GameTimer';

const Game = ({sessionId}:{sessionId: string}) => {

    let { roomId } = useParams();

    const navigate = useNavigate()

    const [myPlayer, setMyPlayer] = useState<string>("")

    const [playerAName, setPlayerAName] = useState<string>("")
    const [playerBName, setPlayerBName] = useState<string>("")

    const [isFull, setFull] = useState<boolean>(false)
    const [isStart, setStart] = useState<boolean>(false)

    const [playerALife, setPlayerALife] = useState<number>(2)
    const [playerBLife, setPlayerBLife] = useState<number>(2)

    const [currentTypeWord, setCurrentTypeWord] = useState<string>("")
    const [currentConstraint, setCurrentConstraint] = useState<string>("")
    const [currentTurn, setCurrentTurn] = useState<string>("A")

    const [usedWord, setUsedWord] = useState<string[]>([])


    function checkSession(playerASession: string, playerBSession: string) {
        if(playerASession && sessionId == playerASession) {
            setMyPlayer("A")
        }
        else if (playerBSession && sessionId == playerBSession) {
            setMyPlayer("B")
        }
        else {
            navigate(`/`)
        }
    }

    // Get Room Data
    async function initData() {
        const roomData = await getRoomData(roomId || "")
        if(roomData.playerAName) {
            setPlayerAName(roomData.playerAName)
        }
        if(roomData.playerBName) {
            setPlayerBName(roomData.playerBName)
        }
        if(roomData.isFull) {
            setFull(roomData.isFull)
        }

        checkSession(roomData.playerASession, roomData.playerBSession)
    }

    // Start Game
    async function startGame() {
        if (playerALife != 2) {
            setPlayerALife(2)
        }
        if (playerBLife != 2) {
            setPlayerBLife(2)
        }


        const updateDocRef = await updateDoc(doc(db, "rooms", roomId || ""), {
            isStart: true,
            playerALife : playerALife,
            playerBLife : playerBLife,
            currentTurn: "A",
            currentConstraint: getRandomConstaint()
        });
    }

    // Update Room Data
    async function updateGame(data : DocumentData | undefined) {
        if(!data){
            return
        }

        if(data.playerAName && data.playerAName != playerAName) {
            setPlayerAName(data.playerAName)
        }
        if(data.playerBName && data.playerBName != playerBName) {
            setPlayerBName(data.playerBName)
        }
        if(data.isFull && data.isFull != isFull) {
            setFull(data.isFull)
        }
        if(data.isStart != isStart) {
            setCurrentTypeWord("")
            setStart(true)
        }
        
        if(data.currentTurn) {
            setCurrentTurn(data.currentTurn)
        }

        if(data.currentConstraint && currentConstraint != data.currentConstraint) {
            setCurrentConstraint(data.currentConstraint)
        }

        if(data.previousWord && !usedWord.includes(data.previousWord)) {
            const newUsedWord = usedWord
            newUsedWord.push(data.previousWord)
            setUsedWord(newUsedWord)
        }
    }

    // Handle typing realtime
    async function handleTyping(value: string) {
        if (currentTypeWord != value) {
            await writeCurrentTyping(roomId || "1", value.toUpperCase())
        }
        
    }

    // Check Answer
    async function checkAnswer() {
        if (!currentTypeWord) {
            return
        }

        // Check if meet constraint
        if (!currentTypeWord.includes(currentConstraint)) {
            alert("So noob, constraint is " + currentConstraint)
            return
        }

        // Check if it is used
        if (usedWord.includes(currentTypeWord)) {
            alert("It is used")
            return
        }

        // Check if word is not valid
        const isValid = isWordInWordList(currentTypeWord || "")
        if (!isValid) {
            alert("This word is not valid")
            return
        }

        // Valid word: Opponent turn
        const nextTurn = (currentTurn === "A") ? "B" : "A"

        

        const updateDocRef = await updateDoc(doc(db, "rooms", roomId || ""), {
            currentTurn: nextTurn,
            currentConstraint: getRandomConstaint(),
            previousWord: currentTypeWord
        });

        await handleTyping("")
    }

    // Handle Timeup
    async function handleTimeUp() {
        alert("Time up")
    }
    

    // Subscribe Firebase
    useEffect(() => {
        initData()

        const unsubscribe = onSnapshot(doc(db, "rooms", roomId || ""), (doc) => {
            const data = doc.data();
            console.log("Current data: ", data);
            updateGame(data)

        });

        return () => {
            unsubscribe();
        }
    }, [])

    // Subscribe Realtime DB
    useEffect(() => {
        const TypeRef = ref(realtimeDb, 'currentTyping/' + roomId);
        onValue(TypeRef, (snapshot) => {
          const data = snapshot.val();
          console.log("Out : " + data)
          setCurrentTypeWord(data)
        });
    }, [])



    return (
        <div className="w-screen h-screen flex items-center justify-center bg-slate-300 overflow-hidden">
            <div className="w-[95vw] h-[95vh] bg-slate-100 rounded-3xl flex flex-col">
                <div className="w-full h-5 rounded-t-md overflow-hidden">
                    {
                        (isStart && myPlayer === currentTurn) &&
                            <GameTimer duration={10} handleTimeUp={handleTimeUp} />

                    }
                    {
                        (isStart && myPlayer !== currentTurn) &&
                            <GameTimer duration={10} handleTimeUp={() => {}} />
                    }
                </div>
                <div>
                    <div>Player A: Life left {playerALife}</div>
                    <div>{playerAName}</div>
                    <div>Player B: Life left {playerBLife}</div>
                    <div>{playerBName}</div>
                </div>
                
                {
                    (isStart) &&
                    <WordDisplay typingWord={currentTypeWord || ""} constraint={currentConstraint} />
                }
                {
                    (isStart && myPlayer === currentTurn) &&
                    <Keyboard typingWord={currentTypeWord || ""} handleTyping={handleTyping} checkAnswer={checkAnswer} />
                }
                {/* <button onClick={() => {alert(usedWord)}}>Show used word</button> */}

                {   
                (!isStart) && (
                    (myPlayer == "A") ?
                        (
                            (isFull) ?
                                <button onClick={startGame}>Click to Start</button>
                            :
                                <button>Wait for another player</button>
                        )
                    :
                        <button>Wait for player A to start</button>
                )
                }
            </div>
        </div>
    )
}

export default Game