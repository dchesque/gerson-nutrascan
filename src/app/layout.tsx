import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

// Force dynamic rendering to prevent static generation issues with Supabase
export const dynamic = 'force-dynamic'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NutraScan AI - Intelligent Supplement Analysis',
  description: 'Analyze supplements in seconds with AI. Get instant quality scores, dosage analysis, and better alternatives.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
