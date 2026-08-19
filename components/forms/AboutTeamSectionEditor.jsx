"use client";

import { useState, useEffect } from "react";
import { useGetCmsPageQuery, useSaveCmsPageMutation } from "@/lib/redux/features/cms/cmsApi";
import ImageUploadField from "./ImageUploadField";

const DEFAULTS = {
  label: "Our Team",
  heading_part1: "Meet the ",
  heading_accent: "Easy Lift & Clean",
  heading_part3: " Team",
  description: "A dedicated team of professionals working together to deliver reliable and thoughtful home cleaning services.",
  members: [
    { name: "Olivia Brooks", role: "Client Service Manager", image: "" },
    { name: "Emily Walker", role: "Home Repair Expert", image: "" },
    { name: "Liam Thompson", role: "General Maintenance Technician", image: "" },
    { name: "Aisha Rahman", role: "Home Cleaning Supervisor", image: "" },
  ],
};

export default function AboutTeamSectionEditor() {
  const { data, isLoading, isError, refetch } = useGetCmsPageQuery({
    page_name: "about_us",
    section_name: "team",
  });
  const [saveCmsPage, { isLoading: isSaving }] = useSaveCmsPageMutation();
  const [form, setForm] = useState(DEFAULTS);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const existing = data?.data?.[0]?.content;
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        label: existing.label ?? DEFAULTS.label,
        heading_part1: existing.heading_part1 ?? DEFAULTS.heading_part1,
        heading_accent: existing.heading_accent ?? DEFAULTS.heading_accent,
        heading_part3: existing.heading_part3 ?? DEFAULTS.heading_part3,
        description: existing.description ?? DEFAULTS.description,
        members:
          Array.isArray(existing.members) && existing.members.length === 4
            ? existing.members.map((m, i) => ({ image: "", ...DEFAULTS.members[i], ...m }))
            : DEFAULTS.members,
      });
    }
  }, [data]);

  const handleMemberChange = (index, key, val) => {
    setForm((prev) => {
      const members = [...prev.members];
      members[index] = { ...members[index], [key]: val };
      return { ...prev, members };
    });
  };

  const handleSave = async () => {
    setFeedback(null);
    try {
      await saveCmsPage({ page_name: "about_us", section_name: "team", content: form }).unwrap();
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

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {feedback && (
        <p className={`text-sm px-3 py-2 rounded-md border ${feedback.type === "success" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>
          {feedback.text}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-300">Small Label</label>
        <input
          type="text"
          value={form.label}
          onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-300">Heading — Before accent</label>
          <input
            type="text"
            value={form.heading_part1}
            onChange={(e) => setForm((p) => ({ ...p, heading_part1: e.target.value }))}
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-300">Heading — Accent</label>
          <input
            type="text"
            value={form.heading_accent}
            onChange={(e) => setForm((p) => ({ ...p, heading_accent: e.target.value }))}
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-300">Heading — After accent</label>
          <input
            type="text"
            value={form.heading_part3}
            onChange={(e) => setForm((p) => ({ ...p, heading_part3: e.target.value }))}
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-300">Description</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 resize-none"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-neutral-300">Team Members (4)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {form.members.map((m, i) => (
            <div key={i} className="flex flex-col gap-3 border border-neutral-800 rounded-md p-3">
              <ImageUploadField
                label="Photo (optional — leave empty for default)"
                value={m.image}
                onChange={(url) => handleMemberChange(i, "image", url)}
                placeholder="Default"
              />
              <input
                type="text"
                value={m.name}
                onChange={(e) => handleMemberChange(i, "name", e.target.value)}
                placeholder="Name"
                className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={m.role}
                onChange={(e) => handleMemberChange(i, "role", e.target.value)}
                placeholder="Role"
                className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

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