"use client";

import { useState, useEffect } from "react";
import {
  useGetLegalPageQuery,
  useUpdateLegalPageMutation,
} from "@/lib/redux/features/legal/legalApi";

export default function LegalPage() {
  const [activeType, setActiveType] = useState("privacy");
  const { data, isLoading } = useGetLegalPageQuery(activeType);
  const [updateLegalPage, { isLoading: isSaving }] = useUpdateLegalPageMutation();

  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = data?.[0]?.content;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContent(existing || "");
    setSaved(false);
  }, [data]);

  const lastUpdated = data?.[0]?.last_updated;

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Content cannot be empty");
      return;
    }
    try {
      await updateLegalPage({ type: activeType, content }).unwrap();
      setSaved(true);
    } catch (err) {
      alert(err?.data?.message || "Failed to save");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-white">Legal pages</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white text-black text-sm px-4 py-2 rounded-md disabled:opacity-50"
        >
          {isSaving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveType("privacy")}
          className={`text-sm px-3.5 py-1.5 rounded-md ${
            activeType === "privacy"
              ? "bg-blue-500/10 text-blue-400"
              : "bg-neutral-800 text-neutral-400"
          }`}
        >
          Privacy policy
        </button>
        <button
          onClick={() => setActiveType("terms")}
          className={`text-sm px-3.5 py-1.5 rounded-md ${
            activeType === "terms"
              ? "bg-blue-500/10 text-blue-400"
              : "bg-neutral-800 text-neutral-400"
          }`}
        >
          Terms and conditions
        </button>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-800 rounded-lg p-5 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : (
          <>
            <div>
              <label className="text-sm text-neutral-400 block mb-1.5">Section content</label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setSaved(false);
                }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-neutral-500 resize-y"
              />
            </div>
            {lastUpdated && (
              <p className="text-xs text-neutral-500">
                Last updated {new Date(lastUpdated).toLocaleDateString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}