"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  isAuthenticated: boolean
  userId: string | null
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  sendMagicLink: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setIsAuthenticated(true)
          setUserId(session.user.id)
          setUser(session.user)
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true)
          setUserId(session.user.id)
          setUser(session.user)
        } else {
          setIsAuthenticated(false)
          setUserId(null)
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data.user) {
      setUserId(data.user.id)
      setUser(data.user)
      setIsAuthenticated(true)
    }
  }

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data.user) {
      // Create user profile
      await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          is_premium: false,
          free_analyses_used: 0,
        })

      setUserId(data.user.id)
      setUser(data.user)
      setIsAuthenticated(true)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUserId(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/scan`
      }
    })
    if (error) throw error
  }

  const sendMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/scan`
      }
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        user,
        isLoading,
        login,
        signup,
        logout,
        signInWithGoogle,
        sendMagicLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
