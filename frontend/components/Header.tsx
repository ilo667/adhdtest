import { type ReactNode } from "react";
import { BrainsMateLogo } from "./BrainsMateLogo";

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
      <BrainsMateLogo />
      {children}
    </header>
  );
}