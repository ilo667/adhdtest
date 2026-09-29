"use client";
import Image from "next/image";
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
      className="flex items-center space-x-1.5 font-medium text-[16px] leading-[1.5] text-[#1c2d3f] transition-colors"
    >
      <Image src="/sign-out.svg" alt="" width={20} height={20} aria-hidden />
      Sign out
    </button>
  );
}
