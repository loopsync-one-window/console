"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type SidebarContextType = {
  activeItem: string
  setActiveItem: (item: string) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children, initialItem }: { children: ReactNode; initialItem?: string }) {
  const [activeItem, setActiveItem] = useState(initialItem ?? "dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ activeItem, setActiveItem, mobileMenuOpen, setMobileMenuOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
