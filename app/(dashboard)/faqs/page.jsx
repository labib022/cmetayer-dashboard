"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "@/lib/redux/features/faqs/faqsApi";

export default function FaqsPage() {
  const { data, isLoading } = useGetFaqsQuery();
  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const faqs = data?.data || [];

  const [editingId, setEditingId] = useState(null); // null = কেউ edit করছে না, "new" = নতুন ফর্ম
  const [form, setForm] = useState({ question: "", answer: "", order: 0 });

  const startNew = () => {
    setForm({ question: "", answer: "", order: faqs.length + 1 });
    setEditingId("new");
  };

  const startEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer, order: faq.order });
    setEditingId(faq._id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ question: "", answer: "", order: 0 });
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      alert("Question and answer are required");
      return;
    }

    try {
      if (editingId === "new") {
        await createFaq(form).unwrap();
      } else {
        await updateFaq({ id: editingId, ...form }).unwrap();
      }
      cancelEdit();
    } catch (err) {
      alert(err?.data?.message || "Failed to save FAQ");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await deleteFaq(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to delete FAQ");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-white">FAQs</h1>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 bg-white text-black text-sm px-3.5 py-2 rounded-md"
        >
          <Plus size={14} />
          Add FAQ
        </button>
      </div>

      {editingId === "new" && (
        <FaqForm form={form} setForm={setForm} onSave={handleSave} onCancel={cancelEdit} />
      )}

      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading FAQs...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {faqs.map((faq) =>
            editingId === faq._id ? (
              <FaqForm
                key={faq._id}
                form={form}
                setForm={setForm}
                onSave={handleSave}
                onCancel={cancelEdit}
              />
            ) : (
              <div
                key={faq._id}
                className="bg-neutral-800/50 border border-neutral-800 rounded-md px-3.5 py-3 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-white mb-1">{faq.question}</p>
                  <p className="text-sm text-neutral-400">{faq.answer}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => startEdit(faq)}
                    className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="p-1.5 rounded-md text-neutral-400 hover:text-red-400 hover:bg-neutral-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function FaqForm({ form, setForm, onSave, onCancel }) {
  return (
    <div className="bg-neutral-800/50 border border-neutral-700 rounded-md p-3.5 flex flex-col gap-2.5">
      <input
        type="text"
        placeholder="Question"
        value={form.question}
        onChange={(e) => setForm({ ...form, question: e.target.value })}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-neutral-500"
      />
      <textarea
        placeholder="Answer"
        rows={2}
        value={form.answer}
        onChange={(e) => setForm({ ...form, answer: e.target.value })}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-neutral-500 resize-y"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="text-sm text-neutral-400 px-3 py-1.5 rounded-md hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="bg-white text-black text-sm px-3.5 py-1.5 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
}