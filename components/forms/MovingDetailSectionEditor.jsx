"use client";

import { useState, useEffect } from "react";
import { useGetCmsPageQuery, useSaveCmsPageMutation } from "@/lib/redux/features/cms/cmsApi";
import ImageUploadField from "./ImageUploadField";

const DEFAULTS = {
  title: "Service Overview",
  description:
    "Our moving and packing services ensure a seamless relocation. Whether you're moving locally or nationally, our skilled team manages everything from packing to transportation. With Easy Lift & Clean, your belongings are safe with us. We use top-quality materials and techniques to protect your items. Let us handle the moving stress, so you can focus on your new home.",
  included_services: [
    "Professional packing with quality materials",
    "Careful loading and unloading",
    "Secure transportation in modern vehicles",
    "Furniture disassembly and reassembly",
    "Unpacking and setup in your new home",
  ],
  image: "",
  price_label: "Starting Rate",
  price_amount: "$75",
  price_unit: "/hr",
};

export default function MovingDetailSectionEditor() {
  const { data, isLoading, isError, refetch } = useGetCmsPageQuery({
    page_name: "moving",
    section_name: "detail",
  });
  const [saveCmsPage, { isLoading: isSaving }] = useSaveCmsPageMutation();
  const [form, setForm] = useState(DEFAULTS);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const existing = data?.data?.[0]?.content;
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        ...DEFAULTS,
        ...existing,
        included_services:
          Array.isArray(existing.included_services) && existing.included_services.length > 0
            ? existing.included_services
            : DEFAULTS.included_services,
      });
    }
  }, [data]);

  const handleServiceItemChange = (index, val) => {
    setForm((prev) => {
      const list = [...prev.included_services];
      list[index] = val;
      return { ...prev, included_services: list };
    });
  };

  const handleAddServiceItem = () => {
    setForm((prev) => ({ ...prev, included_services: [...prev.included_services, ""] }));
  };

  const handleRemoveServiceItem = (index) => {
    setForm((prev) => ({
      ...prev,
      included_services: prev.included_services.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setFeedback(null);
    const cleanedServices = form.included_services.map((s) => s.trim()).filter(Boolean);
    if (cleanedServices.length === 0) {
      setFeedback({ type: "error", text: "Add at least one included service." });
      return;
    }
    try {
      await saveCmsPage({
        page_name: "moving",
        section_name: "detail",
        content: { ...form, included_services: cleanedServices },
      }).unwrap();
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
        <label className="text-sm font-medium text-neutral-300">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-300">Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-300">Included Services</label>
        <div className="flex flex-col gap-2">
          {form.included_services.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleServiceItemChange(i, e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveServiceItem(i)}
                className="text-red-400 hover:text-red-300 text-xs font-medium cursor-pointer px-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddServiceItem}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer w-fit"
        >
          + Add item
        </button>
      </div>

      <ImageUploadField
        label="Featured Photo (optional — leave empty for default)"
        value={form.image}
        onChange={(url) => setForm((p) => ({ ...p, image: url }))}
        placeholder="Default"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-300">Price Label</label>
          <input
            type="text"
            value={form.price_label}
            onChange={(e) => setForm((p) => ({ ...p, price_label: e.target.value }))}
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-300">Price Amount</label>
          <input
            type="text"
            value={form.price_amount}
            onChange={(e) => setForm((p) => ({ ...p, price_amount: e.target.value }))}
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-300">Price Unit</label>
          <input
            type="text"
            value={form.price_unit}
            onChange={(e) => setForm((p) => ({ ...p, price_unit: e.target.value }))}
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />
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