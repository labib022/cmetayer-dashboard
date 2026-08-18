import CtaSectionEditor from "@/components/forms/CtaSectionEditor";

export default function HomeCtaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Home page — CTA Section</h1>
        <p className="text-sm text-neutral-500 mt-1">
          The &quot;Get a Quote&quot; form section (header text only — the form fields themselves are fixed).
        </p>
      </div>

      <div className="border border-neutral-800 rounded-lg p-5">
        <CtaSectionEditor />
      </div>
    </div>
  );
}