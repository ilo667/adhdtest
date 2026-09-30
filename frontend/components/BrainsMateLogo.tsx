import Image from "next/image";
import Link from "next/link";

export function BrainsMateLogo({ white = false, className = "w-[133px] sm:w-[184px]" }: { white?: boolean; className?: string }) {
  return (
    <Link href="/">
      <Image
        src={white ? "/brainsmate-logo-white.png" : "/brainsmate-logo.png"}
        alt="BrainsMate"
        width={184}
        height={34}
        quality={100}
        priority
        className={className}
      />
    </Link>
  );
}