import Header from "../components/Header";
import HomeMiniFlow from "../components/HomeMiniFlow.jsx";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import Steps from "../components/Steps";

export default function Home() {
  return (
    <MarketingPageShell className="pb-12 pt-6 sm:pb-16 sm:pt-8">
      <Header />
      <HomeMiniFlow />
      <Steps />
    </MarketingPageShell>
  );
}
