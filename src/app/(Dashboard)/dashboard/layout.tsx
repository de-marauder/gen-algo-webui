import '../../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthGuard } from '../../_components/Auth/AuthGuard'
import { Component } from '@/app/_components/DashboardLayout/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gen-Algo Dashboard',
  description: 'An app to calculate optimal operating conditions for an SMR using a genetics algorithm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthGuard>
          <Component>
            {children}
          </Component>
        </AuthGuard>
      </body>
    </html>
  )
}

