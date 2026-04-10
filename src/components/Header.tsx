import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

export default function Header({ username }: { username: string | null }) {
  const clearUsername = () => {
    Cookies.remove("chozha_username");
    window.location.href = "/";
  };

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        
<Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
  
  <div className="relative h-8 w-8 overflow-hidden rounded-md flex-shrink-0">
    <Image
      src="/icon.png"
      alt="Chozha logo"
      fill
      className="object-contain"
    />
  </div>

  <div className="flex flex-col leading-tight text-left">
    <p className="font-catamaran text-xs text-stone-400">Project</p>

    <h1 className="font-catamaran font-bold text-lg text-stone-800">
      சோழா
    </h1>
  </div>

</Link>

        <div className="flex items-center gap-3">
          {username && (
            <>
              <span className="text-xs text-stone-500">@{username}</span>
              <Button size="sm" variant="ghost" onClick={clearUsername}>
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}