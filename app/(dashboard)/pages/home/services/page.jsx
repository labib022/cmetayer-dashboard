import ServicesCardsSectionEditor from "@/components/forms/ServicesCardsSectionEditor";

export default function HomeServicesCardsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Home page — Services Cards Section</h1>
        <p className="text-sm text-neutral-500 mt-1">
          The scrollable row of 4 service cards.
        </p>
      </div>

      <div className="border border-neutral-800 rounded-lg p-5">
        <ServicesCardsSectionEditor />
      </div>
    </div>
  );
}