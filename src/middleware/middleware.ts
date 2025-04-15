import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const cParam = url.searchParams.get("c");
  const pathname = url.pathname;

  // Check if there's a `c` parameter and pathname is `/` (home)
  if (cParam && pathname === "/") {
    // If `c` is a clean param and does not contain `/`, we handle it directly
    if (!cParam.includes("/")) {
      // Just continue with the next response — let the page render as is
      return NextResponse.next();
    }
    // If `c` contains a `/`, like `900040/myvideos`, we let that be
    // for specific route handling without redirecting to home
  }

  // For other cases, like `/myvideos`, no redirect needed
  return NextResponse.next();
}
