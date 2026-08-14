"use client";

import { useState, useEffect } from "react";
import { useGetCmsPageQuery, useSaveCmsPageMutation } from "@/lib/redux/features/cms/cmsApi";
import ImageUploadField from "./ImageUploadField";

const DEFAULTS = {
  label: "Our Values",
  heading_line1: "Why Choose",
  heading_line2: "EASY LIFT & CLEAN",
  description: "Our values guide how we work, clean, and care for every home we serve.",
  values: [
    { title: "Attention to Detail", description: "We clean thoroughly, focusing on the small details that make a big difference.", icon: "" },
    { title: "Reliable Professionals", description: "Our trained cleaners arrive on time and treat every home with care.", icon: "" },
    { title: "Safe & Eco-Friendly", description: "We use safe cleaning products that are gentle on your family and the environment.", icon: "" },
    { title: "Customer-First Service", description: "Your comfort and satisfaction are always our top priority.", icon: "" },
  ],
};

export default function ValuesSectionEditor() {
  const { data, isLoading, isError, refetch } = useGetCmsPageQuery({
    page_name: "home",
    section_name: "values",
  });
  const [saveCmsPage, { isLoading: isSaving }] = useSaveCmsPageMutation();

  const [form, setForm] = useState(DEFAULTS);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const existing = data?.data?.[0]?.content;
    if (existing) {
      setForm({
        label: existing.label ?? DEFAULTS.label,
        heading_line1: existing.heading_line1 ?? DEFAULTS.heading_line1,
        heading_line2: existing.heading_line2 ?? DEFAULTS.heading_line2,
        description: existing.description ?? DEFAULTS.description,
        values:
          Array.isArray(existing.values) && existing.values.length === 4
            ? existing.values.map((v, i) => ({ icon: "", ...DEFAULTS.values[i], ...v }))
            : DEFAULTS.values,
      });
    }
  }, [data]);

  const handleValueChange = (index, field, val) => {
    setForm((prev) => {
      const values = [...prev.values];
      values[index] = { ...values[index], [field]: val };
      return { ...prev, values };
    });
  };

  const handleSave = async () => {
    setFeedback(null);
    try {
      await saveCmsPage({ page_name: "home", section_name: "values", content: form }).unwrap();
      setFeedback({ type: "success", text: "Values section saved. Live on the site now." });
    } catch (err) {
      setFeedback({ type: "error", text: err?.data?.message || "Failed to save. Please try again." });
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
        <p
          className={`text-sm px-3 py-2 rounded-md border ${feedback.type === "success"
            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            : "text-red-400 bg-red-500/10 border-red-500/20"
            }`}
        >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-300">Heading — Line 1</label>
          <input
            type="text"
            value={form.heading_line1}
            onChange={(e) => setForm((p) => ({ ...p, heading_line1: e.target.value }))}
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-300">Heading — Line 2 (brand)</label>
          <input
            type="text"
            value={form.heading_line2}
            onChange={(e) => setForm((p) => ({ ...p, heading_line2: e.target.value }))}
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
        <label className="text-sm font-medium text-neutral-300">Value Cards</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {form.values.map((v, i) => (
            <div key={i} className="flex flex-col gap-3 border border-neutral-800 rounded-md p-3">
              <ImageUploadField
                label="Icon (optional — leave empty for default design icon)"
                value={v.icon}
                onChange={(url) => handleValueChange(i, "icon", url)}
                placeholder="Default"
              />
              <input
                type="text"
                value={v.title}
                onChange={(e) => handleValueChange(i, "title", e.target.value)}
                placeholder="Value title"
                className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
              <textarea
                rows={2}
                value={v.description}
                onChange={(e) => handleValueChange(i, "description", e.target.value)}
                placeholder="Value description"
                className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500 resize-none"
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