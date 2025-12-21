"use client"
import { ExternalLink, Code2, Zap, Users, FileText, Activity, Cable as Cube, TreeDeciduous, Paperclip, IndianRupee, Gift, AlertTriangle, Info, Cloud, CloudCheck, FerrisWheel, TreePine, ChevronRightIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { getBillingOverview, getSubscriptionMe, getTrialNotifyStatus, updateTrialNotifyStatus, getCachedBillingOverview, addTrialCredits, getTrialCreditsStatus } from "@/lib/api"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getProfileMe, getCachedProfile, addCredits } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Define types for our cached data
interface CachedDashboardData {
  overview: {
    subscription: {
      planName: string
      status: string
      startDate: string
      endDate: string
      daysRemaining: number
      autoRenew: boolean
    }
    credits: {
      prepaid: { balance: number }
      free: { balance: number }
      usageCap: { total: number; remaining: number }
    }
    usage: { total: number; prepaidUsed: number }
    nextInvoice: number
  } | null
  firstName: string
  isFreeTrial: boolean
}

// Global cache variables
let cachedDashboardData: CachedDashboardData | null = null
let dashboardCacheTimestamp: number = 0
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

export function Dashboard() {
  const router = useRouter()
  const [overview, setOverview] = useState<{
    subscription: {
      planName: string
      status: string
      startDate: string
      endDate: string
      daysRemaining: number
      autoRenew: boolean
    }
    credits: {
      prepaid: { balance: number }
      free: { balance: number }
      usageCap: { total: number; remaining: number }
    }
    usage: { total: number; prepaidUsed: number }
    nextInvoice: number
  } | null>(null)
  const [firstName, setFirstName] = useState<string>("User")
  const [isFreeTrial, setIsFreeTrial] = useState<boolean>(false)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState<boolean>(false)
  const [agree, setAgree] = useState<boolean>(false)
  const [trialNotify, setTrialNotify] = useState<boolean | null>(null)
  const [hasCheckedTrialNotify, setHasCheckedTrialNotify] = useState<boolean>(false)
  const [isReloading, setIsReloading] = useState<boolean>(false)
  // State to track if user data has been successfully loaded
  const [userDataLoaded, setUserDataLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [trialCreditsClaimed, setTrialCreditsClaimed] = useState<boolean>(false)
  const [isClaimingCredits, setIsClaimingCredits] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      try {
        // Check if we have valid cached data
        const now = Date.now()
        if (cachedDashboardData && dashboardCacheTimestamp > now) {
          // Use cached data
          setOverview(cachedDashboardData.overview)
          setFirstName(cachedDashboardData.firstName)

          if (cachedDashboardData.isFreeTrial) {
            // If cache thinks it's a free trial, Verify it! User might have paid recently.
            try {
              const sub = await getSubscriptionMe()
              if (sub?.success && sub?.subscription) {
                const freshIsFreeTrial = Boolean(sub.subscription.isFreeTrial)
                setIsFreeTrial(freshIsFreeTrial)
                cachedDashboardData.isFreeTrial = freshIsFreeTrial // Update cache
              } else {
                setIsFreeTrial(true) // Fallback to cache if request fails
              }
            } catch {
              setIsFreeTrial(true)
            }
          } else {
            setIsFreeTrial(false)
          }

          setUserDataLoaded(true)
          setIsLoading(false)
          return
        }

        // Load fresh data
        setIsLoading(true)

        // Get billing overview
        const res = await getBillingOverview()
        if (res?.success && res?.data) {
          setOverview(res.data)
          // Cache the overview data
          if (cachedDashboardData) {
            cachedDashboardData.overview = res.data
          }
        }

        // Get user profile
        const cached = getCachedProfile?.()
        let full = cached?.fullName as string | undefined
        if (!full) {
          const data = await getProfileMe()
          full = data?.fullName
        }

        // Check if we have valid user data
        if (full) {
          const name = (full || '').trim()
          const firstNameValue = name ? name.split(/\s+/)[0] : 'User'
          setFirstName(firstNameValue)
          setUserDataLoaded(true)

          // Cache the user data
          if (cachedDashboardData) {
            cachedDashboardData.firstName = firstNameValue
          } else {
            cachedDashboardData = {
              overview: res?.success && res?.data ? res.data : null,
              firstName: firstNameValue,
              isFreeTrial: false
            }
          }
        } else {
          // Set default values if no user data
          setFirstName('User')
          setUserDataLoaded(true)

          // Create cache with default values
          if (!cachedDashboardData) {
            cachedDashboardData = {
              overview: res?.success && res?.data ? res.data : null,
              firstName: 'User',
              isFreeTrial: false
            }
          }
        }

        // Get subscription info
        const sub = await getSubscriptionMe()
        if (sub?.success && sub?.subscription) {
          const isFreeTrialValue = Boolean(sub.subscription.isFreeTrial)
          setIsFreeTrial(isFreeTrialValue)

          // Cache the subscription data
          if (cachedDashboardData) {
            cachedDashboardData.isFreeTrial = isFreeTrialValue
          }
        } else {
          // Set default for isFreeTrial if no subscription data
          if (cachedDashboardData) {
            cachedDashboardData.isFreeTrial = false
          }
        }

        // Update cache timestamp
        dashboardCacheTimestamp = Date.now() + CACHE_TTL
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        // Even if there's an error, we should still show the dashboard
        setUserDataLoaded(true)
        // Set default cache on error
        if (!cachedDashboardData) {
          cachedDashboardData = {
            overview: null,
            firstName: 'User',
            isFreeTrial: false
          }
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [router])

  useEffect(() => {
    (async () => {
      try {
        const s = await getTrialNotifyStatus()
        setTrialNotify(Boolean(s?.trialNotify))
      } catch {
        setTrialNotify(null)
      } finally {
        setHasCheckedTrialNotify(true)
      }
    })()
  }, [])

  // Auto-mark trial notify as done if not in free trial
  useEffect(() => {
    if (hasCheckedTrialNotify && userDataLoaded && !isFreeTrial && trialNotify === false) {
      updateTrialNotifyStatus(true)
        .then(() => setTrialNotify(true))
        .catch(() => { })
    }
  }, [hasCheckedTrialNotify, userDataLoaded, isFreeTrial, trialNotify])

  useEffect(() => {
    if (hasCheckedTrialNotify && isFreeTrial && trialNotify === false) {
      setIsTrialModalOpen(true)
    } else {
      setIsTrialModalOpen(false)
    }
  }, [hasCheckedTrialNotify, isFreeTrial, trialNotify])

  useEffect(() => {
    if (userDataLoaded && isFreeTrial) {
      getTrialCreditsStatus()
        .then(res => setTrialCreditsClaimed(res.claimed))
        .catch(() => { })
    }
  }, [userDataLoaded, isFreeTrial])

  const handleClaimCredits = async () => {
    setIsClaimingCredits(true)
    try {
      let email = getCachedProfile?.()?.email || ""
      if (!email) {
        try {
          const p = await getProfileMe()
          email = p?.email || ""
        } catch { }
      }
      if (!email) {
        toast.error("Could not verify user email")
        return
      }

      const res = await addTrialCredits({
        email,
        type: "free",
        amount: 40000,
        reason: "Free trial credit",
        referenceId: "REF-001"
      })

      if (res.success) {
        setTrialCreditsClaimed(true)
        toast.success("Successfully claimed ₹400 credits")
        try {
          const overview = await getBillingOverview({ force: true })
          if (overview?.success && overview?.data) setOverview(overview.data)
        } catch { }
      } else {
        if (res.message?.includes("already claimed") || ((res as any).code === 'ALREADY_CLAIMED')) {
          setTrialCreditsClaimed(true)
          toast.info("Credits already claimed")
        } else {
          toast.error(res.message || "Failed to claim credits")
        }
      }
    } catch (e) {
      toast.error("An error occurred")
    } finally {
      setIsClaimingCredits(false)
    }
  }

  const fmt = (v: number | undefined | null) => {
    if (v == null) return "₹0"
    return `₹${(v / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const renderAmountLoading = () => (
    <span className="inline-flex items-baseline">
      <span className="text-xl mr-1">₹</span>
      <span className="inline-block bg-white/5 animate-pulse rounded-full w-24 h-6" />
    </span>
  )

  const monthLabel = new Date().toLocaleString("en-US", { month: "long", year: "numeric" })

  const capTotal = overview?.credits?.usageCap?.total || 0
  const capRemaining = overview?.credits?.usageCap?.remaining || 0
  const capConsumed = capTotal - capRemaining
  const days = overview?.subscription?.daysRemaining ?? 0

  const renderAmount = (v: number | undefined | null) => {
    const val = v || 0
    const formatted = (val / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return (
      <span className="inline-flex items-baseline">
        <span className="text-xl mr-1">₹</span>
        <span>{formatted}</span>
      </span>
    )
  }

  return (
    <main className="flex-1 overflow-auto bg-background relative scrollbar-hide">
      {/* Down zebra pattern */}
      <div className="absolute bottom-0 left-0 w-full h-[7%] opacity-60 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <pattern id="zebraPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#000" />
              <rect width="20" height="40" fill="#fff" />
            </pattern>
          </defs>

          <rect width="1200" height="600" fill="url(#zebraPattern)" />
        </svg>
      </div>



      <div className="relative z-10 p-8">
        <Dialog
          open={isTrialModalOpen && isFreeTrial}
        >
          <DialogContent
            showCloseButton={false}
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="max-w-xl rounded-3xl border border-white/10 bg-white text-white p-0 overflow-hidden shadow-lg data-[state=open]:duration-600 data-[state=open]:ease-out data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-6 data-[state=closed]:duration-300 data-[state=closed]:ease-in data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-6"
          >
            <div className="px-6 py-6">
              <DialogHeader className="mb-3">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl text-black rounded-full font-semibold"><ChevronRightIcon className="relative inline bottom-0.5 text-black/15" /> 7-day Free Trial</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-4 text-[16px] leading-relaxed text-black/80">
                <p>
                  You're currently enjoying a <span className="font-semibold text-black">7-day free trial</span>.
                  To keep your access uninterrupted, please keep the
                  <span className="font-semibold text-black"> recurring autopay enabled</span>.
                </p>

                <p>
                  If you choose to cancel, you can do so anytime before the final
                  <span className="font-semibold text-black"> 24 hours</span> of your trial period. If you cancel or pause within the trial period, your trial will end immediately and your account will be scheduled for automatic deletion.
                </p>
              </div>
            </div>

            <DialogFooter
              className="flex items-center justify-between px-6 py-4 border-t-3 border-black/10 bg-black/5"
            >
              <Button
                size="lg"
                onClick={async () => {
                  let email = getCachedProfile?.()?.email || ""
                  if (!email) {
                    try {
                      const p = await getProfileMe()
                      email = p?.email || ""
                    } catch { }
                  }
                  const ref = `REF-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
                  try {
                    await Promise.all([
                      updateTrialNotifyStatus(true),
                      email ? addCredits({ email, type: "free", amount: 34900, reason: "7-Day Free Trial Credit Bonus", referenceId: ref }) : Promise.resolve({}),
                    ])
                  } catch { }
                  setIsTrialModalOpen(false)
                  setAgree(false)
                  setIsReloading(true)
                  try {
                    try {
                      const res = await getBillingOverview({ force: true })
                      if (res?.success && res?.data) setOverview(res.data)
                    } catch { }
                    try {
                      const sub = await getSubscriptionMe()
                      if (sub?.success && sub?.subscription) setIsFreeTrial(Boolean(sub.subscription.isFreeTrial))
                    } catch { }
                  } finally {
                    setIsReloading(false)
                  }
                }}
                className="rounded-full bg-black text-white hover:bg-black/90 hover:text-white text-[16px] cursor-pointer font-semibold"
              >
                Agree
              </Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>


        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {firstName}</h1>
          {/* <p className="text-muted-foreground text-lg">Overview of your usage and billing</p> */}
        </div>

        {/* Usage Snapshot Section */}
        <div className="mb-8 rounded-3xl border border-white/5 bg-black p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Usage Snapshot for {monthLabel}</h2>
            {(userDataLoaded && isFreeTrial) ? (
              <div className="flex items-center gap-3">
                <span className="text-sm px-4 py-2 bg-transparent border border-white/10 rounded-full font-semibold text-white">7-day free trial · Free credits apply</span>
                {trialCreditsClaimed ? (
                  <span className="text-xs px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-medium">Already Claimed</span>
                ) : (
                  <Button onClick={handleClaimCredits} disabled={isClaimingCredits} size="sm" className="h-9 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold px-4 transition-all">
                    {isClaimingCredits ? "Claiming..." : "Claim ₹400 free credits"}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Next billing period starts in {isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-12 h-4 align-middle" /> : <span className="font-semibold text-white">{days}</span>} days</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Usage Cap */}
            <div className="flex flex-col items-center gap-4 p-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                      <feComposite in="blur" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" />
                    </filter>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#404040" strokeWidth="3" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeDasharray="283"
                    strokeDashoffset="0"
                    pathLength="100"
                    filter="url(#innerGlow)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isLoading ? (
                    <span className="inline-block bg-white/5 animate-pulse rounded-full w-10 h-5" />
                  ) : (
                    <span className="text-lg font-bold">{capTotal ? Math.round((capConsumed / capTotal) * 100) : 0}%</span>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Usage Cap</p>
                <p className="text-3xl font-semibold text-white mb-1">{isLoading ? renderAmountLoading() : renderAmount(capTotal)}</p>
                <p className="text-sm font-medium text-white/60"><span className="text-sm font-medium ml-1">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-16 h-4 align-middle" /> : fmt(overview?.usage?.total || 0)}</span> consumed</p>
              </div>
            </div>

            {/* Prepaid credits */}
            <div className="flex flex-col items-center gap-4 p-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                      <feComposite in="blur" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" />
                    </filter>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#404040" strokeWidth="3" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeDasharray="226"
                    strokeDashoffset="0"
                    pathLength="100"
                    filter="url(#innerGlow)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold"><IndianRupee className="w-8 h-8" /></span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Prepaid credits</p>
                <p className={`text-3xl font-semibold text-white mb-1`}>
                  {!isLoading && (((overview?.credits?.prepaid?.balance || 0) / 100) < 85) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center mr-2 align-middle">
                            <AlertTriangle className="w-5 h-5 text-white mb-2" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black font-semibold rounded-full shadow-2xl px-3 py-2">
                          Low balance, please add pre credits
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {isLoading ? renderAmountLoading() : renderAmount(overview?.credits?.prepaid?.balance || 0)}
                </p>
                <p className="text-sm font-medium text-white/60">remaining</p>
              </div>
            </div>

            {/* Free credits */}
            <div className="flex flex-col items-center gap-4 p-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                      <feComposite in="blur" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" />
                    </filter>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#404040" strokeWidth="3" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeDasharray="0"
                    strokeDashoffset="0"
                    pathLength="100"
                    filter="url(#innerGlow)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold"><Gift className="w-8 h-8" /></span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Free credits</p>
                <p className="text-3xl font-semibold text-white mb-1">{isLoading ? renderAmountLoading() : renderAmount(overview?.credits?.free?.balance || 0)}</p>
                <p className="text-sm font-medium text-white/60">remaining</p>
              </div>
            </div>
          </div>

          {/* Usage Details */}
          <div className="border-t border-border pt-8 mb-8 grid grid-cols-3 gap-8">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Total usage</p>
              <p className="font-semibold text-foreground">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-24 h-5" /> : fmt(overview?.usage?.total || 0)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Prepaid credits used</p>
              <p className="font-semibold text-foreground">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-24 h-5" /> : fmt(overview?.usage?.prepaidUsed || 0)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Next invoice</p>
              <p className="font-semibold text-foreground">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-24 h-5" /> : fmt(overview?.nextInvoice || 0)}</p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl px-6 py-8 text-center">
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `
                  radial-gradient(circle at center,
                    rgba(255, 255, 255, 0.08) 0%,
                    rgba(0, 0, 0, 0.85) 40%,
                    rgba(255, 255, 255, 0.06) 60%,
                    transparent 100%
                  ),
                  linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "auto, 40px 40px, 40px 40px",
              }}
            />
            <div className="relative">
              <p className="text-lg font-semibold text-foreground mb-2">Monthly snapshot</p>
              <p className="text-muted-foreground">You spend roughly {isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-28 h-5 align-middle" /> : <span className="font-semibold text-foreground">{fmt(overview?.usage?.total || 0)}</span>} / month</p>
            </div>
          </div>
        </div>
      </div>
      {isReloading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-10 h-10 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </main>
  )
}
