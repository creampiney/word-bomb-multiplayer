// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDoc, getFirestore, updateDoc, increment } from "firebase/firestore";
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

const rndString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

async function createRoom(playerASession: string, playerAName: string, avatarCode: number) {
  let roomId = ''
  let counter = 0;
  const charactersLength = rndString.length;
  while (counter < 6) {
      roomId += rndString.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
  }

  const docRef = await setDoc(doc(db, "rooms", roomId), {
    playerCount: 1,
    playerASession: playerASession,
    playerAName: playerAName,
    playerAAvatar: avatarCode,
    isStart: false,
    isDone: false,
    isPlayerBTurn: false
  });
  return roomId
}

async function joinRoom(roomId: string, sessionId: string, name: string, avatarCode: number) {
    const docRef = doc(db, "rooms", roomId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        return "The room is not found"
    }
    
    const docData = docSnap.data()
    if(docData.playerCount != 1) {
        return "This room is full"
    }

    const updateDocRef = await updateDoc(doc(db, "rooms", roomId), {
        playerCount: 2,
        playerBSession: sessionId,
        playerBAvatar: avatarCode,
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
  await set(ref(realtimeDb, 'currentTyping/' + roomId), word);
}


async function readPilot(uuid: string) {
    const docRef = doc(db, "pilot", uuid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return false
    }
    return true
}

async function readABTesting(uuid: string) {
    const docRef = doc(db, "pilot", uuid)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      // No data, generate it
      const counterRef = doc(db, "counter", "abtesting")
      const counterSnap = await getDoc(counterRef)

      if (!counterSnap.exists()) {
        return "Y"
      }

      const counterData = counterSnap.data()

      let currentGroup = "A"

      if (counterData.A > counterData.B) {
        currentGroup = "B"
      }

      const genRef = await setDoc(doc(db, "pilot", uuid), {
        group: currentGroup,
        isSentConsent: false,
        isAccept: false,
        createdAt: Date.now()
      });

      if (currentGroup === "A") {
        const updateCounter = await updateDoc(doc(db, "counter", "abtesting"), {
          A: increment(1)
        });
      }
      else if (currentGroup === "B") {
        const updateCounter = await updateDoc(doc(db, "counter", "abtesting"), {
          B: increment(1)
        });
      }

      return currentGroup
    }

    // Have data, check if consent is sented
    const docData = docSnap.data()

    if (!docData.isSentConsent) {
      return docData.group
    }

    // Have data and consent is sent, pass it
    return "Y"


}

async function writePilot(uuid: string, isAccept: boolean) {
  const docRef = await setDoc(doc(db, "pilot", uuid), {
    isAccept: isAccept,
    createdAt: Date.now()
  });
}


async function writeABTesting(uuid: string, isAccept: boolean) {
  const docRef = await updateDoc(doc(db, "pilot", uuid), {
    isSentConsent: true,
    isAccept: isAccept,
    sentAt: Date.now()
  });
}


export { db, realtimeDb, createRoom, joinRoom, getRoomData, writeCurrentTyping, readPilot, writePilot, readABTesting, writeABTesting }
