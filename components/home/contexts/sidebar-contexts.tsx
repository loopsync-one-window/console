"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type SidebarContextType = {
  activeItem: string
  setActiveItem: (item: string) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children, initialItem }: { children: ReactNode; initialItem?: string }) {
  const [activeItem, setActiveItem] = useState(initialItem ?? "dashboard")

  return (
    <SidebarContext.Provider value={{ activeItem, setActiveItem }}>
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
