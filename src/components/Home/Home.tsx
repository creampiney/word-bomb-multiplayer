import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createRoom, joinRoom, readPilot, writePilot } from "../firebase/firebase"
import { LuUser2 } from "react-icons/lu";
import { IoIosBarcode } from "react-icons/io";
import Divider from "../etc/Divider";
import CookieConsent from "./CookieConsent/CookieConsent";
import { useCookies } from "react-cookie";


const Home = ({sessionId}:{sessionId: string}) => {

    const navigate = useNavigate()

    const [cookies, setCookie] = useCookies(["user"]);

    const [showConsent, setShowConsent] = useState<boolean>(false)

    const [name, setName] = useState("")
    const [roomCode, setRoomCode] = useState("")

    async function handleCreateRoom() {
        if (!name) {
            alert("Yo, fill your name!")
            return
        }

        const roomCode = await createRoom(sessionId, name)
        navigate(`/${roomCode}`)
        
    }

    async function handleJoinRoom() {
        if (!name) {
            alert("Yo, fill your name!")
            return
        }
        if (!roomCode) {
            alert("Fill code!")
            return
        }

        const status = await joinRoom(roomCode, sessionId, name)
        if (status == "Room found") {
            navigate(`/${roomCode}`)
        }
        else {
            alert(status)
        }
        
    }

    async function initCookieConsent() {
        if (!cookies.user) {
            return
        }
        const needConsent = await readPilot(cookies.user)
        setShowConsent(!needConsent)
    }

    async function handlePilotConsent(isAccept: boolean) {
        if (!cookies.user) {
            return
        }
        await writePilot(cookies.user, isAccept)
        setShowConsent(false)
    }

    useEffect(() => {
        initCookieConsent()
    }, [])


    return (
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
            {
                (showConsent) &&
                <CookieConsent handleSubmit={handlePilotConsent} />
            }
            <div className="w-screen h-screen bg-slate-100 flex flex-col overflow-hidden">
                {/* <div className="h-[40px] flex justify-center p-5">
                    <div>Word Bomb</div>
                </div> */}
                
                <div className="w-full flex-1 flex justify-center">
                    
                    <div className="w-full h-full flex flex-row justify-center p-5">
                        <div className="w-96 flex flex-col justify-center space-y-2">
                            <span
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center text-6xl logo"
                            >
                                Word Bomb
                            </span>
                            <span className="font-medium">Player Name</span>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <LuUser2 className="text-gray-500"/>
                                </div>
                                <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => {setName(e.target.value)}} 
                                placeholder="Fill your player name..."
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                                />
                            </div>

                            <button 
                                className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2" 
                                onClick={handleCreateRoom}
                            >
                                Create New Room
                            </button>
                            
                            <Divider />
                            
                            <span className="font-medium">Or join the room</span>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <IoIosBarcode className="text-gray-500"/>
                                </div>
                                <input 
                                    type="text" 
                                    value={roomCode} 
                                    onChange={(e) => {setRoomCode(e.target.value)}} 
                                    placeholder="Fill room code..."
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
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
        </div>
    )
}

export default Home