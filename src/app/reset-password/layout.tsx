import { Suspense } from "react";
import { AuthCheck } from "@/components/common/AuthCheck";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <Suspense>
        <AuthCheck>{children}</AuthCheck>
        </Suspense>
  );
}
