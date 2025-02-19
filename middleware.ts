import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define valid languages
const validLanguages = ['fr', 'en', 'ar']

export function middleware(request: NextRequest) {
  // Get current pathname
  const { pathname } = request.nextUrl

  // Skip middleware for api routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Get the preferred language from cookie or header
  const preferredLanguage = request.cookies.get('preferred-language')?.value
  const browserLanguage = request.headers.get('accept-language')?.split(',')[0].split('-')[0]
  
  // Determine the language to use
  let language = 'fr'
  if (preferredLanguage && validLanguages.includes(preferredLanguage)) {
    language = preferredLanguage
  } else if (browserLanguage && validLanguages.includes(browserLanguage)) {
    language = browserLanguage
  }

  // Get the path segments
  const segments = pathname.split('/')
  const firstSegment = segments[1]

  // If no language prefix or invalid language prefix
  if (!validLanguages.includes(firstSegment)) {
    // Redirect to path with language prefix
    const newPathname = `/${language}${pathname}`
    const url = new URL(newPathname, request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
