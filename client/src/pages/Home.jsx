import { Link } from "react-router-dom";
import Header from "../components/Header";
import HomeMiniFlow from "../components/HomeMiniFlow.jsx";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import Steps from "../components/Steps";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Home() {
  return (
    <MarketingPageShell className="pb-12 pt-6 sm:pb-16 sm:pt-8">
      <Header />
      <HomeMiniFlow />
      <Steps />
      <section className="mx-auto mt-16 max-w-xl border-t border-slate-200/80 pt-14 text-center sm:mt-20 sm:pt-16">
        <h2 className="type-section-title">Pricing</h2>
        <p className="type-body mx-auto mt-3 max-w-md">
          Start free with a steady daily allowance, or scale when the studio becomes part of your routine.
        </p>
        <Link
          to="/pricing"
          className="btn-primary mx-auto mt-6 inline-flex rounded-full px-7 py-2.5 text-sm font-semibold"
        >
          See plans
        </Link>
        <p className="type-meta mt-5">
          <Link to={`/studio`} className="font-medium text-slate-700 underline-offset-4 hover:underline">
            Open {WORKSPACE_NAME}
          </Link>
          <span className="text-slate-300"> · </span>
          <Link to="/help" className="font-medium text-slate-700 underline-offset-4 hover:underline">
            Help &amp; credits
          </Link>
        </p>
      </section>
    </MarketingPageShell>
  );
}
