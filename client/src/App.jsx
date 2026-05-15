import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "motion/react";

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
import { MARKETING_CONTENT_MAX_WIDTH_CLASS } from "./content/marketingShared.js";

const App = () => {
  const { showLogin, token } = useContext(AppContext);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isStudioRoute =
    location.pathname === "/studio" || location.pathname === "/result";
  const isGallery = location.pathname === "/gallery";
  const isDarkWorkspace =
    isStudioRoute || (isGallery && Boolean(String(token || "").trim()));

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-[background-color] duration-500 ease-out ${
        isDarkWorkspace ? "bg-studio-app" : "bg-mesh"
      }`}
    >
      <ToastContainer position="bottom-right" theme={isDarkWorkspace ? "dark" : "colored"} />
      <div
        className={`mx-auto flex min-h-screen w-full flex-col ${
          isStudioRoute
            ? "max-w-none px-0"
            : `${MARKETING_CONTENT_MAX_WIDTH_CLASS} px-5 sm:px-8 lg:px-10`
        }`}
      >
        <NavBar />
        {showLogin && <Login />}
        <main
          className={`flex flex-1 flex-col ${
            isHome ? "" : isStudioRoute ? "w-full items-stretch" : "items-center"
          }`}
        >
          <motion.div
            key={isDarkWorkspace ? "workspace" : "marketing"}
            initial={{ opacity: 0.92, scale: 0.998 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col"
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
          </motion.div>
        </main>
        {!isDarkWorkspace ? <Footer /> : null}
      </div>
    </div>
  );
};

export default App;
