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
import Avatar from '../etc/Avatar';
import { FaHeart } from "react-icons/fa";
import AvatarSkeleton from '../etc/AvatarSkeleton';

const Game = ({sessionId}:{sessionId: string}) => {

    let { roomId } = useParams();

    const navigate = useNavigate()

    const [myPlayer, setMyPlayer] = useState<string>("")

    const [playerAName, setPlayerAName] = useState<string>("")
    const [playerBName, setPlayerBName] = useState<string>("")

    const [isFull, setFull] = useState<boolean>(false)
    const [isStart, setStart] = useState<boolean>(false)
    const [isDone, setDone] = useState<boolean>(false)

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
        setPlayerALife(2)
        setPlayerBLife(2)


        const updateDocRef = await updateDoc(doc(db, "rooms", roomId || ""), {
            isDone: false,
            isStart: true,
            playerALife : 2,
            playerBLife : 2,
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
        setStart(data.isStart)

        if(data.isStart) {
            setCurrentTypeWord("")
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

        setPlayerALife(data.playerALife)
  
        setPlayerBLife(data.playerBLife)

        setDone(data.isDone)
        
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
        const nextTurn = (currentTurn === "A") ? "B" : "A"

        if (currentTurn === "A") {
            const updateDocRef = await updateDoc(doc(db, "rooms", roomId || ""), {
                currentTurn: nextTurn,
                currentConstraint: getRandomConstaint(),
                playerALife: playerALife - 1,
                isDone: (playerALife - 1 <= 0) ? true : false,
                isStart: (playerALife - 1 <= 0) ? false : true
            });
        }
        else if (currentTurn === "B") {
            const updateDocRef = await updateDoc(doc(db, "rooms", roomId || ""), {
                currentTurn: nextTurn,
                currentConstraint: getRandomConstaint(),
                playerBLife: playerBLife - 1,
                isDone: (playerBLife - 1 <= 0) ? true : false,
                isStart: (playerBLife - 1 <= 0) ? false : true
            });
        }
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
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-100 overflow-hidden">
            <div className="w-full h-5 overflow-hidden">
                {
                    (isStart && myPlayer === currentTurn) &&
                        <GameTimer duration={10} handleTimeUp={handleTimeUp} />
                }
                {
                    (isStart && myPlayer !== currentTurn) &&
                        <GameTimer duration={10} handleTimeUp={() => {}} />
                }
            </div>
            <div className="w-full flex flex-col flex-1 px-10">
                
                <div className="w-full h-48 py-5 flex justify-center">
                    <div className="w-1/2 flex">
                        <div className="w-fit h-full flex flex-col justify-center">
                            <Avatar src="https://utfs.io/f/4a65c7f9-7bb1-4498-99bb-4148be482108-t9vzc5.png" size={24} />
                        </div>
                        <div className="w-fit h-full flex flex-col justify-center pl-5 space-y-3">
                            <div className="font-medium">{playerAName}</div>
                            <div className="font-medium flex space-x-3 text-lg">
                                <FaHeart className={(playerALife >= 1 || (!isDone && !isStart)) ? "text-red-500" : "text-gray-400"} />
                                <FaHeart className={(playerALife >= 2 || (!isDone && !isStart)) ? "text-red-500" : "text-gray-400"} />
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-row-reverse">
                        <div className="w-fit h-full flex flex-col justify-center">
                            {
                                (playerBName) ?
                                    <Avatar src="https://utfs.io/f/4a65c7f9-7bb1-4498-99bb-4148be482108-t9vzc5.png" size={24} />
                                :
                                    <AvatarSkeleton size={24} />
                            }
                            
                        </div>
                        <div className="w-fit h-full flex flex-col justify-center pr-5 space-y-3">
                            {
                                (playerBName) ?
                                <>
                                    <div className="font-medium text-right">{playerBName}</div>
                                    <div className="font-medium flex space-x-3 text-lg">
                                        <FaHeart className={(playerBLife >= 1 || (!isDone && !isStart)) ? "text-red-500" : "text-gray-400"} />
                                        <FaHeart className={(playerBLife >= 2 || (!isDone && !isStart)) ? "text-red-500" : "text-gray-400"} />
                                    </div>
                                </> :
                                <>
                                    <div className="font-medium">Waiting for another player...</div>
                                </>
                            }
                            
                        </div>
                        
                    </div>
                    
                    
                    
                </div>
                {
                    (isStart) &&
                    <div className="w-full flex justify-center">
                        <span className="font-medium">{(currentTurn === "A") ? playerAName : playerBName}, type an English word containing:</span>
                    </div>
                }
                
                <div>
                {
                    (isStart) &&
                    <WordDisplay typingWord={currentTypeWord || ""} constraint={currentConstraint} />
                }
                </div>
                <div>
                {
                    (isStart && myPlayer === currentTurn) &&
                    <Keyboard typingWord={currentTypeWord || ""} handleTyping={handleTyping} checkAnswer={checkAnswer} />
                }
                </div>
                
                <div>
                {
                    (isDone) && (
                        <div className="w-full">
                            <div className="w-full flex flex-col justify-center space-y-2 py-5">
                                <div className="font-bold text-xl text-center">Game Over!</div>
                                <div className="font-medium text-center">The winner is {(playerALife === 0) ? playerBName : playerAName}</div>
                            </div>
                        </div>
                    )
                }
                </div>
                {/* <button onClick={() => {alert(usedWord)}}>Show used word</button> */}
                
                <div className="flex flex-col items-center justify-center">
                {   
                (!isStart) && (
                    (myPlayer == "A") ?
                        (
                            (isFull) ?
                                <button 
                                    onClick={startGame}
                                    className="w-[225px] text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                                >
                                    {(isDone) ? "Play again" : "Click to Start"}
                                </button>
                            :
                                <button
                                    className="w-[225px] text-white bg-indigo-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                                    disabled
                                >
                                    Waiting for another player...
                                </button>
                        )
                    :
                        <button
                            className="w-[225px] text-white bg-indigo-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                            disabled
                        >
                            Wating for host to start...
                        </button>
                )
                }
                </div>
                
            </div>
        </div>
    )
}

export default Game