import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { connectDB } from './lib/mongodb'
import { User } from './models/User'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'

type UserDocLike = {
  _id: unknown
  name: string
  email: string
  passwordHash: string
  role?: 'user' | 'admin'
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === 'string' ? credentials.email : undefined
        const password =
          typeof credentials?.password === 'string'
            ? credentials.password
            : undefined
        if (!email || !password) return null

        await connectDB()
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role ?? 'user',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: 'user' | 'admin' }).role ?? 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id)
        session.user.role =
          (token.role as 'user' | 'admin' | undefined) ?? 'user'
      }
      return session
    },
  },
})
