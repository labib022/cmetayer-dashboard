"use client";

import { useState, useEffect } from "react";
import { useGetCmsPageQuery, useSaveCmsPageMutation } from "@/lib/redux/features/cms/cmsApi";
import ImageUploadField from "./ImageUploadField";

const DEFAULTS = {
    label: "FAQs",
    heading_part1: "Need ",
    heading_part2: "Help Before Booking",
    heading_part3: "?",
    description: "Find helpful answers to common questions about scheduling, services, and our cleaning team.",
    photos: [{ image: "" }, { image: "" }, { image: "" }],
};

export default function FaqHeaderSectionEditor() {
    const { data, isLoading, isError, refetch } = useGetCmsPageQuery({
        page_name: "home",
        section_name: "faq_header",
    });
    const [saveCmsPage, { isLoading: isSaving }] = useSaveCmsPageMutation();

    const [form, setForm] = useState(DEFAULTS);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const existing = data?.data?.[0]?.content;
        if (existing) {
            setForm({
                label: existing.label ?? DEFAULTS.label,
                heading_part1: existing.heading_part1 ?? DEFAULTS.heading_part1,
                heading_part2: existing.heading_part2 ?? DEFAULTS.heading_part2,
                heading_part3: existing.heading_part3 ?? DEFAULTS.heading_part3,
                description: existing.description ?? DEFAULTS.description,
                photos:
                    Array.isArray(existing.photos) && existing.photos.length === 3
                        ? existing.photos
                        : DEFAULTS.photos,
            });
        }
    }, [data]);

    const handlePhotoChange = (index, val) => {
        setForm((prev) => {
            const photos = [...prev.photos];
            photos[index] = { image: val };
            return { ...prev, photos };
        });
    };

    const handleSave = async () => {
        setFeedback(null);
        try {
            await saveCmsPage({ page_name: "home", section_name: "faq_header", content: form }).unwrap();
            setFeedback({ type: "success", text: "FAQ section header saved. Live on the site now." });
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

            <p className="text-xs text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2">
                এখানে শুধু হেডিং/ফটো — আসল প্রশ্ন-উত্তর যোগ/এডিট করতে Sidebar-এর <strong className="text-neutral-300">FAQs</strong> page ব্যবহার করো।
            </p>

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
                    <label className="text-sm font-medium text-neutral-300">Heading — Part 1</label>
                    <input
                        type="text"
                        value={form.heading_part1}
                        onChange={(e) => setForm((p) => ({ ...p, heading_part1: e.target.value }))}
                        className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-300">Heading — Part 2 (accent)</label>
                    <input
                        type="text"
                        value={form.heading_part2}
                        onChange={(e) => setForm((p) => ({ ...p, heading_part2: e.target.value }))}
                        className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-300">Heading — Part 3</label>
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
                <label className="text-sm font-medium text-neutral-300">Photos (3)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {form.photos.map((p, i) => (
                        <div key={i} className="border border-neutral-800 rounded-md p-3">
                            <ImageUploadField
                                label={`Photo ${i + 1} (optional — leave empty for default)`}
                                value={p.image}
                                onChange={(url) => handlePhotoChange(i, url)}
                                placeholder="Default"
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