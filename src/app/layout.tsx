import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {ReactNode} from "react";
import ThemeRegistry from "@/presentation/component/themeRegistry";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: '인스타그램 맞팔로우 체커',
    icons: "/instagram.png"
}

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeRegistry>
            {children}
        </ThemeRegistry>
        </body>
        </html>
    )
}
