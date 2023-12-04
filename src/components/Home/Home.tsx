import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createRoom, joinRoom, readPilot, writePilot } from "../firebase/firebase"
import { LuUser2 } from "react-icons/lu";
import { IoIosBarcode } from "react-icons/io";
import Divider from "../etc/Divider";
import CookieConsent from "./CookieConsent/CookieConsent";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import Avatar from "../etc/Avatar";
import SelectableAvatar from "../etc/SelectableAvatar";


const Home = ({sessionId}:{sessionId: string}) => {

    const navigate = useNavigate()

    const [cookies, setCookie] = useCookies(["user"]);

    const [showConsent, setShowConsent] = useState<boolean>(false)

    const [name, setName] = useState("")
    const [roomCode, setRoomCode] = useState("")

    const [isNameError, setNameError] = useState<boolean>(false)
    const [isCodeError, setCodeError] = useState<boolean>(false)

    const [selectedAvatar, setSelectedAvatar] = useState<number>(1)

    async function handleCreateRoom() {
        setCodeError(false)
        if (!name) {
            setNameError(true)
            return
        }

        const roomCode = await createRoom(sessionId, name, selectedAvatar)
        navigate(`/${roomCode}`)
        
    }

    async function handleJoinRoom() {
        let isReject = false

        if (!name) {
            isReject = true
            setNameError(true)
        }
        else {
            setNameError(false)
        }

        if (!roomCode) {
            isReject = true
            setCodeError(true)
        }
        else {
            setCodeError(false)
        }

        if (isReject) {
            return
        }

        const status = await joinRoom(roomCode, sessionId, name, selectedAvatar)
        if (status == "Room found") {
            navigate(`/${roomCode}`)
        }
        else {
            toast('🦄 ' + status, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        }
        
    }

    async function initCookieConsent() {
        if (!cookies.user) {
            setShowConsent(true)
            return
        }
        const needConsent = await readPilot(cookies.user)
        console.log(needConsent)
        setShowConsent(!needConsent)
    }

    async function handlePilotConsent(isAccept: boolean) {
        if (!cookies.user) {
            return
        }
        await writePilot(cookies.user, isAccept)
        setShowConsent(false)
    }

    async function handleChangeAvatar(idx: number) {
        setSelectedAvatar(idx)
    }

    useEffect(() => {
        initCookieConsent()
    }, [])


    return (
        <div className="w-screen min-h-screen flex items-center justify-center">
            {
                (showConsent) &&
                <CookieConsent handleSubmit={handlePilotConsent} />
            }
            <div className="w-screen h-screen bg-slate-100 flex flex-col overflow-hidden">
                
                <div className="w-full flex-1 flex justify-center">
                    
                    <div className="w-full h-full flex flex-row justify-center p-5">
                        <div className="w-96 flex flex-col justify-center space-y-2">
                            <span
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center text-6xl logo"
                            >
                                Word Bomb
                            </span>
                            <div className="w-full flex justify-between">
                                <div>
                                    <span className="font-medium">Player Name</span>
                                </div>
                                {
                                    (isNameError) &&
                                    <div>
                                        <span className="text-red-600">Please fill your name</span>
                                    </div>
                                }
                                
                            </div>
                            
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <LuUser2 className="text-gray-500"/>
                                </div>
                                <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => {setName(e.target.value)}} 
                                placeholder="Fill your player name..."
                                className={`bg-gray-50 border ${(isNameError) ? "border-red-600" : "border-gray-300"} text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5`}
                                />
                            </div>

                            <div className="w-full flex justify-between">
                                <div>
                                    <span className="font-medium">Select Avatar</span>
                                </div>
                            </div>

                            <div className="w-full grid grid-cols-3 justify-center">
                                {
                                    [1,2,3,4,5,6].map((val) => (
                                        <div className="flex justify-center py-2">
                                            <SelectableAvatar src={val} key={val} size={14} onClick={handleChangeAvatar} isSelected={selectedAvatar === val}/>
                                        </div>
                                        
                                    ))
                                }
                                
                            </div>
                            

                            <button 
                                className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2" 
                                onClick={handleCreateRoom}
                            >
                                Create New Room
                            </button>
                            
                            <Divider />
                            
                            <div className="w-full flex justify-between">
                                <div>
                                    <span className="font-medium">Or join the room</span>
                                </div>
                                {
                                    (isCodeError) &&
                                    <div>
                                        <span className="text-red-600">Please fill room code</span>
                                    </div>
                                }
                                
                            </div>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <IoIosBarcode className="text-gray-500"/>
                                </div>
                                <input 
                                    type="text" 
                                    value={roomCode} 
                                    onChange={(e) => {setRoomCode(e.target.value)}} 
                                    placeholder="Fill room code..."
                                    className={`bg-gray-50 border ${(isCodeError) ? "border-red-600" : "border-gray-300"} text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5`}
                                />
                            </div>
                            
                            
                            <button 
                                onClick={handleJoinRoom}
                                className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                            >
                                Join Room
                            </button>
                            
                        </div>
                        
                    </div>
                    
                    
                    
                </div>
                
            </div>
            <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
        </div>
    )
}

export default Home