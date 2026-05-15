import Header from "../components/Header";
import HomeMiniFlow from "../components/HomeMiniFlow.jsx";
import Steps from "../components/Steps";

export default function Home() {
  return (
    <div className="relative w-full overflow-x-hidden pb-10">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[120vw] max-w-[1400px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_rgba(165,243,252,0.42),transparent_60%)]"
        aria-hidden
      />
      <div className="relative">
        <Header />
        <HomeMiniFlow />
        <Steps />
      </div>
    </div>
  );
}
