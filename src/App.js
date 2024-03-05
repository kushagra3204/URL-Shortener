import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react';
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Analytics from "./components/Analytics";

import TempAnalytics from "./components/tempAnalytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tempAnalytics" element={<TempAnalytics />} />
        <Route path="/:shortLink/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;