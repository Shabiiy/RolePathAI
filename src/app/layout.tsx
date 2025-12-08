import type { Metadata } from 'next'
import { PT_Sans, Source_Code_Pro, Space_Grotesk } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'
import { cn } from '@/lib/utils'
import Header from '@/components/Header'
import { FirebaseClientProvider } from '@/firebase'
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { Chatbot } from '@/components/Chatbot/Chatbot'

export const metadata: Metadata = {
  title: 'RolePath AI',
  description: 'Generate personalized career learning roadmaps.',
}

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-grotesk',
})

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-source-code-pro',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        suppressHydrationWarning
        className={cn(
          'font-body antialiased min-h-screen bg-background',
          ptSans.variable,
          spaceGrotesk.variable,
          sourceCodePro.variable
        )}>
        <FirebaseClientProvider>
          <FirebaseErrorListener />
          <Header />
          {children}
          <Chatbot />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  )
}
