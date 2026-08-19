"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/redux/features/auth/authSlice";
import { useSignOutMutation } from "@/lib/redux/features/auth/authApi";
import {
  LayoutDashboard,
  Calendar,
  Home,
  Info,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  Users,
  LogOut,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bookings", label: "Bookings", icon: Calendar },
];

// Home page sections
const homeItems = [
  { href: "/pages/home/hero", label: "Hero" },
  { href: "/pages/home/values", label: "Values" },
  { href: "/pages/home/services", label: "Service Cards" },
  { href: "/pages/home/clients", label: "Clients" },
  { href: "/pages/home/faq", label: "FAQ Header" },
  { href: "/pages/home/cta", label: "CTA" },
];

// About page sections
const aboutItems = [
  { href: "/pages/about/hero", label: "Hero" },
  { href: "/pages/about/foundation", label: "Foundation" },
  { href: "/pages/about/tagline", label: "Tagline" },
  { href: "/pages/about/team", label: "Team" },
];

const serviceItems = [
  { href: "/pages/services/moving", label: "Moving" },
  { href: "/pages/services/repair", label: "Repair" },
  { href: "/pages/services/cleaning", label: "Cleaning" },
  { href: "/pages/services/laundry", label: "Laundry" },
];

// Bottom navigation items
const bottomItems = [
  { href: "/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/legal", label: "Legal pages", icon: ShieldCheck },
  { href: "/users", label: "Users", icon: Users },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [signOut, { isLoading: isLoggingOut }] = useSignOutMutation();

  // Home page dropdown
  const [homeOpen, setHomeOpen] = useState(
    pathname.startsWith("/pages/home")
  );

  // About page dropdown
  const [aboutOpen, setAboutOpen] = useState(
    pathname.startsWith("/pages/about")
  );

  const handleLogout = async () => {
    try {
      await signOut().unwrap();
    } catch (err) {
      console.error(
        "Sign out API error (proceeding with local cleanup):",
        err
      );
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };

  const linkClass = (href) =>
    `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm ${
      pathname === href
        ? "bg-blue-500/10 text-blue-400"
        : "text-neutral-400 hover:text-neutral-200"
    }`;

  const subLinkClass = (href) =>
    `text-xs py-1 ${
      pathname === href
        ? "text-blue-400"
        : "text-neutral-500 hover:text-neutral-300"
    }`;

  return (
    <aside className="w-52 bg-neutral-950 border-r border-neutral-800 flex flex-col p-4 h-screen sticky top-0 overflow-y-auto">
      <p className="font-medium text-[15px] text-white mb-5">
        Cmetayer admin
      </p>

      <nav className="flex flex-col gap-0.5">
        {/* Dashboard & Bookings */}
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClass(item.href)}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}

        {/* Home page — expandable dropdown */}
        <button
          type="button"
          onClick={() => setHomeOpen((prev) => !prev)}
          className="flex items-center justify-between gap-2.5 px-2.5 py-2 text-sm text-neutral-400 hover:text-neutral-200 cursor-pointer w-full"
        >
          <span className="flex items-center gap-2.5">
            <Home size={16} />
            Home page
          </span>

          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              homeOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {homeOpen && (
          <div className="flex flex-col gap-0.5 pl-9 mb-1">
            {homeItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={subLinkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* About page — expandable dropdown */}
        <button
          type="button"
          onClick={() => setAboutOpen((prev) => !prev)}
          className="flex items-center justify-between gap-2.5 px-2.5 py-2 text-sm text-neutral-400 hover:text-neutral-200 cursor-pointer w-full"
        >
          <span className="flex items-center gap-2.5">
            <Info size={16} />
            About page
          </span>

          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              aboutOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {aboutOpen && (
          <div className="flex flex-col gap-0.5 pl-9 mb-1">
            {aboutItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={subLinkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Services — always expanded */}
        <p className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-neutral-400">
          <Briefcase size={16} />
          Services
        </p>

        <div className="flex flex-col gap-0.5 pl-9">
          {serviceItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={subLinkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Bottom navigation */}
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClass(item.href)}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 text-[11px] flex items-center justify-center">
            {user?.full_name?.[0] || "A"}
          </div>

          <span className="text-sm text-neutral-400 truncate">
            {user?.full_name}
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-neutral-400 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <LogOut size={16} />

          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </aside>
  );
}