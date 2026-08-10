import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/middleware";

export function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
