import MovingHeroSectionEditor from "@/components/forms/MovingHeroSectionEditor";
import MovingDetailSectionEditor from "@/components/forms/MovingDetailSectionEditor";

export default function MovingServicePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-white">Moving Service Page</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Edit the hero banner and service detail sections.
        </p>
      </div>

      <div className="border border-neutral-800 rounded-lg p-5">
        <h2 className="text-base font-medium text-white mb-4">Hero Section</h2>
        <MovingHeroSectionEditor />
      </div>

      <div className="border border-neutral-800 rounded-lg p-5">
        <h2 className="text-base font-medium text-white mb-4">Service Detail Section</h2>
        <MovingDetailSectionEditor />
      </div>
    </div>
  );
}