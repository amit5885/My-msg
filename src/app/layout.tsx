import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const info = {
  name: "my-msg",
  twitter: "@AmitRana_",
  github: "amit5885",
  description: "Send message anonymously",
  url: "https://my-msg.amitrana.dev",
};

export const metadata: Metadata = {
  metadataBase: new URL(info.url),
  title: { default: info.name},
  description: info.description,
  openGraph: {
    type: "website",
    url: info.url,
    title: info.name,
    description: info.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: info.url,
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
