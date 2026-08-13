import HeroSectionEditor from "@/components/forms/HeroSectionEditor";

export default function HomePageEditor() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-white">Home page</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Edit content sections for the customer-facing home page.
        </p>
      </div>

      <div className="border border-neutral-800 rounded-lg p-5">
        <h2 className="text-base font-medium text-white mb-4">Hero Section</h2>
        <HeroSectionEditor />
      </div>

      {/* বাকি Home page sections (Values, Services, Clients, FAQ, CTA) পরবর্তী ধাপে এখানে যোগ হবে */}
    </div>
  );
}