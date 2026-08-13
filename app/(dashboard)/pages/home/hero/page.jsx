import HeroSectionEditor from "@/components/forms/HeroSectionEditor";

export default function HomeHeroPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Home page — Hero Section</h1>
        <p className="text-sm text-neutral-500 mt-1">
          The top banner: headline, subtitle, and stats.
        </p>
      </div>

      <div className="border border-neutral-800 rounded-lg p-5">
        <HeroSectionEditor />
      </div>
    </div>
  );
}