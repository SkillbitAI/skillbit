import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Skillbit",
  description: "AI-Powered Interview Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#fff" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
