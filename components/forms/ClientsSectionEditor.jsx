"use client";

import { useState, useEffect } from "react";
import { useGetCmsPageQuery, useSaveCmsPageMutation } from "@/lib/redux/features/cms/cmsApi";
import ImageUploadField from "./ImageUploadField";

const DEFAULTS = {
    label: "Clients",
    heading_part1: "Trusted by ",
    heading_part2: "Home and Property Owners",
    description: "From family homes to rentals, clients choose for reliable, professional cleaning.",
    stats: [
        { logo: "", clientName: "Serenity Hills Residence", statNumber: "3+", title: "Years of Ongoing Service", description: "Weekly maintenance cleaning for a multi-story family home." },
        { logo: "", clientName: "Greenview Apartment", statNumber: "85+", title: "Move-Out Cleans Completed", description: "Fast, detailed turnover cleaning for rental unit transitions." },
        { logo: "", clientName: "UrbanStay Short-Term Rentals", statNumber: "200+", title: "Guest Turnovers Managed", description: "Reliable Airbnb cleaning ensuring consistent five-star readiness." },
    ],
    photos: [{ image: "" }, { image: "" }],
};

export default function ClientsSectionEditor() {
    const { data, isLoading, isError, refetch } = useGetCmsPageQuery({
        page_name: "home",
        section_name: "clients",
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
                description: existing.description ?? DEFAULTS.description,
                stats:
                    Array.isArray(existing.stats) && existing.stats.length === 3
                        ? existing.stats.map((s, i) => ({ logo: "", ...DEFAULTS.stats[i], ...s }))
                        : DEFAULTS.stats,
                photos:
                    Array.isArray(existing.photos) && existing.photos.length === 2
                        ? existing.photos
                        : DEFAULTS.photos,
            });
        }
    }, [data]);

    const handleStatChange = (index, field, val) => {
        setForm((prev) => {
            const stats = [...prev.stats];
            stats[index] = { ...stats[index], [field]: val };
            return { ...prev, stats };
        });
    };

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
            await saveCmsPage({ page_name: "home", section_name: "clients", content: form }).unwrap();
            setFeedback({ type: "success", text: "Clients section saved. Live on the site now." });
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
                    <label className="text-sm font-medium text-neutral-300">Heading — Part 1</label>
                    <input
                        type="text"
                        value={form.heading_part1}
                        onChange={(e) => setForm((p) => ({ ...p, heading_part1: e.target.value }))}
                        className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-300">Heading — Part 2</label>
                    <input
                        type="text"
                        value={form.heading_part2}
                        onChange={(e) => setForm((p) => ({ ...p, heading_part2: e.target.value }))}
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
                <label className="text-sm font-medium text-neutral-300">Stat Cards (3)</label>
                <div className="flex flex-col gap-4">
                    {form.stats.map((s, i) => (
                        <div key={i} className="flex flex-col gap-3 border border-neutral-800 rounded-md p-3">
                            <ImageUploadField
                                label="Client Logo (optional — leave empty for default)"
                                value={s.logo}
                                onChange={(url) => handleStatChange(i, "logo", url)}
                                placeholder="Default"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={s.clientName}
                                    onChange={(e) => handleStatChange(i, "clientName", e.target.value)}
                                    placeholder="Client name"
                                    className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    value={s.statNumber}
                                    onChange={(e) => handleStatChange(i, "statNumber", e.target.value)}
                                    placeholder="Stat number (e.g. 3+)"
                                    className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500"
                                />
                            </div>
                            <input
                                type="text"
                                value={s.title}
                                onChange={(e) => handleStatChange(i, "title", e.target.value)}
                                placeholder="Stat title"
                                className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500"
                            />
                            <textarea
                                rows={2}
                                value={s.description}
                                onChange={(e) => handleStatChange(i, "description", e.target.value)}
                                placeholder="Stat description"
                                className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500 resize-none"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-neutral-300">Photo Cards (2)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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