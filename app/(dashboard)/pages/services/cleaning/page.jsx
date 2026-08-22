import CleaningHeroSectionEditor from "@/components/forms/CleaningHeroSectionEditor";
import CleaningDetailSectionEditor from "@/components/forms/CleaningDetailSectionEditor";

export default function CleaningServicePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-white">Cleaning Service Page</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Edit the hero banner and service detail sections.
        </p>
      </div>

      <div className="border border-neutral-800 rounded-lg p-5">
        <h2 className="text-base font-medium text-white mb-4">Hero Section</h2>
        <CleaningHeroSectionEditor />
      </div>

      <div className="border border-neutral-800 rounded-lg p-5">
        <h2 className="text-base font-medium text-white mb-4">Service Detail Section</h2>
        <CleaningDetailSectionEditor />
      </div>
    </div>
  );
}