import ClientsSectionEditor from "@/components/forms/ClientsSectionEditor";

export default function HomeClientsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-semibold text-white">Home page — Clients Section</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    The auto-scrolling row of client stat cards and photos.
                </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-5">
                <ClientsSectionEditor />
            </div>
        </div>
    );
}