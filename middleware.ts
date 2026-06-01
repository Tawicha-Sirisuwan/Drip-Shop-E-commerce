import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protect /account route (Only for logged-in users)
  if (pathname.startsWith('/account')) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', req.nextUrl.origin))
    }
  }

  // Protect /admin route (Only for ADMIN role)
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', req.nextUrl.origin))
    }
    
    if (req.auth?.user?.role !== 'ADMIN') {
      return Response.redirect(new URL('/account', req.nextUrl.origin))
    }
  }

  // Prevent logged in users from visiting login/register pages again
  if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
    return Response.redirect(new URL('/', req.nextUrl.origin))
  }
})

export const config = {
  // matcher configures middleware to run on everything except specific paths like static files, API routes, etc.
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
