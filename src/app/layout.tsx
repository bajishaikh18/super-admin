import type { Metadata } from "next";
import "./globals.scss";
import { AuthCheck } from "@/components/common/AuthCheck";
import { Toaster } from "react-hot-toast";
import Header from "@/components/common/header/Header";
import { ReactQueryProvider } from "./react-quuery-provider";
import NextTopLoader from 'nextjs-toploader';

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
      <body>
      <NextTopLoader />
        <ReactQueryProvider>
          <Header/>
          <Toaster position="top-center" />
          <AuthCheck>{children}</AuthCheck>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
