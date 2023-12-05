import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import {v4 as uuidv4} from 'uuid';
import Game from './components/Game/Game';
import { readABTesting, writeABTesting } from './components/firebase/firebase';

function App() {

  const dataFetchedRef = useRef(false);
  const cookieConsentInitRef = useRef(false)
  const [cookies, setCookie] = useCookies(["user"]);

  const [isCookieSet, setCookieSet] = useState<boolean>(true);
  const [cookieTemp, setCookieTemp] = useState<string>();

  const [sessionId, setSessionId] = useState<string>(uuidv4());

  const [showConsent, setShowConsent] = useState<boolean>(false)
  const [group, setGroup] = useState<string>("A")


  // For A/B Testing && Pilot
  function handleGenerateUUID() {
    if (cookies.user) {
      setCookieTemp(cookies.user)
      setCookieSet(true)
      return
    }
    const newCookie = uuidv4()
    setCookie("user", newCookie, { path: "/" })
    setCookieTemp(newCookie)
    setCookieSet(true)

  }

  async function initABConsent() {
    if (cookieConsentInitRef.current === true || !isCookieSet || !cookieTemp) {
      return
    }
    cookieConsentInitRef.current = true

    const needConsent = await readABTesting(cookieTemp)
    if (needConsent === "Y") {
      setShowConsent(false)
    }
    else if (needConsent === "A" || needConsent === "B") {
      setShowConsent(true)
      setGroup(needConsent)
    }

  }

  async function handleABConsent(isAccept: boolean) {
    if (!cookies.user) {
      handleGenerateUUID()
    }
    await writeABTesting(cookies.user, isAccept)
    setShowConsent(false)
  }

  useEffect(() => {
    if (dataFetchedRef.current) {
      return
    }
    dataFetchedRef.current = true
    handleGenerateUUID()
  }, [])

  useEffect(() => {
    initABConsent()
  }, [isCookieSet, cookieTemp])

  return (
    <>
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home sessionId={sessionId} consent={showConsent} handleConsent={handleABConsent} group={group} />} />
            <Route path="/:roomId" element={<Game sessionId={sessionId} />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </>
  );
}

export default App;
