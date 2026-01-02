"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { CheckCircle, Info } from "lucide-react"
import { addCredits, API_BASE_URL, getAccessToken, getBillingDetails, getCachedBillingDetails, invalidateBillingOverviewCache, createInvoice, getSubscriptionMe } from "@/lib/api"
import { useSidebar } from "../contexts/sidebar-contexts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SyncCreditStore() {
  const MIN_CREDITS = 100
  const MAX_CREDITS = 20000
  const STEP = 100
  const PRICE_PER_CREDIT = 1 // change if needed

  const [credits, setCredits] = useState(2600)
  const [creditType, setCreditType] = useState<"prepaid" | "free">("prepaid")
  const [isFreeTrial, setIsFreeTrial] = useState<boolean | null>(null)

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(n)

  // % of slider filled
  const percent = ((credits - MIN_CREDITS) / (MAX_CREDITS - MIN_CREDITS)) * 100

  const totalCost = credits * PRICE_PER_CREDIT
  const [details, setDetails] = useState<{
    activePlan: string
    startDate: string
    endDate: string
    amount: number
    currency: string
    billingEmail: string | null
    billingAddress: unknown | null
    paymentMethod: unknown | null
    paymentId: string | null
  } | null>(null)
  const isLoading = details == null
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)
  const [isCheckoutActive, setIsCheckoutActive] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successInfo, setSuccessInfo] = useState<{ amountPaise: number; paymentId?: string } | null>(null)
  const [isPaying, setIsPaying] = useState(false)
  const { setActiveItem } = useSidebar()
  const getFlagSrc = () => {
    const country =
      details?.billingAddress && typeof details.billingAddress === "object"
        ? (details.billingAddress as { country?: string }).country
        : undefined
    const code = (country || "").toLowerCase()
    if (code === "in") return "/flags/india.svg"
    if (code === "us") return "/flags/usa.svg"
    if (code === "gb" || code === "uk") return "/flags/uk.svg"
    if (code === "ca") return "/flags/canada.svg"
    if (code === "au") return "/flags/australia.svg"
    return "/flags/worldwide.svg"
  }
  useEffect(() => {
    ; (async () => {
      try {
        const cached = getCachedBillingDetails()
        if (cached) {
          setDetails(cached)
        } else {
          const res = await getBillingDetails()
          setDetails(res)
        }
      } catch { }
      try {
        const sub = await getSubscriptionMe()
        const trial = sub?.subscription?.isFreeTrial === true
        setIsFreeTrial(trial)
        setCreditType(trial ? "free" : "prepaid")
      } catch { }
    })()
  }, [])
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setIsRazorpayLoaded(true)
    script.onerror = () => setIsRazorpayLoaded(false)
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])
  const handleMakePayment = async () => {
    setIsPaying(true)
    try {
      const email = details?.billingEmail || ""
      const contact =
        (details?.billingAddress && typeof details.billingAddress === "object"
          ? (details?.billingAddress as { phoneNumber?: string }).phoneNumber
          : undefined) || ""
      const amountPaise = Math.round(totalCost * 100)
      const token = await getAccessToken()
      const response = await fetch(`${API_BASE_URL}/billing/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          email,
          contact,
          planCode: "CREDITS",
          receipt: `credits_${Date.now()}`
        })
      })
      const result = await response.json()
      if (!result?.success || !result?.orderId) {
        alert(result?.error || "Failed to create payment order")
        setIsPaying(false)
        return
      }
      if (!isRazorpayLoaded || !(window as any).Razorpay) {
        alert("Payment gateway not ready. Please try again in a moment.")
        setIsPaying(false)
        return
      }
      const options = {
        key: "rzp_live_RhvHwqmzLiw3HA",
        amount: result.amount,
        currency: result.currency,
        name: "LoopSync",
        description: "LoopSync Credits Purchase",
        order_id: result.orderId,
        modal: { ondismiss: () => { setIsCheckoutActive(false); setIsPaying(false) } },
        handler: async function (resp: any) {
          try {
            const amountPaise = Math.round(totalCost * 100)
            if (email && amountPaise > 0) {
              const addType: "prepaid" | "free" = isFreeTrial ? "free" : "prepaid"
              await addCredits({
                email,
                type: addType,
                amount: amountPaise,
                reason: "Credit Top-up",
                referenceId: resp?.razorpay_payment_id || result.orderId || `CREDITS_${Date.now()}`
              })
              try {
                await createInvoice({
                  type: "SINGLE_PURCHASE",
                  amount: amountPaise,
                  currency: "INR",
                  paymentProvider: "RAZORPAY",
                  paymentReferenceId: resp?.razorpay_payment_id,
                  status: "PAID",
                })
              } catch { }
            }
            setSuccessInfo({ amountPaise, paymentId: resp?.razorpay_payment_id })
            setShowSuccess(true)
          } catch {
            setSuccessInfo({ amountPaise: Math.round(totalCost * 100), paymentId: resp?.razorpay_payment_id })
            setShowSuccess(true)
          }
          setIsCheckoutActive(false)
          setIsPaying(false)
        },
        prefill: { email, contact },
        theme: { color: "#000000" }
      }
      const RZP = (window as unknown as { Razorpay: new (opts: any) => { open: () => void; on?: (event: string, cb: (data: any) => void) => void } }).Razorpay
      const rzp = new RZP(options)
      if (typeof (rzp as any).on === "function") {
        (rzp as any).on("payment.failed", async (response: any) => {
          try {
            const amountPaise = Math.round(totalCost * 100)
            await createInvoice({
              type: "SINGLE_PURCHASE",
              amount: amountPaise,
              currency: "INR",
              paymentProvider: "RAZORPAY",
              paymentReferenceId: response?.error?.metadata?.payment_id || response?.error?.payment_id,
              status: "FAILED",
            })
          } catch { }
        })
      }
      setIsCheckoutActive(true)
      rzp.open()
    } catch {
      alert("An error occurred while initiating payment.")
      setIsCheckoutActive(false)
      setIsPaying(false)
    }
  }

  return (
    <div className="flex-1 bg-background relative overflow-auto scrollbar-hide">
      {isCheckoutActive && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all"></div>
      )}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-center">Payment Successful</DialogTitle>
            <DialogDescription className="text-white/70 text-center">
              {successInfo ? `Added ${formatINR(successInfo.amountPaise / 100)} to your ${creditType} credits.` : "Credits updated."}
            </DialogDescription>
          </DialogHeader>
          {successInfo?.paymentId && (
            <div className="text-xs text-white/50 text-center">
              Reference: {successInfo.paymentId}
            </div>
          )}
          <div className="mt-4">
            <div className="flex justify-center">
              <Button
                className="bg-white text-black rounded-full text-center align-middle font-semibold"
                onClick={() => {
                  setShowSuccess(false)
                  setIsCheckoutActive(false)
                  invalidateBillingOverviewCache()
                  setActiveItem("dashboard")
                }}
              >
                Done
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>
      <div className="px-4 md:px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text-white">Credit Store</p>
      </div>

      <div className="px-4 md:px-8 xl:px-12 mt-4 mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-black/80 backdrop-blur-xl border border-white/5">
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(0, 0, 0, 0.73) 100%), repeating-linear-gradient(135deg, rgba(0, 0, 0, 0.04) 0px, rgba(0, 0, 0, 0.04) 1px, transparent 2px)"
            }}
          />

          <div className="relative p-8 md:p-12">
            {/* Display selected credits + cost */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <span>Credits to Purchase</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center w-5 h-5 mt-1 rounded-full cursor-help">
                      <Info className="w-3.5 h-3.5 text-white/50" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white font-semibold text-black rounded-xl w-84 shadow-lg border border-black/10">
                    Credits purchased under a plan remain valid only for that plan and are not transferable or scalable.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-right">
                <div className="text-white text-3xl font-semibold">{formatINR(totalCost)}</div>
              </div>
            </div>

            {/* Slider */}
            <div className="bg-white/5 border border-white/10 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between text-white/60 text-xs mb-2">
                <span>~{MIN_CREDITS} requests</span>
                <span>~{MAX_CREDITS} requests</span>
              </div>

              <div className="relative w-full h-7 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${percent}%` }}
                />

                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-transparent transition-all duration-300 ease-out"
                  style={{ left: `calc(${percent}% - 10px)` }}
                />

                <input
                  type="range"
                  min={MIN_CREDITS}
                  max={MAX_CREDITS}
                  step={STEP}
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-1">
                  {Array.from({ length: 1 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-white/50 rounded-full" />
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-white text-xl font-semibold mb-1">Credit Purchase</h2>
              <p className="text-white/50 text-sm">
                Adjust the above slider to select how many credits you'd like to buy. Total
                price updates instantly.
              </p>
            </div>

            <div className="mt-8">
              <div className="bg-white/5 border border-white/10 p-6 space-y-6">
                {/* Title + Button Row */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <h3 className="text-white text-lg font-semibold">Billing</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-40">
                      <Select
                        value={creditType}
                        onValueChange={(v) => {
                          const allowed = isFreeTrial ? "free" : "prepaid"
                          setCreditType((v as "prepaid" | "free") === allowed ? allowed : allowed)
                        }}
                      >
                        <SelectTrigger className="rounded-full border border-white/10 bg-transparent text-white font-semibold px-3 py-2">
                          <SelectValue placeholder="prepaid" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prepaid" disabled={isFreeTrial === true}>Prepaid</SelectItem>
                          <SelectItem value="free" disabled={isFreeTrial === false}>Free</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-40">
                      <Button
                        disabled={isLoading || isPaying || isCheckoutActive}
                        className="relative overflow-hidden cursor-pointer bg-white text-black font-semibold px-6 py-3 rounded-full w-full hover:bg-white/90 transition-colors"
                        onClick={handleMakePayment}
                      >
                        {isPaying ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0c-4.418 0-8 3.582-8 8h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing…
                          </span>
                        ) : (
                          "Make Payment"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {/* <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Selected credits</span>
                    <span className="text-white text-sm font-medium">{credits}</span>
                  </div> */}
                  {/* <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Price per credit</span>
                    <span className="text-white text-sm font-medium">{formatINR(PRICE_PER_CREDIT)}</span>
                  </div> */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-white/70 text-sm">Total</span>
                    <span className="text-white text-lg font-semibold">{formatINR(totalCost)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 border-b border-white/10 pb-4 text-xs font-medium text-white/70">
                    <div className="font-semibold text-white text-base">Payment Method</div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center gap-4 flex-1">
                      <img src="payment/razorpay.png" alt="Razorpay" className="h-6 w-auto invert brightness-0 saturate-0" />
                      <span className="text-white">
                        ••••{" "}
                        {isLoading ? (
                          <span className="inline-block bg-white/5 animate-pulse rounded-full w-12 h-4 align-middle" />
                        ) : details?.paymentId ? (
                          String(details.paymentId).slice(-5)
                        ) : (
                          "-----"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-1">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/70">Default</span>
                    </div>
                    <div className="flex-1 text-white">
                      <span className="inline-flex items-center gap-2">
                        <img src={getFlagSrc()} alt="country" className="h-4 w-auto" />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      Verification Successful
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
