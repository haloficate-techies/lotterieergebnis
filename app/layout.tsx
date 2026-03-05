import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lottery Results Website",
  description: "Website hasil keluaran lotere dengan data dummy atau upstream API",
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
