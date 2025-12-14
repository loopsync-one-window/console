"use client"

import { ContentArea } from "@/components/home/content-area"
import { Dashboard } from "@/components/home/contents/dashboard"
import { SidebarProvider } from "@/components/home/contexts/sidebar-contexts"
import { HomeHeader } from "@/components/home/home-header"
import { Sidebar } from "@/components/home/sidebar"
import { useConfettiSound } from "@/hooks/use-confetti-sound"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getStoredTokens, getAutopayStatus, getProfileMe, getPlanByCode, getSubscriptionMe, logoutAny, type AutopayStatusResponse, getOnboardStatus } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Timer, Trash2, X } from "lucide-react"
import { useSidebar } from "@/components/home/contexts/sidebar-contexts"

export default function HomePage() {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)
  const [mustShowCancelModal, setMustShowCancelModal] = useState(false)
  const [autopayStatus, setAutopayStatus] = useState<AutopayStatusResponse | null>(null)
  const [skipOnboarding, setSkipOnboarding] = useState(false)
  const [hasCheckedOnboard, setHasCheckedOnboard] = useState(false)

  useEffect(() => {
    try {
      const { accessToken } = getStoredTokens()
      if (!accessToken) {
        router.replace("/open-account?login=true")
        return
      }
      setAllowed(true)
    } catch {
      router.replace("/open-account?login=true")
    }
  }, [router])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!allowed) return
      try {
        const s = await getOnboardStatus()
        if (!cancelled) setSkipOnboarding(Boolean(s?.onboard))
      } catch {} finally {
        if (!cancelled) setHasCheckedOnboard(true)
      }
      try {
        const status = await getAutopayStatus()
        if (cancelled) return
        setAutopayStatus(status)
        const shouldOpen =
          status?.isAutopayCancelled === true ||
          status?.shouldRestrict === true ||
          status?.local?.autoRenew === false ||
          (typeof status?.local?.status === "string" && status?.local?.status.toUpperCase() !== "ACTIVE")
        setMustShowCancelModal(Boolean(shouldOpen))
      } catch {}
    }
    run()
    return () => {
      cancelled = true
    }
  }, [allowed])

  useConfettiSound(allowed && hasCheckedOnboard && !skipOnboarding)

  if (!allowed) return null
  
  return (
    <SidebarProvider
      key={hasCheckedOnboard ? (skipOnboarding ? "dash" : "onboard") : "pending"}
      initialItem={hasCheckedOnboard ? (skipOnboarding ? "dashboard" : "onboarding") : "dashboard"}
    >
      <AutopayCancelModal open={mustShowCancelModal} status={autopayStatus} />
      <div className="flex h-screen bg-[#07080a] text-foreground">
        {/* <div className="screen-glow-top"></div> */}
        {/* <div className="screen-glow-left"></div> */}
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <HomeHeader />
          {hasCheckedOnboard ? <ContentArea skipOnboarding={skipOnboarding} /> : null}
        </div>
        {/* <div className="screen-glow-right"></div> */}
        {/* <div className="screen-glow-bottom"></div> */}
      </div>
    </SidebarProvider>
  )
}

function AutopayCancelModal({ open, status }: { open: boolean; status: AutopayStatusResponse | null }) {
  const { setActiveItem } = useSidebar()
  const router = useRouter()
  const [reactivating, setReactivating] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const handleReactivate = async () => {
    if (reactivating) return
    setReactivating(true)
    let planCode = (status?.local?.plan?.code as string) || "PRO_PRIME-X"
    let email = ""
    let billingCycle = "monthly"
    const rawNotes = status?.provider?.provider?.notes
    if (rawNotes && typeof rawNotes === "object") {
      const n = rawNotes as Record<string, unknown>
      const em = n["email"]
      const bc = n["billingCycle"]
      const pc = n["planCode"]
      if (typeof pc === "string" && pc) planCode = pc
      if (typeof em === "string" && em) email = em
      if (typeof bc === "string" && bc) billingCycle = bc.toLowerCase()
    }
    try {
      if (!email) {
        const prof = await getProfileMe().catch(() => null)
        if (prof && typeof prof.email === "string") email = prof.email
      }
      if (!planCode || planCode === "") {
        const sub = await getSubscriptionMe().catch(() => null)
        const sc = sub?.subscription?.planCode
        if (typeof sc === "string" && sc) planCode = sc
      }
      if (planCode && (!billingCycle || billingCycle === "")) {
        const plan = await getPlanByCode(planCode).catch(() => null)
        if (plan && typeof plan.billingCycle === "string") billingCycle = plan.billingCycle.toLowerCase()
      }
    } finally {
      setTimeout(() => {
        const qs = new URLSearchParams({ plan: planCode, email, billingCycle })
        qs.set("reactivate", "true")
        router.push(`/secure/checkout?${qs.toString()}`)
      }, 2000)
    }
  }
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
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="bg-red-900 text-white rounded-3xl border border-white/10 max-w-md"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <button
          aria-label="Logout"
          className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:opacity-60"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
          ) : (
            <X className="size-5 cursor-pointer text-white" />
          )}
        </button>
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className="rounded-full bg-red-800 p-4">
            <Timer className="size-8 text-white" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-white text-center">Autopay Cancelled</DialogTitle>
          </DialogHeader>
          <p className="text-[14px] leading-relaxed ml-5 mr-5">
            You have canceled or paused your recurring autopay. Your trial is no longer active, and your account is now scheduled for deletion. You can reactivate anytime to continue on your regular subscription.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              className="rounded-full cursor-pointer px-6 bg-white text-black font-semibold disabled:opacity-60"
              onClick={handleReactivate}
              disabled={reactivating}
            >
              {reactivating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/20 border-t-transparent rounded-full animate-spin" />
                  Processing
                </span>
              ) : (
                "Reactivate Account"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
