import Header from "../components/Header";
import HomeMiniFlow from "../components/HomeMiniFlow.jsx";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import Steps from "../components/Steps";

export default function Home() {
  return (
    <MarketingPageShell className="pb-10">
      <Header />
      <HomeMiniFlow />
      <Steps />
    </MarketingPageShell>
  );
}
