import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import BuyCredits from "./pages/BuyCredits";
import ComingSoon from "./pages/ComingSoon";
import Studio from "./pages/Studio";
import Gallery from "./pages/Gallery";
import Feedback from "./pages/Feedback";
import Pricing from "./pages/Pricing";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { AppContext } from "./context/AppContext";

const App = () => {
  const { showLogin } = useContext(AppContext);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen overflow-x-hidden bg-mesh">
      <ToastContainer position="bottom-right" theme="colored" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <NavBar />
        {showLogin && <Login />}
        <main className={`flex flex-1 flex-col ${isHome ? "" : "items-center"}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/result" element={<Studio />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/buyCredits" element={<BuyCredits />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
