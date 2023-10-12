import '../../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthGuard } from '../../_components/Auth/AuthGuard'
import { Sidebar } from '../../_components/Nav/Sidebar'
import { TopBar } from '../../_components/Nav/TopBar'
import { Blur } from '../../_components/utils/Blur'

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

const Component: React.FC<{ children: React.ReactNode }> = function ({ children }) {
  return (
    <>
      <TopBar />
      <main className='h-[100vh] flex max-sm:gap-2 gap-4 pr-4 overflow-y-scroll'>
        <Sidebar />
        <div className="mt-[4rem] min-h-[80vh] grow ml-[3.5rem] sm:ml-[11rem]">
          <div className='flex flex-col items-center justify-between overflow-x-hidden'>
            <Blur />
          </div>
          <div className='h-[100vh]'>
            {children}
          </div>
        </div>
      </main>
    </>
  )
}