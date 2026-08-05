"use client";

import { useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/lib/redux/features/users/usersApi";
import { useSelector } from "react-redux";

export default function UsersPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetAllUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [search, setSearch] = useState("");

  const users = data?.users || [];

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";

    if (targetUser._id === currentUser?.id) {
      alert("You cannot change your own role.");
      return;
    }

    if (!confirm(`Change ${targetUser.full_name}'s role to "${newRole}"?`)) return;

    try {
      await updateUserRole({ id: targetUser._id, role: newRole }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to update role");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-white">Users</h1>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56 bg-neutral-800 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white outline-none focus:border-neutral-500"
        />
      </div>

      <div className="bg-neutral-800/50 border border-neutral-800 rounded-lg p-5">
        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading users...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-neutral-500">No users found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-neutral-800">
                <th className="font-normal py-2">Name</th>
                <th className="font-normal py-2">Email</th>
                <th className="font-normal py-2">Role</th>
                <th className="font-normal py-2">Joined</th>
                <th className="font-normal py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-b border-neutral-800 last:border-0">
                  <td className="py-2.5 text-white">{u.full_name}</td>
                  <td className="py-2.5 text-neutral-400">{u.email}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${
                        u.role === "admin"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-neutral-700 text-neutral-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 text-neutral-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleRoleToggle(u)}
                      disabled={u._id === currentUser?.id}
                      className="text-xs text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {u.role === "admin" ? "Remove admin" : "Make admin"}
                    </button>
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