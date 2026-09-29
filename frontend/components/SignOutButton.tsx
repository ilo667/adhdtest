"use client";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function SignOutButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname !== "/report") return null;

  async function handleLogout() {
    await api.logout().catch(() => {});
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-1.5 text-sm text-gray-500 hover:text-[#04182c] transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Sign out
    </button>
  );
}
