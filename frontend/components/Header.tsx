import { BrainsMateLogo } from "./BrainsMateLogo";
import { SignOutButton } from "./SignOutButton";

export function Header() {
  return (
    <header className="p-[8px] sm:px-[70px] sm:py-[27px] flex items-center justify-between">
      <BrainsMateLogo />
      <SignOutButton />
    </header>
  );
}