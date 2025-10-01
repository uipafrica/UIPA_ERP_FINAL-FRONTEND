import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = ["/login"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/t/")

    // Get token from localStorage is not available in middleware, so we'll check cookies
    // The AuthContext will handle localStorage tokens on the client side
    const token = request.cookies.get("access_token")?.value

    // If accessing login page with a token, redirect to dashboard
    if (pathname === "/login" && token) {
        const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/"
        return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // If accessing a protected route without a token, redirect to login
    if (!isPublicRoute && !token) {
        const loginUrl = new URL("/login", request.url)
        // Only add redirect parameter if it's not already the login page
        if (pathname !== "/login") {
            loginUrl.searchParams.set("redirect", pathname)
        }
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
    ],
}
