import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from '../_components/Footer'
import { Header } from '../_components/Header'
import { AuthGuard } from '../_components/Auth/AuthGuard'
import { Blur } from '../_components/utils/Blur'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gen-Algo',
  description: 'An app to calculate optimal operating conditions for an SMR using a genetics algorithm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // // console.log('children: ', children)
  return (
    <html lang="en">
      <body className={inter.className}>
        <Component>
          {children}
        </Component>
      </body>
    </html>
  )
}

const Component: React.FC<{ children: React.ReactNode }> = function ({ children }) {
  return (
    <>
      <AuthGuard>
        <Header />
        <main className=''>
          <div className="min-h-[80vh]">
            <div className='flex flex-col items-center justify-between w-fit overflow-x-visible'>
              <Blur />
            </div>
            {children}
          </div>
        </main>
        <Footer />
      </AuthGuard >
    </>
  )
}