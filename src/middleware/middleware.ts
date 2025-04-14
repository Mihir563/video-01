import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const cParam = url.searchParams.get("c");

  if (cParam && url.pathname !== "/") {
    // Keep the `c` param and redirect to `/`
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
