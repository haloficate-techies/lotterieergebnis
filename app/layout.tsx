import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Website Hasil Lottery",
  description: "Website hasil keluaran lottery dengan data demo atau API upstream",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
