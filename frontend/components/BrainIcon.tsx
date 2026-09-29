import Image from "next/image";

export function BrainsMateLogo({ white = false }: { white?: boolean; size?: number }) {
  return (
    <Image
      src={white ? "/brainsmate-logo-white.png" : "/brainsmate-logo.png"}
      alt="BrainsMate"
      width={184}
      height={34}
      quality={100}
      priority
    />
  );
}
