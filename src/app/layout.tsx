import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENCC ERP Requirements · Crest Point",
  description:
    "ENCC (North Coal) ERP requirements — payroll design confirmed with Crest Point. Review, score, and approve.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
