"use client";

import { useState, useEffect } from "react";
import { useGetCmsPageQuery, useSaveCmsPageMutation } from "@/lib/redux/features/cms/cmsApi";

const DEFAULTS = {
  label: "Get a Quote",
  heading_part1: "Looking for ",
  heading_accent: "Professional Home Management Services",
  heading_part3: "?",
  subtitle:
    "Request a free quote today and let our team create a cleaning plan tailored to your home or property needs.",
  form_subheading:
    "Tell us a bit about your home, and we'll guide you to the right cleaning solution.",
};

export default function CtaSectionEditor() {
  const { data, isLoading, isError, refetch } = useGetCmsPageQuery({
    page_name: "home",
    section_name: "cta",
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
        subtitle: existing.subtitle ?? DEFAULTS.subtitle,
        form_subheading: existing.form_subheading ?? DEFAULTS.form_subheading,
      });
    }
  }, [data]);

  const handleSave = async () => {
    setFeedback(null);
    try {
      await saveCmsPage({ page_name: "home", section_name: "cta", content: form }).unwrap();
      setFeedback({ type: "success", text: "CTA section saved. Live on the site now." });
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
          className={`text-sm px-3 py-2 rounded-md border ${
            feedback.type === "success"
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
          <label className="text-sm font-medium text-neutral-300">Heading — Accent (colored)</label>
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
        <label className="text-sm font-medium text-neutral-300">Subtitle (left column)</label>
        <textarea
          rows={2}
          value={form.subtitle}
          onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-300">Form Subheading (inside form card)</label>
        <textarea
          rows={2}
          value={form.form_subheading}
          onChange={(e) => setForm((p) => ({ ...p, form_subheading: e.target.value }))}
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 resize-none"
        />
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