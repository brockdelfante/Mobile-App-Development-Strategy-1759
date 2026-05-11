import { NextRequest } from 'next/server'

export function isAuthenticated(req: NextRequest): boolean {
  const password = process.env.INTERNAL_PASSWORD
  if (!password) return true // no auth configured, open access

  // Check cookie
  const cookie = req.cookies.get('auth_token')?.value
  if (cookie === password) return true

  // Check Authorization header (for API calls)
  const authHeader = req.headers.get('authorization')
  if (authHeader === `Bearer ${password}`) return true

  return false
}

export function checkAuthCookie(cookieValue: string | undefined): boolean {
  const password = process.env.INTERNAL_PASSWORD
  if (!password) return true
  return cookieValue === password
}
