"use client"

import { Bell, Search, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSidebar } from "@/components/home/contexts/sidebar-contexts"
import CeresButton from "@/components/CeresButton"
import { getBillingOverview, getProfilePreferences, updateStabilityModePreference, getProfileMe, getCachedProfile } from "@/lib/api"

export function HomeHeader() {
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { setActiveItem } = useSidebar()
  const [stabilityMode, setStabilityMode] = useState(false)
  const [lowPrepay, setLowPrepay] = useState(false)
  const [loadingStability, setLoadingStability] = useState(true)
  const [userInitial, setUserInitial] = useState<string>("U")
  const [userEmail, setUserEmail] = useState<string>("")

  const toggleStabilityMode = async (checked: boolean) => {
    const prev = stabilityMode
    setStabilityMode(checked)
    setLoadingStability(true)
    try {
      await updateStabilityModePreference(checked)
    } catch {
      setStabilityMode(prev)
    } finally {
      setLoadingStability(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await getBillingOverview()
        const balance = res?.data?.credits?.prepaid?.balance || 0
        setLowPrepay((balance / 100) < 85)
      } catch {}
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const prefs = await getProfilePreferences()
        setStabilityMode(prefs?.stabilityMode === 'active')
      } catch {}
      setLoadingStability(false)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const cached = getCachedProfile?.()
        const full = cached?.fullName
        const cachedEmail: string = (cached && typeof (cached as { email?: string }).email === 'string') ? (cached as { email?: string }).email! : ""
        if (full && typeof full === 'string' && full.length > 0) {
          setUserInitial(full.charAt(0).toUpperCase())
          setUserEmail(cachedEmail)
          return
        }
        const data = await getProfileMe()
        const name = data?.fullName || ''
        const email = data?.email || ''
        setUserInitial(name ? name.charAt(0).toUpperCase() : 'U')
        setUserEmail(email)
      } catch {
        setUserInitial('U')
      }
    })()
  }, [])

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New message received",
      description: "You have a new message from Payment Processor",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment processed",
      description: "Your subscription payment was successfully processed",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "System update",
      description: "Scheduled maintenance completed successfully",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 4,
      title: "Welcome to our platform",
      description: "Thanks for joining us! Check out our getting started guide.",
      time: "1 day ago",
      unread: false,
    },
  ]

  return (
    <header className="border-b-2 border-white/5 border-border bg-black px-6 py-3.5 flex items-center justify-between h-16">
      {/* Left side - Tabs */}
      <div className="flex items-center gap-4">

        {/* <div
          className="relative overflow-hidden flex items-center gap-2 p-2 px-4 rounded-full border border-white/10 border-border bg-transparent cursor-pointer backdrop-blur-md transition-all duration-300 hover:bg-white/10 shimmer"
          onClick={() => {
            const plan = encodeURIComponent('PRO_PRIME-X')
            const email = encodeURIComponent(userEmail || '')
            const billingCycle = 'monthly'
            router.push(`/secure/upgrade/checkout?plan=${plan}&email=${email}&billingCycle=${billingCycle}`)
          }}
        >
          <span className="text-[13px] font-bold">Upgrade to PRO PRIME-X</span>
        </div> */}
        <div
          className="relative overflow-hidden flex items-center gap-2 p-2 px-4 rounded-full border border-white/10 border-border bg-transparent cursor-pointer backdrop-blur-md transition-all duration-300 hover:bg-white/10 shimmer"
          onClick={() => setActiveItem("credit-store")}
        >
          <span className="text-[13px] font-bold">Sync Credit Store</span>
        </div>

        {/* {lowPrepay && (
          <Button className="relative overflow-hidden bg-white text-black text-[13px] font-semibold p-2 px-4 rounded-full shimmer">
            Add Pre Credits
          </Button>
        )} */}

        <style jsx>{`
          .shimmer::before {
            content: "";
            position: absolute;
            top: 0;
            left: -150%;
            height: 100%;
            width: 50%;
            background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%);
            transform: skewX(-20deg);
            animation: shimmer 2.4s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% { left: -150%; }
            100% { left: 150%; }
          }
        `}</style>
      </div>

      {/* Right side - Search and controls */}
      <div className="flex items-center gap-4">
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-10 pr-4 py-2 text-sm w-64" />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            Ctrl+K
          </span>
        </div> */}

        {/* CeresButton */}
        <div className="flex items-center mr-2">
          <CeresButton />
        </div>

        {/* Stealth Mode Toggle */}
        <div className="flex items-center gap-2 mr-2">
          <Switch
            id="stability-mode"
            checked={stabilityMode}
            disabled={loadingStability}
            onCheckedChange={toggleStabilityMode}
            className="cursor-pointer"
          />
          <label 
            htmlFor="stability-mode" 
            className="text-[13px] font-semibold cursor-pointer whitespace-nowrap"
          >
            {stabilityMode ? 'Stability Mode' : 'Stability Mode'}
          </label>
        </div>


        {/* Notification Sheet */}
        <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <SheetTrigger asChild>
            {/* <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent relative">
              <Bell className="w-5 h-5" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button> */}
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
              <div className="space-y-4 pr-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 rounded-lg border ml-10 mr-10 ${
                      notification.unread 
                        ? "bg-transparent border-white/5" 
                        : "bg-transparent border-border border-white/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {notification.title.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-semibold">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                      {/* {notification.unread && (
                        <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                      )} */}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Profile avatar */}
        <div 
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-semibold cursor-pointer"
          onClick={() => setActiveItem("my-profile")}
        >
          {userInitial}
        </div>
      </div>
    </header>
  )
}
