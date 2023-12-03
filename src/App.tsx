import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import {v4 as uuidv4} from 'uuid';
import Game from './components/Game/Game';

function App() {

  const [cookies, setCookie] = useCookies(["user"]);

  const [sessionId, setSessionId] = useState<string>(uuidv4());


  // For A/B Testing && Pilot
  function handleGenerateUUID() {
    if (cookies.user) {
      return
    }
    setCookie("user", uuidv4(), { path: "/" });
  }

  useEffect(() => {
    handleGenerateUUID()
  }, [])

  return (
    <>
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home sessionId={sessionId} />} />
            <Route path="/:roomId" element={<Game sessionId={sessionId} />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </>
  );
}

export default App;
