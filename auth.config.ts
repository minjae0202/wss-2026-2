import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtectedRoute = nextUrl.pathname.startsWith('/notices/new')
      if (isProtectedRoute) return isLoggedIn
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
