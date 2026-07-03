import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "@/components/app-provider";

export const metadata: Metadata = {
  title: "LSS Agricultural Show & Trade Fair 2026",
  description: "Lowveld Show Society portal for exhibitor registration, verification, and networking.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
