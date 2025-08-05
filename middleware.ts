import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Helper function to detect device type from user agent
function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  const ua = userAgent.toLowerCase()
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile'
  }
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet'
  }
  if (/desktop|windows|macintosh|linux/i.test(ua)) {
    return 'desktop'
  }
  return 'unknown'
}

// Helper function to get client IP address
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback to request IP
  return request.ip || 'unknown'
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Extract request metadata
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const deviceType = getDeviceType(userAgent)
  const ipAddress = getClientIP(request)
  const pathname = request.nextUrl.pathname
  
  // Route classifications
  const isAuthPage = pathname.startsWith('/auth')
  const isDashboardPage = pathname.startsWith('/dashboard')
  const isApiRoute = pathname.startsWith('/api')
  const isProfilePage = pathname.startsWith('/profile')
  const isOnboardingPage = pathname.startsWith('/onboarding')
  const isTrainerPage = pathname.startsWith('/trainer')
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/onboarding', '/trainer', '/settings', '/workout']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Trainer-only routes
  const trainerOnlyRoutes = ['/trainer']
  const isTrainerOnlyRoute = trainerOnlyRoutes.some(route => pathname.startsWith(route))

  // ==============================================================================
  // AUTHENTICATION FLOW HANDLING
  // ==============================================================================

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone()
    
    // Check if user has completed onboarding
    try {
      const { data: profile } = await supabase
        .from('user_profiles_extended')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single()
      
      if (!profile?.onboarding_completed) {
        redirectUrl.pathname = '/onboarding'
      } else {
        redirectUrl.pathname = '/dashboard'
      }
      
      return NextResponse.redirect(redirectUrl)
    } catch (error) {
      // If profile check fails, redirect to dashboard
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect unauthenticated users away from protected pages
  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // ==============================================================================
  // TRAINER ACCESS CONTROL
  // ==============================================================================
  
  if (user && isTrainerOnlyRoute) {
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('is_trainer')
        .eq('id', user.id)
        .single()
      
      if (!userProfile?.is_trainer) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/dashboard'
        redirectUrl.searchParams.set('error', 'trainer_access_required')
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Error checking trainer status:', error)
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // ==============================================================================
  // SUBSCRIPTION TIER ENFORCEMENT
  // ==============================================================================
  
  if (user && !isApiRoute) {
    try {
      // Check subscription limits for specific pages
      if (pathname.startsWith('/workout/create')) {
        const { data: limits } = await supabase
          .rpc('get_user_subscription_limits', { user_uuid: user.id })
        
        if (limits && limits.length > 0) {
          const userLimits = limits[0]
          
          if (!userLimits.has_unlimited_workouts) {
            const { count } = await supabase
              .from('workouts')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('is_template', false)
            
            if (count && count >= (userLimits.workout_limit || 0)) {
              const redirectUrl = request.nextUrl.clone()
              redirectUrl.pathname = '/dashboard'
              redirectUrl.searchParams.set('error', 'workout_limit_reached')
              redirectUrl.searchParams.set('upgrade', 'true')
              return NextResponse.redirect(redirectUrl)
            }
          }
        }
      }
    } catch (error) {
      // Log error but don't block the request
      console.error('Error checking subscription limits:', error)
    }
  }

  // ==============================================================================
  // SESSION TRACKING (for authenticated users)
  // ==============================================================================
  
  if (user && !isApiRoute) {
    try {
      // Update user activity (fire and forget - ignore all errors)
      try {
        void supabase
          .from('user_activity_log')
          .insert({
            user_id: user.id,
            action: 'page_view',
            resource_type: 'page',
            resource_id: pathname,
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              device_type: deviceType,
              referrer: request.headers.get('referer'),
              timestamp: new Date().toISOString()
            }
          })
      } catch {
        // Ignore activity logging errors
      }
    } catch (error) {
      // Ignore session tracking errors
    }
  }

  // ==============================================================================
  // SECURITY HEADERS
  // ==============================================================================
  
  // Add security headers
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('X-Robots-Tag', 'noindex, nofollow')
  
  // Add rate limiting headers (for informational purposes)
  supabaseResponse.headers.set('X-RateLimit-Limit', '1000')
  supabaseResponse.headers.set('X-RateLimit-Remaining', '999')
  
  // Add request metadata to response headers (for debugging)
  if (process.env.NODE_ENV === 'development') {
    supabaseResponse.headers.set('X-Device-Type', deviceType)
    supabaseResponse.headers.set('X-User-Authenticated', user ? 'true' : 'false')
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}