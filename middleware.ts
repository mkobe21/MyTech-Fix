import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { assertServerEnv } from '@/lib/validate-env';

// Run env validation early on protected routes (server only). Throws with clear message on critical missing vars.
assertServerEnv();

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Protect all core authenticated app surfaces (client pages still have their own guards + redirects
  // for UX, but middleware provides defense-in-depth and prevents unauthenticated direct access).
  const protectedPaths = [
    '/chat',
    '/dashboard',
    '/history',
    '/account',
    '/diagnostics',
    '/inventory',
    '/my-devices',
    '/teams',
    '/upgrade',
  ];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !session) {
    // Redirect to nice sign-in prompt page
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/chat/:path*',
    '/dashboard/:path*',
    '/history/:path*',
    '/account/:path*',
    '/diagnostics/:path*',
    '/inventory/:path*',
    '/my-devices/:path*',
    '/teams/:path*',
    '/upgrade/:path*',
  ],
};