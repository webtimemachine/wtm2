import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ChakraProvider } from "@chakra-ui/react";
const inter = Inter({ subsets: ["latin"] });
import { manifestWeb } from "../manifest-web";
export const metadata: Metadata = {
  title: manifestWeb.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="./app-icon.png" />
      </head>
      <body className={`${inter.className} bg-slate-100`}>
        <ReactQueryProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
