import Image from "next/image";
import Link from "next/link";

export function BrainsMateLogo({ white = false }: { white?: boolean }) {
  return (
    <Link href="/">
      <Image
        src={white ? "/brainsmate-logo-white.png" : "/brainsmate-logo.png"}
        alt="BrainsMate"
        width={184}
        height={34}
        quality={100}
        priority
        className="w-[131px] sm:w-[184px]"
      />
    </Link>
  );
}