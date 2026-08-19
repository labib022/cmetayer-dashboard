// app/(dashboard)/pages/about/hero/page.jsx
import AboutHeroSectionEditor from "@/components/forms/AboutHeroSectionEditor";

export default function AboutHeroPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-white">About page — Hero Section</h1>
      </div>
      <div className="border border-neutral-800 rounded-lg p-5">
        <AboutHeroSectionEditor />
      </div>
    </div>
  );
}