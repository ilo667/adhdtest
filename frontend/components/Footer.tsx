import { BrainsMateLogo } from "./BrainsMateLogo";

export function Footer() {
  return (
    <footer className="bg-[#04182c] px-6 py-8 mt-auto">
      <div className="max-w-2xl mx-auto">
        <BrainsMateLogo white />
        <p className="text-gray-400 text-xs mt-3">All rights reserved 2026</p>
      </div>
    </footer>
  );
}