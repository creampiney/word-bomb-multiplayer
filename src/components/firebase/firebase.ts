// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDoc, getFirestore, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getDatabase, ref, onValue, set } from "firebase/database";
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const realtimeDb = getDatabase(app);



async function createRoom(playerASession: string, playerAName: string) {
  const docRef = await addDoc(collection(db, "rooms"), {
    playerCount: 1,
    playerASession: playerASession,
    playerAName: playerAName,
    isStart: false,
    isDone: false,
    isPlayerBTurn: false
  });
  return docRef.id
}

async function joinRoom(roomId: string, sessionId: string, name: string) {
    const docRef = doc(db, "rooms", roomId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        console.log("Room not found")
        return "Room not found"
    }
    
    const docData = docSnap.data()
    if(docData.playerCount != 1) {
        console.log("Room is full")
        return "Room is full"
    }

    const updateDocRef = await updateDoc(doc(db, "rooms", roomId), {
        playerCount: 2,
        playerBSession: sessionId,
        playerBName: name,
        isFull: true
      });
    
    return "Room found"
    
}

async function getRoomData(roomId: string) {
    const docRef = doc(db, "rooms", roomId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        return {status: "failed"}
    }

    return docSnap.data()
}

async function writeCurrentTyping(roomId: string, word: string) {
  console.log(word)
  await set(ref(realtimeDb, 'currentTyping/' + roomId), word);
}

export { db, realtimeDb, createRoom, joinRoom, getRoomData, writeCurrentTyping }
