"use client"

import {
  Home,
  Key,
  TrendingUp,
  Grid2x2,
  Layers,
  CreditCard,
  Settings,
  UserPlus,
  User,
  LogOut,
  LucidePuzzle,
  HelpCircle,
  Package,
  Package2Icon,
  TreeDeciduous,
  Globe2,
  SquaresIntersect,
  TreePalm,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./contexts/sidebar-contexts"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { logoutAny } from "@/lib/api"
import { Sheet, SheetContent } from "@/components/ui/sheet"

const menuItems = [
  { icon: Home, label: "Dashboard", id: "dashboard" },
  { icon: Key, label: "Access Code", id: "access-code" },
  { icon: TrendingUp, label: "Limits & Usage", id: "usage" },
  { icon: Layers, label: "My Collections", id: "collections" },
  { icon: TreePalm, label: "Atlas Manager", id: "atlas-manager" },
  { icon: LucidePuzzle, label: "Find Products", id: "products" },
]

const bottomMenuItems = [
  { icon: CreditCard, label: "Billing", id: "billing" },
  { icon: User, label: "My Profile", id: "my-profile" },
  { icon: HelpCircle, label: "Help Desk", id: "help" },
  { icon: Settings, label: "System Settings", id: "settings" },
]

function SidebarContent() {
  const { activeItem, setActiveItem, setMobileMenuOpen } = useSidebar()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logoutAny()
    } catch { }
    try {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("expiresAt")
      localStorage.removeItem("user")
    } catch { }
    router.push("/")
    setIsLoggingOut(false)
  }

  const handleItemClick = (id: string) => {
    setActiveItem(id)
    // We can safely call this even on desktop, though it might be redundant.
    // If we want to avoid re-renders or checks, we could check context but it's fine.
    setMobileMenuOpen(false)
  }

  return (
    // Added gradient blur effect with black background
    <div className="w-full h-full bg-black flex flex-col relative overflow-hidden">
      {/* Gradient blur overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="w-full  p-3 flex items-center justify-between h-16 relative z-20">
        {/* Logo */}
        <img
          src="/resources/logo.svg"
          alt="LoopSync Logo"
          className="h-7 ml-2 w-auto brightness-150 contrast-125"
        />

      </div>


      {/* Main Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-5 mt-5 relative z-20">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all duration-200",
                activeItem === item.id
                  ? "bg-white/10 text-white border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-xl translate-x-1"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white hover:translate-x-1",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Menu Items */}
      <div className="border-t border-white/5 p-5 space-y-1 relative z-20">
        {bottomMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all duration-200",
              activeItem === item.id
                ? "bg-white/10 text-white border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-xl translate-x-1"
                : "text-neutral-400 hover:bg-white/5 hover:text-white hover:translate-x-1",
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className={cn(
            "w-full bg-white/5 flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all duration-200 text-neutral-400 mt-4",
            isLoggingOut ? "cursor-wait opacity-70" : "cursor-pointer hover:bg-red-950/30 hover:text-red-400 hover:border hover:border-red-900/30 border border-transparent"
          )}
        >
          {isLoggingOut ? (
            <div className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          <span className="text-sm font-semibold mb-1">Log Out</span>
        </button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useSidebar()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 border-r-2 border-white/5 border-border bg-black flex-col relative overflow-hidden shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r-2 border-white/5 bg-black text-white px-0 border-none outline-none">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}