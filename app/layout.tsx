import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/app/lib/utils";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

import SearchInput from "./components/ui/search";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevFlow",
  description:
    "A developer-focused productivity dashboard that centralizes tasks, focus sessions, and daily goals in one distraction-free interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex flex-col h-screen">
                <SearchInput />
                {/* <PageTransition> */}
                <main className="h-full overflow-auto">{children}</main>
                {/* </PageTransition> */}
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </>
      </body>
    </html>
  );
}
