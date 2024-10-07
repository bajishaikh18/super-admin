import { Inter } from "next/font/google";
import "../globals.scss";
import { AuthHeader } from "@/components/common/header/AuthHeader";
import { Toaster } from "react-hot-toast";
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
        <AuthHeader/>
        <Toaster position="top-right"
        />
        <AuthCheck>{children}</AuthCheck>
        </body>
    </html>
  );
}
