import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access a protected route
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session and the user is on an auth page
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Specify which routes should be protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tickets/:path*',
    '/services/:path*',
    '/departments/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ],
}