import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { dashboardPathForRole } from "@/lib/profiles";
import { NavbarAuthActions } from "./navbar-auth-actions";

const navLinkClass =
  "text-sm text-app-muted transition-colors hover:text-app-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm";

export async function Navbar() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // fetch profile role to compute dashboard path
  let dashboardHref = "/";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    dashboardHref = dashboardPathForRole(profile?.role);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-app bg-app-card-75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--primary-700)] text-xs font-bold tracking-tight text-white shadow-lg shadow-primary"
            aria-hidden
          >
            DS
          </span>
          <span className="truncate text-lg font-semibold tracking-tight text-app-foreground">
            Dev<span className="text-primary">Solve</span>
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
          <NavbarAuthActions isLoggedIn={Boolean(user)} dashboardHref={dashboardHref} />
        </div>
      </div>
    </header>
  );
}
