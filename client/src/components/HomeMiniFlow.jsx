import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { HOME_SHORTCUT_TILES } from "../content/marketingShared";
import { assets } from "../assets/assets";
import { SidebarDecorCard } from "./MarketingDecorPieces.jsx";

const flowSteps = [
  {
    n: "1",
    title: "Sign in once",
    line: "One account keeps your gallery and favourites in sync.",
    img: assets.sample_img_1,
    imgClass: "object-cover object-center",
  },
  {
    n: "2",
    title: "Describe & create",
    line: "Pick a mood, explain your scene plainly, get a first draft in roughly a minute.",
    img: assets.sample_img_2,
    imgClass: "object-cover object-center",
  },
  {
    n: "3",
    title: "Download & like",
    line: "Save a PNG or heart pictures in My gallery—Refine (gentle edits) is coming soon.",
    img: assets.brandDecorKittenCloud,
    imgClass: "object-contain object-center p-2",
  },
];

export default function HomeMiniFlow() {
  return (
    <section className="mx-auto mt-8 w-full max-w-3xl px-0 pb-8 pt-2 sm:mt-10 sm:pb-10 sm:pt-3">
      <div className="text-center sm:text-left">
        <h2 className="type-subsection-title text-slate-900">Jump back in</h2>
        <p className="type-body-tight mx-auto mt-1 max-w-xl sm:mx-0">
          Shortcuts to the studio, your gallery, plans, and Help.
        </p>
      </div>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {HOME_SHORTCUT_TILES.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.to}>
              <Link
                to={link.to}
                className="marketing-surface-hover group relative flex gap-3 rounded-2xl border border-pastel-cyan/28 bg-white p-3.5 shadow-sm transition hover:border-pastel-sky hover:shadow-card sm:p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-pastel-cyan/35 bg-pastel-mist/80 text-slate-700 transition group-hover:bg-white">
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <span className="min-w-0 text-left">
                  <span className="type-tile-title">{link.title}</span>
                  <span className="type-body-tight mt-0.5 block">{link.desc}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="relative mt-9 overflow-hidden rounded-2xl border border-pastel-cyan/32 bg-white/92 p-5 shadow-[0_22px_50px_-32px_rgba(111,203,255,0.22)] backdrop-blur-sm sm:mt-10 sm:p-6">
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="min-w-0 flex-1">
            <div className="text-center lg:text-left">
              <p className="type-eyebrow-muted text-slate-500">How it works</p>
              <h2 className="type-section-accent mt-1.5 text-slate-900">Sign in → generate → save</h2>
              <p className="type-body mx-auto mt-2 max-w-lg text-slate-600 lg:mx-0">
                Pixorify is focused on the basics: create pictures, download them, and heart favourites in your gallery. No credit
                counters on screen.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-3">
              {flowSteps.map(({ n, title, line, img, imgClass }) => (
                <article
                  key={title}
                  className="flex flex-col overflow-hidden rounded-xl border border-pastel-cyan/25 bg-white text-left shadow-sm transition hover:border-pastel-sky/60"
                >
                  <div className="relative h-[6.5rem] overflow-hidden bg-gradient-to-br from-pastel-mist to-[#eaf8ff]/65 sm:h-[7.25rem]">
                    <img src={img} alt="" className={`h-full w-full ${imgClass}`} draggable={false} />
                    <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#6FCBFF] to-[#8FD8FF] text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/90">
                      {n}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
                    <h3 className="type-tile-title leading-snug text-slate-900">{title}</h3>
                    <p className="type-body mt-1 text-slate-600">{line}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-[12rem] shrink-0 lg:mx-0 lg:mt-10">
            <SidebarDecorCard />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-pastel-cyan/25 bg-pastel-mist/60 px-3.5 py-3 text-center sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-3 sm:text-left">
          <span className="inline-flex items-start justify-center gap-2 sm:items-center">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-pastel-cyan sm:mt-0" aria-hidden />
            <span className="type-body text-left text-slate-700">
              <strong className="type-emphasis">Refine</strong> (small edits on the same picture) is coming soon. Until then, generate
              fresh scenes and use download + ♥ in My gallery.
            </span>
          </span>
          <Link to="/help#workflow" className="type-link-brand mt-2.5 block shrink-0 text-center sm:mt-0 sm:inline-block">
            See the workflow
          </Link>
        </div>

        <p className="type-meta mt-4 text-center text-slate-500">
          Questions about what&apos;s live today —{" "}
          <Link to="/help" className="font-medium text-slate-700 underline-offset-4 hover:underline">
            open Help
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
