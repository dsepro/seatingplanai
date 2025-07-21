import type { Metadata } from "next";
import { Geist } from "next/font/google"; // Geist_Mono removed as not explicitly used. Can be added back if needed.
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers/providers"; // For React Query and other context providers

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seating Plan Maker - 課室座位表製作工具",
  description: "Classroom Seating Plan Maker by Mr. Louis Chung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
