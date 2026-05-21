import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NavbarAuthActions } from "./navbar-auth-actions";

const navLinkClass =
  "text-sm text-zinc-400 transition-colors hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 rounded-sm";

export async function Navbar() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-xs font-bold tracking-tight text-white shadow-lg shadow-indigo-500/35"
            aria-hidden
          >
            DS
          </span>
          <span className="truncate text-lg font-semibold tracking-tight text-zinc-100">
            Dev<span className="text-indigo-400">Solve</span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-3 sm:gap-8" aria-label="Principal">
            <Link href="/marketplace" className={navLinkClass}>
              Marketplace
            </Link>
            <Link href="/bounties" className={navLinkClass}>
              Bounties
            </Link>
          </nav>
          <NavbarAuthActions isLoggedIn={Boolean(user)} />
        </div>
      </div>
    </header>
  );
}
