import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { db, getRoomData, realtimeDb, writeCurrentTyping } from '../firebase/firebase';
import { DocumentData, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { onValue, ref } from 'firebase/database';
import Keyboard from './Keyboard/Keyboard';
import WordDisplay from './Display/WordDisplay';
import { getRandomConstaint, isWordInWordList } from '../../lib/wordManager';
import GameTimer from '../../utils/GameTimer';
import Avatar from '../etc/Avatar';
import { FaHeart } from "react-icons/fa";
import AvatarSkeleton from '../etc/AvatarSkeleton';
import { MdContentCopy } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import copy from 'copy-to-clipboard';
import useSound from 'use-sound';

// Sound
import wrongSfx from '../../sounds/wrong.mp3'
import correctSfx from '../../sounds/correct.mp3'
import explosionSfx from '../../sounds/explosion.mp3'
import turnSfx from '../../sounds/turn.mp3'
import TutorialBox from './Tutorial/TutorialBox';


const Game = ({sessionId}:{sessionId: string}) => {

    let { roomId } = useParams();

    const navigate = useNavigate()

    const [myPlayer, setMyPlayer] = useState<string>("")

    const [playerAName, setPlayerAName] = useState<string>("")
    const [playerBName, setPlayerBName] = useState<string>("")

    const [playerAAvatar, setPlayerAAvatar] = useState<number>(0)
    const [playerBAvatar, setPlayerBAvatar] = useState<number>(0)

    const [isFull, setFull] = useState<boolean>(false)
    const [isStart, setStart] = useState<boolean>(false)
    const [isDone, setDone] = useState<boolean>(false)

    const [playerALife, setPlayerALife] = useState<number>(2)
    const [playerBLife, setPlayerBLife] = useState<number>(2)

    const [currentTypeWord, setCurrentTypeWord] = useState<string>("")
    const [currentConstraint, setCurrentConstraint] = useState<string>("")
    const [currentTurn, setCurrentTurn] = useState<string>("A")
    const [wordValidStatus, setWordValidStatus] = useState<number>(0)
    const [previousWord, setPreviousWord] = useState<string>("")

    const [usedWord, setUsedWord] = useState<string[]>([])


    // Sound
    const [playWrong] = useSound(wrongSfx)
    const [playCorrect] = useSound(correctSfx)
    const [playExplosion] = useSound(explosionSfx)
    const [playTurn] = useSound(turnSfx)


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
        if(roomData.playerAAvatar) {
            setPlayerAAvatar(roomData.playerAAvatar)
        }
        if(roomData.playerBAvatar) {
            setPlayerBAvatar(roomData.playerBAvatar)
        }
        if(roomData.isFull) {
            setFull(roomData.isFull)
        }

        checkSession(roomData.playerASession, roomData.playerBSession)
    }

    // Start Game
    async function startGame() {
        setCurrentTurn("A")
        setPlayerALife(2)
        setPlayerBLife(2)


        const updateDocRef = await updateDoc(doc(db, "rooms", roomId || ""), {
            isDone: false,
            isStart: true,
            playerALife : 2,
            playerBLife : 2,
            currentTurn: "A",
            currentConstraint: getRandomConstaint(),
            previousWord: ""
        });
    }

    // Update Room Data
    function updateGame(data : DocumentData | undefined) {
        if(!data){
            return
        }

        if(data.playerAName && data.playerAName != playerAName) {
            setPlayerAName(data.playerAName)
        }
        if(data.playerBName && data.playerBName != playerBName) {
            setPlayerBName(data.playerBName)
        }
        if(data.playerAAvatar) {
            setPlayerAAvatar(data.playerAAvatar)
        }
        if(data.playerBAvatar) {
            setPlayerBAvatar(data.playerBAvatar)
        }
        if(data.isFull && data.isFull != isFull) {
            setFull(data.isFull)
        }  

        
        if(data.previousWord && !usedWord.includes(data.previousWord)) {
            setPreviousWord(data.previousWord)
            // const newUsedWord = usedWord
            // newUsedWord.push(data.previousWord)
            // setUsedWord(newUsedWord)
            // setUsedWord((usedWord) => [...usedWord, data.previousWord])
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

        

        setPlayerALife(data.playerALife)
  
        setPlayerBLife(data.playerBLife)

        setDone(data.isDone)

        if(myPlayer === data.currentTurn) {
            console.log("play")
            playTurn()
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
            setWordValidStatus(1)
            playWrong()
            return
        }

        // Check if it is used
        if (usedWord.includes(currentTypeWord)) {
            setWordValidStatus(2)
            playWrong()
            return
        }

        // Check if word is not valid
        const isValid = isWordInWordList(currentTypeWord || "")
        if (!isValid) {
            setWordValidStatus(3)
            playWrong()
            return
        }

        // Valid word: Opponent turn
        const nextTurn = (currentTurn === "A") ? "B" : "A"

        
        playCorrect()
        const updateDocRef = await updateDoc(doc(db, "rooms", roomId || ""), {
            currentTurn: nextTurn,
            currentConstraint: getRandomConstaint(),
            previousWord: currentTypeWord
        });

        await handleTyping("")
    }

    // Handle Timeup
    async function handleTimeUp() {
        playExplosion()

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


    // Handle Copying to clipboard
    function handleRoomIdCopy() {
        let isCopy = copy(roomId || "");
        if (isCopy) {
            toast("Copied to Clipboard");
        }
    }
    

    // Subscribe Firebase
    useEffect(() => {
        initData()

        const unsubscribe = onSnapshot(doc(db, "rooms", roomId || ""), (doc) => {
            const data = doc.data();
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
          setCurrentTypeWord(data)
        });
    }, [])

    // Update word error
    useEffect(() => {
        setWordValidStatus(0)
    }, [currentTypeWord])

    // Clear used word
    useEffect(() => {
        if (isDone) {
            console.log("clear array")
            setUsedWord([])
        }
    }, [isDone])

    // Add used word
    useEffect(() => {
        if (!usedWord.includes(previousWord)) {
            setUsedWord((usedWord) => [...usedWord, previousWord])
        }
    }, [previousWord])

    


    return (
        <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-slate-100 overflow-x-hidden ">
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
            <div className="w-full flex flex-col flex-1">
                
                <div className="px-10 w-full h-[192px] sm:h-[96px] my-5 flex flex-col sm:flex-row justify-center">
                    <div className={`w-full sm:w-1/2 flex rounded-full ${(isStart && currentTurn === "A") && "bg-slate-200"}`}>
                        <div className="w-fit h-full flex flex-col justify-center">
                            <Avatar src={playerAAvatar} size={24} />
                        </div>
                        <div className="w-fit h-full flex flex-col justify-center pl-5 space-y-3">
                            <div className="font-medium">{playerAName}{(myPlayer === "A") && <span className="font-bold"> (Me)</span>}</div>
                            <div className="font-medium flex space-x-1 text-lg">
                                <FaHeart className={(playerALife >= 1 || (!isDone && !isStart)) ? "text-red-500" : "text-gray-400"} />
                                <FaHeart className={(playerALife >= 2 || (!isDone && !isStart)) ? "text-red-500" : "text-gray-400"} />
                            </div>
                        </div>
                    </div>
                    <div className={`w-full sm:w-1/2 flex flex-row-reverse rounded-full ${(isStart && currentTurn === "B") && "bg-slate-200"}`}>
                        <div className="w-fit h-full flex flex-col justify-center">
                            {
                                (playerBName) ?
                                    <Avatar src={playerBAvatar} size={24} />
                                :
                                    <AvatarSkeleton size={24} />
                            }
                            
                        </div>
                        <div className="w-fit h-full flex flex-col justify-center pr-5 space-y-3">
                            {
                                (playerBName) ?
                                <>
                                    <div className="font-medium text-right">{playerBName}{(myPlayer === "B") && <span className="font-bold"> (Me)</span>}</div>
                                    <div className="w-full font-medium flex space-x-1 text-lg justify-end">
                                        <FaHeart className={(playerBLife >= 2 || (!isDone && !isStart)) ? "text-red-500" : "text-gray-400"} />
                                        <FaHeart className={(playerBLife >= 1 || (!isDone && !isStart)) ? "text-red-500" : "text-gray-400"} />    
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
                    <div className="px-10 w-full flex justify-center">
                        {
                            (wordValidStatus === 0) && (
                                <span className="font-medium text-center">{(currentTurn === "A") ? playerAName : playerBName}, type an English word containing:</span>
                            )
                        }
                        {
                            (wordValidStatus === 1) && (
                                <span className="font-medium text-red-700">This word does not contain {currentConstraint}</span>
                            )
                        }
                        {
                            (wordValidStatus === 2) && (
                                <span className="font-medium text-red-700">This word is already used</span>
                            )
                        }
                        {
                            (wordValidStatus === 3) && (
                                <span className="font-medium text-red-700">This word is not valid</span>
                            )
                        }
                        
                    </div>
                }
                
                <div className="px-10">
                {
                    (isStart) &&
                    <WordDisplay typingWord={currentTypeWord || ""} constraint={currentConstraint} />
                }
                </div>
                <div className="">
                {
                    (isStart && myPlayer === currentTurn) &&
                    <Keyboard typingWord={currentTypeWord || ""} handleTyping={handleTyping} checkAnswer={checkAnswer} />
                }
                </div>
                
                <div className="px-10">
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
                
                
                {
                    (!isStart && !isDone && myPlayer === "A") && (
                        <div className="px-10 flex flex-col items-center justify-center space-y-4 pb-4">
                            <span className="font-bold text-center">Invite your friend by sending this code</span>
                            <div className="relative w-[300px]">                        
                                <input 
                                    type="text" 
                                    value={roomId}
                                    placeholder=""
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md font-medium rounded-lg block w-full pe-10 p-2.5 text-center"
                                    disabled
                                />
                                <div className="absolute inset-y-0 end-0 flex items-center pe-3">
                                    <button className="hover:bg-slate-100 z-10" onClick={handleRoomIdCopy}>
                                        <MdContentCopy className="text-gray-900"/>
                                    </button>
                                </div>
                             </div>
                        </div>
                    )
                }
                
                <div className="px-10 flex flex-col items-center justify-center">
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

                <div className="px-0 sm:px-10 flex flex-col items-center justify-center mb-5 mt-5">
                    <TutorialBox />
                </div>
                
                
            </div>
            <ToastContainer
                position="top-center"
                autoClose={500}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    )
}

export default Game