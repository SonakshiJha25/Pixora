import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Help from "./pages/Help";
import BuyCredits from "./pages/BuyCredits";
import ComingSoon from "./pages/ComingSoon";
import Studio from "./pages/Studio";
import Gallery from "./pages/Gallery";
import Feedback from "./pages/Feedback";
import Pricing from "./pages/Pricing";
import PricingPro from "./pages/PricingPro";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { AppContext } from "./context/AppContext";

const App = () => {
  const { showLogin } = useContext(AppContext);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isStudioRoute =
    location.pathname === "/studio" || location.pathname === "/result";

  return (
    <div className="min-h-screen overflow-x-hidden bg-mesh">
      <ToastContainer position="bottom-right" theme="colored" />
      <div
        className={`mx-auto flex min-h-screen w-full flex-col ${
          isStudioRoute ? "max-w-none px-0" : "max-w-6xl px-4 sm:px-6 lg:px-8"
        }`}
      >
        <NavBar />
        {showLogin && <Login />}
        <main
          className={`flex flex-1 flex-col ${
            isHome ? "" : isStudioRoute ? "w-full items-stretch" : "items-center"
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/help" element={<Help />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/result" element={<Studio />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/pricing/pro" element={<PricingPro />} />
            <Route path="/buyCredits" element={<BuyCredits />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!isStudioRoute ? <Footer /> : null}
      </div>
    </div>
  );
};

export default App;
