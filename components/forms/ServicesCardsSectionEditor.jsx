"use client";

import { useState, useEffect } from "react";
import { useGetCmsPageQuery, useSaveCmsPageMutation } from "@/lib/redux/features/cms/cmsApi";
import ImageUploadField from "./ImageUploadField";

const DEFAULTS = {
  label: "Our Services",
  heading: "Comprehensive Home Services You Can Count On",
  description:
    "Choose a service from the list below to get an instant quote or make a reservation immediately!",
  services: [
    { title: "Moving & Packing", description: "Stress-free local and long-distance moving with professional packing.", image: "", icon: "" },
    { title: "Home Cleaning", description: "Deep cleans, move-in/out, and recurring maid services.", image: "", icon: "" },
    { title: "Handyman & Repair", description: "Plumbing, electrical, assembly, and general home repairs.", image: "", icon: "" },
    { title: "Laundry & Dry Cleaning", description: "Wash & fold delivery service right to your doorstep.", image: "", icon: "" },
  ],
};

export default function ServicesCardsSectionEditor() {
  const { data, isLoading, isError, refetch } = useGetCmsPageQuery({
    page_name: "home",
    section_name: "services_cards",
  });
  const [saveCmsPage, { isLoading: isSaving }] = useSaveCmsPageMutation();

  const [form, setForm] = useState(DEFAULTS);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const existing = data?.data?.[0]?.content;
    if (existing) {
      setForm({
        label: existing.label ?? DEFAULTS.label,
        heading: existing.heading ?? DEFAULTS.heading,
        description: existing.description ?? DEFAULTS.description,
        services:
          Array.isArray(existing.services) && existing.services.length === 4
            ? existing.services.map((s, i) => ({ image: "", icon: "", ...DEFAULTS.services[i], ...s }))
            : DEFAULTS.services,
      });
    }
  }, [data]);

  const handleServiceChange = (index, field, val) => {
    setForm((prev) => {
      const services = [...prev.services];
      services[index] = { ...services[index], [field]: val };
      return { ...prev, services };
    });
  };

  const handleSave = async () => {
    setFeedback(null);
    try {
      await saveCmsPage({ page_name: "home", section_name: "services_cards", content: form }).unwrap();
      setFeedback({ type: "success", text: "Services section saved. Live on the site now." });
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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-300">Heading</label>
        <input
          type="text"
          value={form.heading}
          onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
        />
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
        <label className="text-sm font-medium text-neutral-300">Service Cards</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {form.services.map((s, i) => (
            <div key={i} className="flex flex-col gap-3 border border-neutral-800 rounded-md p-3">
              <ImageUploadField
                label="Photo (optional — leave empty for default)"
                value={s.image}
                onChange={(url) => handleServiceChange(i, "image", url)}
                placeholder="Default"
              />
              <ImageUploadField
                label="Icon (optional — leave empty for default)"
                value={s.icon}
                onChange={(url) => handleServiceChange(i, "icon", url)}
                placeholder="Default"
              />
              <input
                type="text"
                value={s.title}
                onChange={(e) => handleServiceChange(i, "title", e.target.value)}
                placeholder="Service title"
                className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
              <textarea
                rows={2}
                value={s.description}
                onChange={(e) => handleServiceChange(i, "description", e.target.value)}
                placeholder="Service description"
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