import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { isAdminEmail } from "@/lib/auth/admin";

function nextWithHeaders(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === "/" && searchParams.has("error_code")) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", "callback");
    const code = searchParams.get("error_code");
    if (code) url.searchParams.set("reason", code);
    const desc = searchParams.get("error_description");
    if (desc) url.searchParams.set("details", desc);
    return NextResponse.redirect(url);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return nextWithHeaders(request);
  }
  const supabaseResponse = nextWithHeaders(request);
  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname === "/auth/callback") {
    return supabaseResponse;
  }

  if (pathname.startsWith("/admin")) {
    // Server actions (POST with a Next-Action header) run in Node runtime and
    // perform their own admin check via getServiceRoleIfAdmin(). Don't redirect
    // them here — middleware runs in the Edge sandbox where supabase.auth.getUser()
    // can intermittently fail with "fetch failed", which would otherwise turn the
    // action POST into a 302 to /admin/login and surface React's
    // "An unexpected response was received from the server." error.
    if (request.headers.has("next-action")) {
      return supabaseResponse;
    }
    if (pathname === "/admin/login" || pathname === "/admin/forbidden") {
      if (user && isAdminEmail(user.email) && pathname === "/admin/login") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return supabaseResponse;
    }
    if (!user) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdminEmail(user.email)) {
      return NextResponse.redirect(new URL("/admin/forbidden", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
