import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.scss";
import { AuthHeader

 } from "@/components/common/header/AuthHeader";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { AuthCheck } from "@/components/common/AuthCheck";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Toaster position="top-right"
        />
        <AuthHeader />
        <Suspense>
        <AuthCheck>{children}</AuthCheck>
        </Suspense>
      </body>
    </html>
  );
}
