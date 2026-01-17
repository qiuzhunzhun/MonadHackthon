import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MSZ 私募基金代币化平台',
  description: '使用MON代币兑换MSZ代币，参与私募基金投资',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

