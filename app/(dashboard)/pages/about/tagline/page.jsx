// app/(dashboard)/pages/about/tagline/page.jsx
import AboutTaglineSectionEditor from "@/components/forms/AboutTaglineSectionEditor";

export default function AboutTaglinePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-white">About page — Tagline Section</h1>
      </div>
      <div className="border border-neutral-800 rounded-lg p-5">
        <AboutTaglineSectionEditor />
      </div>
    </div>
  );
}