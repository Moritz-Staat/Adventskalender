import type React from "react"
import type { Metadata, Viewport } from "next"
import { Rye, Big_Shoulders, Figtree } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const rye = Rye({ subsets: ["latin"], weight: "400", variable: "--nf-sign" })
const bigShoulders = Big_Shoulders({ subsets: ["latin"], variable: "--nf-ticket", adjustFontFallback: false })
const figtree = Figtree({ subsets: ["latin"], variable: "--nf-body" })

export const metadata: Metadata = {
  title: "Familien-Adventskalender",
  description: "Ein interaktiver Adventskalender mit täglicher Auslosung für die ganze Familie",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a0f0d",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${rye.variable} ${bigShoulders.variable} ${figtree.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: "#241512", color: "#f4ead6", border: "1px solid #4a2a22" },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
