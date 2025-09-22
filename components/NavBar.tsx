"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/SignOutButton"; // <-- import

const links = [
  { href: "/", label: "Home" },
  { href: "/quiz", label: "Quiz" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-700 text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold tracking-wide">AptiPilot</span>
        <ul className="flex space-x-4 items-center">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded px-3 py-2 hover:bg-blue-600 ${
                    active ? "bg-blue-600" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <SignOutButton />
          </li>
        </ul>
      </div>
    </nav>
  );
}
