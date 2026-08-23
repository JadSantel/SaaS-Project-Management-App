import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl))
    }
});

export const confif = {
    matcher: ["/dashboard/:path"],
};