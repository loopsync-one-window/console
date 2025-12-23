"use client"

import { ContentArea } from "@/components/home/content-area"
import { SidebarProvider } from "@/components/home/contexts/sidebar-contexts"
import { Loader } from "@/components/ui/loader"
import { HomeHeader } from "@/components/home/home-header"
import { Sidebar } from "@/components/home/sidebar"
import { useConfettiSound } from "@/hooks/use-confetti-sound"
import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  getStoredTokens,
  getAutopayStatus,
  getProfileMe,
  getPlanByCode,
  getSubscriptionMe,
  logoutAny,
  saveAuthTokens,
  clearAuthTokens,
  type AutopayStatusResponse,
  getOnboardStatus
} from "@/lib/api"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { useSidebar } from "@/components/home/contexts/sidebar-contexts"

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [hydrated, setHydrated] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [skipOnboarding, setSkipOnboarding] = useState(false)
  const [hasCheckedOnboard, setHasCheckedOnboard] = useState(false)
  const [autopayStatus, setAutopayStatus] = useState<AutopayStatusResponse | null>(null)
  const [mustShowCancelModal, setMustShowCancelModal] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [userEmail, setUserEmail] = useState("")

  /**
   * 🔐 AUTH GATE (runs ONCE, hydration-safe)
   */
  useEffect(() => {
    const accessTokenParam = searchParams.get("accessToken")

    // ✅ OAuth callback handling
    if (accessTokenParam) {
      saveAuthTokens({
        accessToken: accessTokenParam,
        refreshToken: searchParams.get("refreshToken") || undefined,
        expiresAt: searchParams.get("expiresAt") || undefined
      })

      const userDataParam = searchParams.get("userData")
      if (userDataParam) {
        try {
          localStorage.setItem(
            "user",
            JSON.stringify(JSON.parse(decodeURIComponent(userDataParam)))
          )
        } catch { }
      }

      // ✅ Clean URL WITHOUT navigation
      window.history.replaceState({}, "", "/home")

      setAllowed(true)
      setHydrated(true)
      return
    }

    // ✅ Normal load
    const { accessToken, refreshToken } = getStoredTokens()

    if (!accessToken && !refreshToken) {
      setHydrated(true)
      router.replace("/open-account?login=true")
      return
    }

    setAllowed(true)
    setHydrated(true)
  }, [])

  /**
   * 📦 LOAD USER DATA (only after auth)
   */
  useEffect(() => {
    if (!allowed) return

    let cancelled = false

    const run = async () => {
      try {
        // Add a small initial delay to ensure storage consistency across tabs/processes if needed
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        const [onboard, autopay, profile] = await Promise.all([
          getOnboardStatus(),
          getAutopayStatus(),
          getProfileMe({ force: true }) // Always force refresh on load
        ])

        if (profile.fullName === "User") {
          throw new Error("unauthorized_user_profile")
        }

        if (cancelled) return

        setSkipOnboarding(Boolean(onboard?.onboard))
        setAutopayStatus(autopay)
        setUserEmail(profile.email)

        const restricted =
          autopay?.isAutopayCancelled ||
          autopay?.shouldRestrict ||
          autopay?.local?.autoRenew === false ||
          autopay?.local?.status?.toUpperCase() !== "ACTIVE"

        setMustShowCancelModal(Boolean(restricted))
        setHasCheckedOnboard(true)
        setIsLoading(false)
      } catch (err) {
        if (cancelled) return
        console.error("Home load error:", err);

        // Retry logic: Try once more before giving up
        if (retryCount < 1) {
          console.log("Retrying home load...");
          setRetryCount(prev => prev + 1);
          return;
        }

        // If validation fails after retry, clear and redirect
        clearAuthTokens()
        router.replace("/open-account?login=true")
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [allowed, retryCount])

  useConfettiSound(allowed && hasCheckedOnboard && !skipOnboarding)

  if (!hydrated || !allowed) return null

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <SidebarProvider
      key={skipOnboarding ? "dash" : "onboard"}
      initialItem={skipOnboarding ? "dashboard" : "onboarding"}
    >
      <AutopayCancelModal open={mustShowCancelModal} status={autopayStatus} email={userEmail} />
      <div className="flex h-screen bg-[#07080a]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <HomeHeader />
          <ContentArea skipOnboarding={skipOnboarding} />
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}

/* ---------- MODAL ---------- */

function AutopayCancelModal({ open, status, email }: { open: boolean; status: AutopayStatusResponse | null; email: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    if (loading) return
    setLoading(true)
    await logoutAny().catch(() => { })
    clearAuthTokens()
    router.push("/")
  }

  const handleReactivate = () => {
    const plan = status?.local?.plan?.code || "PRO"
    router.push(`/secure/checkout?plan=${plan}&email=${encodeURIComponent(email)}&billingCycle=monthly&reactivate=true`)
  }

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={e => e.preventDefault()}
        className="max-w-sm p-10 flex flex-col items-center justify-center gap-6 border-none bg-white text-center rounded-3xl shadow-2xl"
      >
        <div className="space-y-3 pt-2">
          <DialogTitle className="text-2xl font-bold text-black tracking-tighter">
            Subscription Paused
          </DialogTitle>
          <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
            Your subscription is currently inactive. Please reactivate to continue using LoopSync.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full pt-2">
          <Button
            onClick={handleReactivate}
            className="w-full bg-black text-white hover:bg-zinc-800 font-bold h-12 rounded-full transition-all text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Reactivate Subscription
          </Button>

          <a
            href="https://loopsync.cloud/one-window/support/resources"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full border-zinc-200 text-zinc-600 hover:text-black hover:border-black hover:bg-transparent font-semibold h-10 rounded-full transition-all text-xs"
            >
              Contact Support
            </Button>
          </a>

          <Button
            variant="ghost"
            onClick={logout}
            className="w-full text-gray-400 hover:text-red-500 hover:bg-transparent font-medium h-auto py-1 rounded-md transition-colors text-xs"
          >
            Log out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
