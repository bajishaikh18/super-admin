import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AuthCheck } from "@/components/common/AuthCheck";
import { Toaster } from "react-hot-toast";
import Header from "@/components/common/header/Header";
import { ReactQueryProvider } from "./react-quuery-provider";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wonderly Admin",
  description: "Wonderly admin app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextTopLoader />
        <ReactQueryProvider>
          <Header/>
          <Toaster position="top-right" />
          <AuthCheck>{children}</AuthCheck>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
