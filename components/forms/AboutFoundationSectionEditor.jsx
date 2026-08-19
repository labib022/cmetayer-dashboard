"use client";

import { useState, useEffect } from "react";
import { useGetCmsPageQuery, useSaveCmsPageMutation } from "@/lib/redux/features/cms/cmsApi";
import ImageUploadField from "./ImageUploadField";

const DEFAULTS = {
  card_title: "Our Foundation",
  card_description: "A mission-driven cleaning company focused on trust, reliability, and care for every home we serve.",
  based_in: "Canada & USA",
  founded: "2017",
  working_hours: "Monday – Saturday, 08.00 AM – 06.00 PM",
  center_image: "",
  vision_title: "Our Vision",
  vision_description: "To redefine home care through exceptional service, innovative technology, and genuine care.",
  mission_title: "Our Mission",
  mission_description: "To deliver consistent, high-quality cleaning and home services that improve our clients' daily lives while upholding environmental responsibility.",
};

export default function AboutFoundationSectionEditor() {
  const { data, isLoading, isError, refetch } = useGetCmsPageQuery({
    page_name: "about_us",
    section_name: "foundation",
  });
  const [saveCmsPage, { isLoading: isSaving }] = useSaveCmsPageMutation();
  const [form, setForm] = useState(DEFAULTS);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const existing = data?.data?.[0]?.content;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (existing) setForm({ ...DEFAULTS, ...existing });
  }, [data]);

  const handleSave = async () => {
    setFeedback(null);
    try {
      await saveCmsPage({ page_name: "about_us", section_name: "foundation", content: form }).unwrap();
      setFeedback({ type: "success", text: "Saved. Live on the site now." });
    } catch (err) {
      setFeedback({ type: "error", text: err?.data?.message || "Failed to save." });
    }
  };

  if (isLoading) return <div className="text-neutral-400 text-sm">Loading...</div>;
  if (isError) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-red-400 text-sm">Couldn&apos;t load this section.</p>
        <button onClick={refetch} className="text-sm text-blue-400 hover:text-blue-300 w-fit cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  const field = (key, label, isTextarea = false) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-300">{label}</label>
      {isTextarea ? (
        <textarea
          rows={2}
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 resize-none"
        />
      ) : (
        <input
          type="text"
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {feedback && (
        <p className={`text-sm px-3 py-2 rounded-md border ${feedback.type === "success" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>
          {feedback.text}
        </p>
      )}

      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Card 1 — Our Foundation</p>
      {field("card_title", "Title")}
      {field("card_description", "Description", true)}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("based_in", "Based In")}
        {field("founded", "Founded (year)")}
      </div>
      {field("working_hours", "Working Hours")}

      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mt-2">Card 2 — Center Photo</p>
      <ImageUploadField
        label="Photo (optional — leave empty for default)"
        value={form.center_image}
        onChange={(url) => setForm((p) => ({ ...p, center_image: url }))}
        placeholder="Default"
      />

      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mt-2">Card 3 — Vision & Mission</p>
      {field("vision_title", "Vision Title")}
      {field("vision_description", "Vision Description", true)}
      {field("mission_title", "Mission Title")}
      {field("mission_description", "Mission Description", true)}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-2 bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer text-white rounded-md py-2.5 text-sm font-semibold disabled:opacity-50 w-fit px-6"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}