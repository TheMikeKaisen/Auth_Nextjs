import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookie_names, page_routes } from "./features/auth/constants/app_constants";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const access_token = request.cookies.get(cookie_names.access_token)?.value;
  const is_authenticated = !!access_token;

  const is_auth_page = pathname === page_routes.login || pathname === page_routes.sign_up;
  const is_protected_page = pathname.startsWith(page_routes.dashboard);

  if (is_authenticated && is_auth_page) {
    return NextResponse.redirect(new URL(page_routes.dashboard, request.url));
  }

  if (!is_authenticated && is_protected_page) {
    if (pathname === page_routes.login) return NextResponse.next();
    return NextResponse.redirect(new URL(page_routes.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};