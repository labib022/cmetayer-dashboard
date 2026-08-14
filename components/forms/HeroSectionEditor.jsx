"use client";

import { useState, useEffect } from "react";
import { useGetCmsPageQuery, useSaveCmsPageMutation } from "@/lib/redux/features/cms/cmsApi";

// Site-এ এখন hardcoded যা আছে, সেটাই default — CMS-এ কোনো data সেভ না থাকলে
// dashboard-এ এই একই copy প্রি-ফিল দেখাবে, প্রথমবার Save করলেই CMS record তৈরি হবে
const DEFAULTS = {
    title_line1: "One Call.",
    title_line2: "One Company.",
    subtitle:
        "Book trusted moving, cleaning, repair, and laundry services instantly. We manage your home so you don't have to.",
    stats: [
        { value: "100M", label: "Happy customers" },
        { value: "99%", label: "Client happiness" },
        { value: "100+", label: "Team members" },
    ],
};

export default function HeroSectionEditor() {
    const { data, isLoading, isError, refetch } = useGetCmsPageQuery({
        page_name: "home",
        section_name: "hero",
    });
    const [saveCmsPage, { isLoading: isSaving }] = useSaveCmsPageMutation();

    const [form, setForm] = useState(DEFAULTS);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const existing = data?.data?.[0]?.content;
        if (existing) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                title_line1: existing.title_line1 ?? DEFAULTS.title_line1,
                title_line2: existing.title_line2 ?? DEFAULTS.title_line2,
                subtitle: existing.subtitle ?? DEFAULTS.subtitle,
                stats:
                    Array.isArray(existing.stats) && existing.stats.length === 3
                        ? existing.stats
                        : DEFAULTS.stats,
            });
        }
    }, [data]);

    const handleStatChange = (index, field, value) => {
        setForm((prev) => {
            const stats = [...prev.stats];
            stats[index] = { ...stats[index], [field]: value };
            return { ...prev, stats };
        });
    };

    const handleSave = async () => {
        setFeedback(null);
        try {
            await saveCmsPage({
                page_name: "home",
                section_name: "hero",
                content: form,
            }).unwrap();
            setFeedback({ type: "success", text: "Hero section saved. Live on the site now." });
        } catch (err) {
            setFeedback({
                type: "error",
                text: err?.data?.message || "Failed to save. Please try again.",
            });
        }
    };

    if (isLoading) {
        return <div className="text-neutral-400 text-sm">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="flex flex-col gap-3">
                <p className="text-red-400 text-sm">Couldn&apos;t load this section.</p>
                <button
                    onClick={refetch}
                    className="text-sm text-blue-400 hover:text-blue-300 w-fit cursor-pointer"
                >
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

            {/* Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-300">Title — Line 1</label>
                    <input
                        type="text"
                        value={form.title_line1}
                        onChange={(e) => setForm((p) => ({ ...p, title_line1: e.target.value }))}
                        className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-300">Title — Line 2</label>
                    <input
                        type="text"
                        value={form.title_line2}
                        onChange={(e) => setForm((p) => ({ ...p, title_line2: e.target.value }))}
                        className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Subtitle */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">Subtitle</label>
                <textarea
                    rows={3}
                    value={form.subtitle}
                    onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                    className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 resize-none"
                />
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-neutral-300">Stats</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {form.stats.map((stat, i) => (
                        <div key={i} className="flex flex-col gap-2 border border-neutral-800 rounded-md p-3">
                            <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => handleStatChange(i, "value", e.target.value)}
                                placeholder="Value (e.g. 100M)"
                                className="bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-2 text-sm text-white outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => handleStatChange(i, "label", e.target.value)}
                                placeholder="Label (e.g. Happy customers)"
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