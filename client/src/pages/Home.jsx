import HomeFeelThree from "../components/home/HomeFeelThree.jsx";
import HomeHero from "../components/home/HomeHero.jsx";
import HomeShortcuts from "../components/home/HomeShortcuts.jsx";
import HomeStudioCta from "../components/home/HomeStudioCta.jsx";
import HomeStyleRail from "../components/home/HomeStyleRail.jsx";
import MarketingPageShell from "../components/MarketingPageShell.jsx";

export default function Home() {
  return (
    <MarketingPageShell className="pb-20 pt-6 sm:pt-8">
      <div className="relative w-full">
        <HomeHero />
        <HomeShortcuts />
        <HomeFeelThree />
        <HomeStyleRail />
        <HomeStudioCta />
      </div>
    </MarketingPageShell>
  );
}
