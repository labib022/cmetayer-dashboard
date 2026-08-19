// app/(dashboard)/pages/about/team/page.jsx
import AboutTeamSectionEditor from "@/components/forms/AboutTeamSectionEditor";

export default function AboutTeamPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-white">About page — Team Section</h1>
      </div>
      <div className="border border-neutral-800 rounded-lg p-5">
        <AboutTeamSectionEditor />
      </div>
    </div>
  );
}