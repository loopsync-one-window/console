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

const menuItems = [
  { icon: Home, label: "Dashboard", id: "dashboard" },
  { icon: LucidePuzzle, label: "Find Products", id: "products" },
  { icon: Key, label: "Access Code", id: "access-code" },
  { icon: TrendingUp, label: "My Usage", id: "usage" },
  { icon: TreePalm, label: "Atlas Manager", id: "atlas-manager" },
  { icon: Layers, label: "Collections", id: "collections" },
]

const bottomMenuItems = [
  { icon: CreditCard, label: "Billing", id: "billing" },
  { icon: HelpCircle, label: "Help", id: "help" },
  { icon: User, label: "My Profile", id: "my-profile" },
  { icon: Settings, label: "Settings", id: "settings" },
]

export function Sidebar() {
  const { activeItem, setActiveItem } = useSidebar()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logoutAny()
    } catch {}
    try {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("expiresAt")
      localStorage.removeItem("user")
    } catch {}
    router.push("/")
    setIsLoggingOut(false)
  }

  return (
    // Changed bg-sidebar to bg-[#07080a] to match your desired color
    <div className="w-64 border-r-5 border-white/5 border-border bg-[#07080a] text-sidebar-foreground flex flex-col">
      {/* Header */}
      <div className="w-full border-b-5 border-white/5 border-border p-3 flex items-center justify-between h-16">
        {/* Logo */}
        <img 
          src="/resources/logo.svg" 
          alt="LoopSync Logo" 
          className="h-8 w-auto brightness-150 contrast-125"
        />

      </div>


      {/* Main Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 mt-5">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors",
                activeItem === item.id
                  ? "smoggy-bg text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-white/5 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Menu Items */}
      <div className="border-t-5 border-white/5 border-border p-2 space-y-1">
        {bottomMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors",
              activeItem === item.id
                ? "smoggy-bg text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-white/5 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className={cn(
            "w-full bg-white/5 flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors text-sidebar-foreground mt-4 pt-4",
            isLoggingOut ? "cursor-wait opacity-70" : "cursor-pointer hover:bg-red-700 hover:text-sidebar-accent-foreground"
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
