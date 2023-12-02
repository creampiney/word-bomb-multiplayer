import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createRoom, joinRoom } from "../firebase/firebase"


const Home = ({sessionId}:{sessionId: string}) => {

    const navigate = useNavigate()

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


    return (
        <div className="w-screen h-screen flex items-center justify-center bg-slate-300 overflow-hidden">
            <div className="w-[80vw] h-[80vh] bg-slate-100 rounded-3xl flex flex-col">
                <input type="text" value={name} onChange={(e) => {setName(e.target.value)}} placeholder="Name"></input>
                <button className="text" onClick={handleCreateRoom}>Create New Room</button>
                <input type="text" value={roomCode} onChange={(e) => {setRoomCode(e.target.value)}} placeholder="Code"></input>
                <button onClick={handleJoinRoom}>Join Room</button>
            </div>
        </div>
    )
}

export default Home