"use client";

import { useRef, useState } from "react";
import { useUploadCmsImageMutation } from "@/lib/redux/features/cms/cmsApi";

const SERVER_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8123/api").replace(
    /\/api\/?$/,
    ""
);

function resolveUrl(path) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${SERVER_BASE_URL}${path}`;
}

export default function ImageUploadField({ label, value, onChange, placeholder }) {
    const fileInputRef = useRef(null);
    const [uploadCmsImage, { isLoading }] = useUploadCmsImageMutation();
    const [error, setError] = useState("");

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        try {
            const res = await uploadCmsImage(file).unwrap();
            onChange(res.url);
        } catch (err) {
            setError(err?.data?.message || "Upload failed. Try again.");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400">{label}</label>

            <div className="flex items-center gap-3">
                <div className="size-14 rounded-md border border-neutral-700 bg-neutral-900 flex items-center justify-center overflow-hidden shrink-0">
                    {value ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={resolveUrl(value)} alt="" className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-[10px] text-neutral-600 text-center px-1">
                            {placeholder || "No image"}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50 cursor-pointer w-fit"
                    >
                        {isLoading ? "Uploading..." : value ? "Change" : "Upload"}
                    </button>
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="text-xs text-neutral-500 hover:text-red-400 cursor-pointer w-fit"
                        >
                            Reset to default
                        </button>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}