"use client"
import { useEffect, useState } from "react"
import { Ban, CheckCircle, Cross, MoreVertical } from "lucide-react"
import { getBillingDetails, getCachedBillingDetails, getInvoices, type InvoiceRow } from "@/lib/api"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Billings() {
  const [details, setDetails] = useState<{
    activePlan: string;
    startDate: string;
    endDate: string;
    amount: number;
    currency: string;
    billingEmail: string | null;
    billingAddress: unknown | null;
    paymentMethod: unknown | null;
    paymentId: string | null;
  } | null>(null)
  const [daysLeft, setDaysLeft] = useState<number>(0)
  const [invoices, setInvoices] = useState<InvoiceRow[] | null>(null)
  const [loadingInvoices, setLoadingInvoices] = useState<boolean>(false)
  const formatAddress = (addr: unknown) => {
    if (!addr || typeof addr !== 'object') return "-"
    const a = addr as { addressLine1?: string; addressLine2?: string; city?: string; state?: string; country?: string; pinCode?: string }
    const parts = [
      a.addressLine1,
      a.addressLine2,
      a.city,
      a.state,
      a.country,
      a.pinCode,
    ].filter(Boolean)
    return parts.join(', ')
  }

  const getFlagSrc = () => {
    const country = (details?.billingAddress && typeof details.billingAddress === 'object')
      ? (details.billingAddress as { country?: string }).country
      : undefined;
    const code = (country || '').toLowerCase();
    if (code === 'in') return '/flags/india.svg';
    if (code === 'us') return '/flags/usa.svg';
    if (code === 'gb' || code === 'uk') return '/flags/uk.svg';
    if (code === 'ca') return '/flags/canada.svg';
    if (code === 'au') return '/flags/australia.svg';
    return '/flags/worldwide.svg';
  }

  useEffect(() => {
    (async () => {
      try {
        const cached = getCachedBillingDetails()
        if (cached) {
          setDetails(cached)
          const end = new Date(cached.endDate).getTime()
          const now = Date.now()
          const ms = Math.max(0, end - now)
          setDaysLeft(Math.ceil(ms / (1000 * 60 * 60 * 24)))
        } else {
          const res = await getBillingDetails()
          setDetails(res)
          const end = new Date(res.endDate).getTime()
          const now = Date.now()
          const ms = Math.max(0, end - now)
          setDaysLeft(Math.ceil(ms / (1000 * 60 * 60 * 24)))
        }
      } catch { }
    })()
  }, [])
  useEffect(() => {
    (async () => {
      try {
        setLoadingInvoices(true)
        const res = await getInvoices({ page: 1, limit: 10 })
        setInvoices(res?.invoices || [])
      } catch {
        setInvoices([])
      } finally {
        setLoadingInvoices(false)
      }
    })()
  }, [])
  const isLoading = details == null
  return (
    <div className="flex-1 bg-background relative overflow-auto scrollbar-hide">
      <div className="px-4 md:px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text:white">Billing</p>
      </div>

      <div className="px-4 md:px-8 xl:px-12 pb-20 mt-10">
        {/* Invoiced Billing Section */}
        <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-6">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-semibold text-white">Invoiced billing</h2>
              <p className="text-base text-white/70">
                Automatically generate your monthly usage invoice
                <br />
                with spending capped at your set limit.
              </p>
            </div>
            <div className="flex flex-col items-end">
              <button className="rounded-full bg-white uppercase px-6 py-2 text-sm font-bold text-black">
                {isLoading ? <span className="inline-block bg-black/10 animate-pulse rounded-full w-16 h-5 align-middle" /> : (details?.activePlan || "FREE TRIAL")}
              </button>
              <p className="mt-2 text-sm text-white/70">Next billing period starts in {isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-12 h-4 align-middle" /> : <span className="font-bold text-white">{daysLeft}</span>} days</p>
            </div>
          </div>

          <div className="mb-6 border-t border-white/10 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative p-4 rounded-xl overflow-hidden">
                {/* Tilted Stripe Background */}
                <div className="absolute inset-0 h-full -z-10 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_6px,transparent_6px,transparent_12px)]"></div>
              </div>

              <div className="text-right">
                <p className="mb-2 text-sm text-white/70">
                  {isLoading
                    ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-32 h-4 align-middle" />
                    : (() => {
                      const start = new Date(details!.startDate).getTime()
                      const end = new Date(details!.endDate).getTime()
                      const days = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
                      return days >= 300 ? 'Annual Subscription' : 'Monthly Subscription'
                    })()
                  }
                </p>
                <p className="text-xl font-semibold text-white">₹ <span className="font-bold text-3xl">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-24 h-6 align-middle" /> : (details ? (details.amount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00")}</span></p>
              </div>
            </div>
          </div>

          {/* <div className="rounded-lg border border-white/10 bg-black/30 backdrop-blur-sm p-4">
          <p className="text-sm text-white/70">You have <span className="font-semibold text-white">₹25.00</span> remaining of your spend cap in this billing period</p>
        </div> */}
        </div>

        {/* Billing Details Section */}
        <div className="space-y-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 mt-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Billing details</h2>
            <TooltipProvider>
              <div className="flex gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-default" disabled aria-disabled="true">
                      Edit information
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white backdrop-blur-md border border-white/10 text-white rounded-full shadow-2xl px-3 py-2">
                    <span className="inline-flex text-black font-semibold items-center">
                      Not Applicable
                    </span>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-50 cursor-default"
                      disabled
                      aria-disabled="true"
                    >
                      Add payment method
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white backdrop-blur-md border border-white/10 text-white rounded-full shadow-2xl px-3 py-2">
                    <span className="inline-flex text-black font-semibold items-center">
                      Not Applicable
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          {/* Billing Info */}
          <div className=" pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-2 text-sm font-medium text-white/70">Billing email</p>
                <p className="text-white">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-40 h-5" /> : (details?.billingEmail || "-")}</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-white/70">Billing address</p>
                <p className="text-white uppercase">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-64 h-5" /> : (details?.billingAddress ? formatAddress(details.billingAddress) : "-")}</p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 border-b border-white/10 pb-4 text-xs font-medium text-white/70">
              <div className="font-semibold text-white text-base">Payment Method</div>
              {/* <div>Expiry</div>
            <div>Name</div>
            <div></div> */}
            </div>

            {/* VISA Card */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/5 bg-black/30 p-4">
              <div className="flex items-center gap-4 flex-1">
                <img
                  src="payment/razorpay.png"
                  alt="Razorpay"
                  className="h-6 w-auto invert brightness-0 saturate-0"
                />

                <span className="text-white">•••• {isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-12 h-4 align-middle" /> : (details?.paymentId ? String(details.paymentId).slice(-5) : '-----')}</span>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/70">
                  Default
                </span>
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

          {/* Latest Invoices */}
          <div className="space-y-4 pt-5">
            <div className="flex items-center justify-between px-4  backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Latest invoices</h3>
              {/* <button className="text-sm font-semibold text-white hover:underline">View all</button> */}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left font-medium text-white/70">Invoice ID</th>
                    <th className="px-4 py-3 text-left font-medium text-white/70">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-white/70">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-white/70">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-white/70">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingInvoices && (
                    <>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-40 h-5" /></td>
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-28 h-5" /></td>
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-24 h-5" /></td>
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-16 h-5" /></td>
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-16 h-5" /></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-40 h-5" /></td>
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-28 h-5" /></td>
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-24 h-5" /></td>
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-16 h-5" /></td>
                        <td className="px-4 py-4"><span className="inline-block bg-white/5 animate-pulse rounded-full w-16 h-5" /></td>
                      </tr>
                    </>
                  )}
                  {!loadingInvoices && invoices && invoices.length > 0 && invoices.map((inv) => (
                    <tr key={inv.invoiceNumber} className="border-b border-white/10 hover:bg-black/20">
                      <td className="px-4 py-4 text-white font-medium">{inv.invoiceNumber}</td>
                      <td className="px-4 py-4 text-white/70">{inv.date}</td>
                      <td className="px-4 py-4 text-white/70">{inv.type}</td>
                      <td className="px-4 py-4 text-white">{inv.amount}</td>
                      <td className="px-4 py-4">
                        {inv.status === "Paid" ? (
                          <span className="inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">Paid</span>
                        ) : (
                          <span className="inline-block rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">Failed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!loadingInvoices && invoices && invoices.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-white/60" colSpan={5}>No invoices found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
