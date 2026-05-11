import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Steps from "../components/Steps";
import HomeHelpSection from "../components/HomeHelpSection";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== "#help") return;
    const el = document.getElementById("help");
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="flex w-full flex-col items-center pb-8">
      <Header />
      <Steps />
      <HomeHelpSection />
    </div>
  );
}
