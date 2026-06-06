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
import UtilityItems from "./components/utility-item";
import { Search } from "lucide-react";
import PageTransition from "./components/pagetransition";

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
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
                  <div className="flex items-center gap-2 md:gap-4">
                    <SidebarTrigger className="-ml-1" />
                    <button
                      // onClick={() => setIsCommandPaletteOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors w-full max-w-xs text-left cursor-pointer"
                      id="toolbar-command-trigger"
                    >
                      <Search className="w-3.5 h-3.5 shrink-0" />
                      <span className="flex-1">
                        Search workspace commands...
                      </span>
                      <kbd className="hidden sm:inline-flex px-1.5 py-0.2 bg-[#0c0c0e] border border-[#1e1e24] font-mono text-[9px] rounded-sm uppercase tracking-wide">
                        ⌘K
                      </kbd>
                    </button>
                  </div>
                  <UtilityItems />
                </header>
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
