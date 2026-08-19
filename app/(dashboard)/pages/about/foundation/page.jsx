// app/(dashboard)/pages/about/foundation/page.jsx
import AboutFoundationSectionEditor from "@/components/forms/AboutFoundationSectionEditor";

export default function AboutFoundationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-white">About page — Foundation Section</h1>
      </div>
      <div className="border border-neutral-800 rounded-lg p-5">
        <AboutFoundationSectionEditor />
      </div>
    </div>
  );
}