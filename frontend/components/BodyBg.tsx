"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LIGHT_BG_PATHS = ["/", "/login", "/register"];

export function BodyBg() {
  const pathname = usePathname();
  useEffect(() => {
    document.body.style.backgroundColor = LIGHT_BG_PATHS.includes(pathname)
      ? "#F7F8FA"
      : "#ffffff";
  }, [pathname]);
  return null;
}
