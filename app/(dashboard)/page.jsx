"use client";

import { useGetDashboardStatsQuery } from "@/lib/redux/features/stats/statsApi";
import { useGetAllBookingsQuery } from "@/lib/redux/features/bookings/bookingsApi";
import { useSelector } from "react-redux";

function MetricCard({ label, value, highlight }) {
  return (
    <div
      className={`rounded-lg p-4 ${
        highlight ? "bg-green-500/10" : "bg-neutral-800"
      }`}
    >
      <p className={`text-sm mb-1.5 ${highlight ? "text-green-400" : "text-neutral-400"}`}>
        {label}
      </p>
      <p className={`text-2xl font-medium ${highlight ? "text-green-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-400",
    confirmed: "bg-blue-500/10 text-blue-400",
    completed: "bg-neutral-700 text-neutral-300",
    paid: "bg-green-500/10 text-green-400",
    cancelled: "bg-red-500/10 text-red-400",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-md ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

export default function DashboardHome() {
  const { user } = useSelector((state) => state.auth);
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: bookingsData, isLoading: bookingsLoading } = useGetAllBookingsQuery();

  const stats = statsData?.stats;
  const recentBookings = bookingsData?.bookings?.slice(0, 5) || [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-medium text-white">
          Welcome back, {user?.full_name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Here&apos;s what&apos;s happening with Cmetayer today.
        </p>
      </div>

      {statsLoading ? (
        <p className="text-sm text-neutral-500">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          <MetricCard label="Total bookings" value={stats?.totalBookings ?? 0} />
          <MetricCard label="Pending quotes" value={stats?.pendingQuotes ?? 0} />
          <MetricCard label="Registered users" value={stats?.totalUsers ?? 0} />
          <MetricCard
            label="Paid revenue"
            value={`$${stats?.paidRevenue ?? 0}`}
            highlight
          />
        </div>
      )}

      <div className="bg-neutral-800/50 border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-sm text-white">Recent bookings</p>
          <a href="/bookings" className="text-xs text-neutral-400 hover:text-white">
            View all
          </a>
        </div>

        {bookingsLoading ? (
          <p className="text-sm text-neutral-500">Loading bookings...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-neutral-800">
                <th className="font-normal py-2">Customer</th>
                <th className="font-normal py-2">Service</th>
                <th className="font-normal py-2">Status</th>
                <th className="font-normal py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-neutral-800 last:border-0">
                  <td className="py-2 text-white">{b.name}</td>
                  <td className="py-2 text-neutral-300 capitalize">{b.type.replace("_", " ")}</td>
                  <td className="py-2">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-2 text-right text-neutral-300">
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