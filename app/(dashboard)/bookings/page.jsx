"use client";

import { useState } from "react";
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} from "@/lib/redux/features/bookings/bookingsApi";

const STATUSES = ["all", "pending", "confirmed", "completed", "paid", "cancelled"];

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-400",
    confirmed: "bg-blue-500/10 text-blue-400",
    completed: "bg-neutral-700 text-neutral-300",
    paid: "bg-green-500/10 text-green-400",
    cancelled: "bg-red-500/10 text-red-400",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-md capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

export default function BookingsPage() {
  const { data, isLoading } = useGetAllBookingsQuery();
  const [updateStatus] = useUpdateBookingStatusMutation();
  const [filter, setFilter] = useState("all");

  const bookings = data?.bookings || [];
  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const handleStatusChange = async (booking, newStatus) => {
    // শুধু cleaning/laundry booking-এর status বদলানো যায়, quote request-এর না
    if (!["cleaning", "laundry"].includes(booking.type)) return;

    try {
      await updateStatus({ type: booking.type, id: booking.id, status: newStatus }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-white">Bookings</h1>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-md capitalize ${
                filter === s
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-neutral-800 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-800 rounded-lg p-5">
        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading bookings...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-neutral-500">No bookings found for this filter.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-neutral-800">
                <th className="font-normal py-2">Customer</th>
                <th className="font-normal py-2">Email</th>
                <th className="font-normal py-2">Service</th>
                <th className="font-normal py-2">Date</th>
                <th className="font-normal py-2">Status</th>
                <th className="font-normal py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-neutral-800 last:border-0">
                  <td className="py-2.5 text-white">{b.name}</td>
                  <td className="py-2.5 text-neutral-400">{b.email}</td>
                  <td className="py-2.5 text-neutral-300 capitalize">{b.type.replace("_", " ")}</td>
                  <td className="py-2.5 text-neutral-400">
                    {b.date ? new Date(b.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-2.5">
                    {["cleaning", "laundry"].includes(b.type) ? (
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b, e.target.value)}
                        className="bg-neutral-800 border border-neutral-700 rounded-md text-xs px-2 py-1 text-neutral-200 outline-none"
                      >
                        {STATUSES.filter((s) => s !== "all").map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge status={b.status} />
                    )}
                  </td>
                  <td className="py-2.5 text-right text-neutral-300">
                    {b.price !== null ? `$${b.price}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}