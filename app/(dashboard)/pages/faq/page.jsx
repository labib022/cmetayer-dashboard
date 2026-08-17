import FaqHeaderSectionEditor from "@/components/forms/FaqHeaderSectionEditor";

export default function HomeFaqHeaderPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-semibold text-white">Home page — FAQ Section</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Header text and photos. The actual Q&amp;A list is managed on the FAQs page.
                </p>
            </div>

            <div className="border border-neutral-800 rounded-lg p-5">
                <FaqHeaderSectionEditor />
            </div>
        </div>
    );
}