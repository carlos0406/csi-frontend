import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ClientOnly from "@/components/ClientOnly"
import { getCurrentUser } from "./actions/getCurrentUser"
import { Toaster } from "@/components/ui/toaster"
import ReactQueryProvider from "@/components/ReactQueryProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CSINatal - Sistema de Organização de Compras",
  description: "Sistema de Organização de Compras Yu-Gi-Oh!",
    generator: 'v0.dev'
}

export default async function  RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
      <ReactQueryProvider>
        <div className="flex flex-col min-h-screen">
          <ClientOnly>
            <Header user={user}/>
            <Toaster />
          </ClientOnly>
          <main className="flex-1 bg-gray-50">{children}</main>
          <Footer />
        </div>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
