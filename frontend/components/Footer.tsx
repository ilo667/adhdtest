"use client";

import { usePathname } from "next/navigation";
import { BrainsMateLogo } from "./BrainsMateLogo";

const FOOTER_PATHS = ["/report"];

export function Footer() {
  const pathname = usePathname();
  if (!FOOTER_PATHS.includes(pathname)) return null;
  return (
    <footer className="bg-[#04182c] px-6 py-8 mt-auto">
      <div className="max-w-2xl mx-auto">
        <BrainsMateLogo white />
        <p className="text-gray-400 text-xs mt-3">All rights reserved 2026</p>
      </div>
    </footer>
  );
}