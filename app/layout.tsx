import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidStudio",
  description: "Adaptive teacher + student studio scaffold"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
