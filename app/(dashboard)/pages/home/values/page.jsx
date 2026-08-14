import ValuesSectionEditor from "@/components/forms/ValuesSectionEditor";

export default function HomeValuesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Home page — Values Section</h1>
        <p className="text-sm text-neutral-500 mt-1">
          The &quot;Why Choose Us&quot; grid with 4 value cards.
        </p>
      </div>

      <div className="border border-neutral-800 rounded-lg p-5">
        <ValuesSectionEditor />
      </div>
    </div>
  );
}