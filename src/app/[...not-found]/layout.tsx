import { Hero } from "../_components/Hero/Hero";
export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Hero>
          Not Found
        </Hero>
      </body>
    </html>
  )
}
