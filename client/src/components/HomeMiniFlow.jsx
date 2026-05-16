import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { HOME_SHORTCUT_TILES } from "../content/marketingShared";
import { assets } from "../assets/assets";

const flowSteps = [
  {
    n: "1",
    title: "Sign in once",
    line: "One account keeps credits, renders, and your gallery aligned.",
    img: assets.sample_img_1,
    imgClass: "object-cover object-center",
  },
  {
    n: "2",
    title: "Describe & generate",
    line: "Choose a mood, write clearly, receive a first frame in about a minute.",
    img: assets.sample_img_2,
    imgClass: "object-cover object-center",
  },
  {
    n: "3",
    title: "Refine in place",
    line: "Small edits stay on the same thread — shaping, not restarting.",
    img: assets.style_cyberpunk,
    imgClass: "object-cover object-center",
  },
];

export default function HomeMiniFlow() {
  return (
    <section className="mx-auto w-full max-w-6xl pb-10 pt-10 sm:pb-14 sm:pt-12">
      <div className="px-0">
        <h2 className="type-subsection-title">Where to next</h2>
        <p className="type-body-tight mx-auto mt-1.5 max-w-2xl md:mx-0">
          Studio, gallery, plans — the routes people open most often.
        </p>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:gap-4">
        {HOME_SHORTCUT_TILES.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.to}>
              <Link
                to={link.to}
                className="marketing-surface-hover group relative flex gap-3 rounded-2xl border border-slate-200/85 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 transition group-hover:bg-white">
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="type-tile-title">{link.title}</span>
                  <span className="type-body-tight mt-0.5 block">{link.desc}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="relative mt-12 rounded-2xl border border-slate-200/85 bg-white/95 p-6 shadow-card sm:mt-14 sm:p-8">
        <div className="text-center">
          <p className="type-eyebrow-muted">Flow</p>
          <h2 className="type-section-accent mt-2">Idea · image · refine</h2>
          <p className="type-body mx-auto mt-2 max-w-lg sm:max-w-xl">
            A new prompt spends from your daily pool. Tweaks on the same thread stay conversational — lighter than
            another full render.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {flowSteps.map(({ n, title, line, img, imgClass }) => (
            <article
              key={title}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white text-left shadow-sm transition hover:border-slate-300"
            >
              <div className="relative h-[7.25rem] overflow-hidden bg-slate-100 sm:h-[8rem]">
                <img src={img} alt="" className={`h-full w-full ${imgClass}`} draggable={false} />
                <span className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                  {n}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
                <h3 className="type-tile-title leading-snug">{title}</h3>
                <p className="type-body mt-1.5">{line}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200/90 bg-slate-50/80 px-4 py-3.5 text-center sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-3 sm:text-left">
          <span className="inline-flex items-start justify-center gap-2 sm:items-center">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-600/90 sm:mt-0" aria-hidden />
            <span className="type-body text-left text-slate-700">
              Free accounts get about <strong className="type-emphasis">10 fresh images</strong> a day from{" "}
              <strong>100</strong> credits (~<strong>10</strong> per new run). Refinements on the same thread are usually
              lighter — see Help for detail.
            </span>
          </span>
          <Link to="/help" className="type-link-brand mt-3 block shrink-0 text-center sm:mt-0 sm:inline-block">
            Credit rules
          </Link>
        </div>

        <p className="type-meta mt-5 text-center">
          Timezones and refinement nuance —{" "}
          <Link to="/help" className="font-medium text-slate-700 underline-offset-4 hover:underline">
            Help hub
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
