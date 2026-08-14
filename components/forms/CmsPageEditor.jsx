"use client";

import { useState, useEffect } from "react";
import {
  useGetCmsPageQuery,
  useSaveCmsPageMutation,
} from "@/lib/redux/features/cms/cmsApi";

export default function CmsPageEditor({ pageName, pageTitle }) {
  const { data, isLoading } = useGetCmsPageQuery({ page_name: pageName });
  const [saveCmsPage, { isLoading: isSaving }] = useSaveCmsPageMutation();

  const [content, setContent] = useState({ title: "", description: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = data?.data?.[0]?.content;
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent(existing);
    }
  }, [data]);

  const handleChange = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      await saveCmsPage({ page_name: pageName, section_name: "default", content }).unwrap();
      setSaved(true);
    } catch (err) {
      alert(err?.data?.message || "Failed to save");
    }
  };

  if (isLoading) return <p className="text-sm text-neutral-500">Loading...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-white">{pageTitle}</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Edit the content shown on this page.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white text-black text-sm px-4 py-2 rounded-md disabled:opacity-50"
        >
          {isSaving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-800 rounded-lg p-5 flex flex-col gap-3.5">
        <div>
          <label className="text-sm text-neutral-400 block mb-1.5">Title</label>
          <input
            type="text"
            value={content.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-neutral-500"
          />
        </div>

        <div>
          <label className="text-sm text-neutral-400 block mb-1.5">Description</label>
          <textarea
            rows={3}
            value={content.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-neutral-500 resize-y"
          />
        </div>

        <div>
          <label className="text-sm text-neutral-400 block mb-1.5">Image URL</label>
          <input
            type="text"
            value={content.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-neutral-500"
          />
        </div>
      </div>
    </div>
  );
}