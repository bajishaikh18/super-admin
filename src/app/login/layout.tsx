import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.scss";
import { AuthHeader } from "@/components/common/AuthHeader";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthHeader/>
        {children}
        </body>
    </html>
  );
}
