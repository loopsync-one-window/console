"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { getAtlasUsageStatusClient, type AtlasUsageStatusResponse } from "@/lib/atlas-api"
import { getCeresUsageStatusClient, type CeresUsageStatusResponse } from "@/lib/ceres-api"
import { useSidebar } from "@/components/home/contexts/sidebar-contexts"

export function Usage() {
  const { toast } = useToast()
  const { setActiveItem } = useSidebar()
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<{
    id: string
    name: string
    logo: string
    platform: string
    total: number
    consumed: number
  } | null>(null)
  const [requestAmount, setRequestAmount] = useState(1000)
  const [usageData, setUsageData] = useState<AtlasUsageStatusResponse | null>(null)
  const [ceresUsageData, setCeresUsageData] = useState<CeresUsageStatusResponse | null>(null)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          let email = ""
          try {
            const raw = localStorage.getItem("user")
            if (raw) {
              const u = JSON.parse(raw) as { email?: string }
              email = u?.email || ""
            }
          } catch { }
          if (email) {
            const data = await getAtlasUsageStatusClient(email)
            if (mounted) setUsageData(data)
          } else {
            const zero: AtlasUsageStatusResponse = {
              email: "",
              channel: "Atlas",
              usage: {
                openai: { consumedRequests: 0, burnRate: 0 },
                gemini: { consumedRequests: 0, burnRate: 0 },
                grok: { consumedRequests: 0, burnRate: 0 },
              },
              totalConsumedRequests: 0,
              totalBurnRate: 0,
            }
            if (mounted) setUsageData(zero)
          }
        } catch (err) {
          // toast({ title: "Failed to load usage", description: err instanceof Error ? err.message : String(err) })
          const zero: AtlasUsageStatusResponse = {
            email: "",
            channel: "Atlas",
            usage: {
              openai: { consumedRequests: 0, burnRate: 0 },
              gemini: { consumedRequests: 0, burnRate: 0 },
              grok: { consumedRequests: 0, burnRate: 0 },
            },
            totalConsumedRequests: 0,
            totalBurnRate: 0,
          }
          if (mounted) setUsageData(zero)
        }
      })()
      ; (async () => {
        try {
          let email = ""
          try {
            const raw = localStorage.getItem("user")
            if (raw) {
              const u = JSON.parse(raw) as { email?: string }
              email = u?.email || ""
            }
          } catch { }
          if (email) {
            const data = await getCeresUsageStatusClient(email)
            if (mounted) setCeresUsageData(data)
          } else {
            const zero: CeresUsageStatusResponse = {
              email: "",
              channel: "ceres",
              totalConsumedRequests: 0,
              totalBurnRate: 0,
            }
            if (mounted) setCeresUsageData(zero)
          }
        } catch (err) {
          // toast({ title: "Failed to load usage", description: err instanceof Error ? err.message : String(err) })
          const zero: CeresUsageStatusResponse = {
            email: "",
            channel: "ceres",
            totalConsumedRequests: 0,
            totalBurnRate: 0,
          }
          if (mounted) setCeresUsageData(zero)
        }
      })()
    return () => {
      mounted = false
    }
  }, [toast])

  const atlasCard: {
    id: string
    name: string
    logo: string
    platform: string
    total: number
    consumed: number
  } = {
    id: "atlas",
    name: "Atlas",
    logo: "/apps/atlas.png",
    platform: "mac",
    total: Infinity,
    consumed: usageData?.totalConsumedRequests || 0,
  }
  const burnRateRupees = ((usageData?.totalBurnRate || 0) / 100)
  const ceresCard: {
    id: string
    name: string
    logo: string
    platform: string
    total: number
    consumed: number
  } = {
    id: "ceres",
    name: "Ceres Assist",
    logo: "/apps/ceres.png",
    platform: "windows",
    total: Infinity,
    consumed: ceresUsageData?.totalConsumedRequests || 0,
  }
  const burnRateRupeesCeres = (ceresUsageData?.totalBurnRate || 0)

  const onPurchase = (appName: string) => {
    // toast({ title: "Credit Store", description: `Opening credits for ${appName}` })
    setActiveItem("credit-store")
    setPurchaseOpen(false)
  }

  const transactions = [
    { id: "TXN-9102", date: "2025-12-01", app: "Ceres Assist", requests: 2000, amount: "₹499.00", method: "Credit Card", status: "Completed" },
    { id: "TXN-9037", date: "2025-11-20", app: "Atlas", requests: 1000, amount: "₹249.00", method: "UPI", status: "Completed" },
    { id: "TXN-8974", date: "2025-11-05", app: "Ceres Assist", requests: 1500, amount: "₹379.00", method: "PayPal", status: "Completed" },
  ]

  return (
    <div className="flex-1 bg-background relative overflow-auto scrollbar-hide">
      <div className="px-4 md:px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text:white">Usage</p>
      </div>

      <div className="px-4 md:px-8 xl:px-12 mt-4 mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/5">
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 2px)",
            }}
          />
          <div className="relative p-6 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6">
            <img src="/resources/apple.svg" alt="Apple" className="w-10 h-10 brightness-0 invert" />
            <img src="/resources/windows.svg" alt="Apple" className="w-9 h-9 brightness-0 invert" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Sync Snapshot</h2>
              <p className="mt-1 text-white/70">Overview of your total requests, consumed, and quick purchase option.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 xl:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">
          <Card className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/50 backdrop-blur-xl hover:bg-black/60 transition-colors">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(60% 70% at 50% 55%, rgba(255,255,255,0.06), transparent)" }} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60">Active</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-white/80 font-semibold">Owned</Badge>
                  <img src="/resources/apple.svg" alt="Apple" className="w-4 h-4 brightness-0 invert" />
                  <img src="/resources/windows.svg" alt="Windows" className="w-3.5 h-3.5 brightness-0 invert" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-5">
              <div className="flex items-start gap-4">
                <img src={atlasCard.logo} alt={atlasCard.name} className="w-14 h-14 rounded-xl ring-1 ring-white/10 shadow-lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      {atlasCard.name}
                      <img src="/verified/badge.svg" alt="Verified" className="w-4 h-4" />
                    </CardTitle>
                  </div>
                  {/* <div className="mt-1">
                    <Badge variant="outline" className="text-white/70">Channel: <span className="font-semibold text-white uppercase">{usageData?.channel || "Atlas"}</span></Badge>
                  </div> */}
                  <CardDescription className="text-white/70 mt-1">
                    Request Limit: <span className="text-white font-semibold">Unlimited</span>
                  </CardDescription>
                  <CardDescription className="text-white/70 flex items-center gap-2">
                    <span>
                      Consumed: <span className="text-white font-semibold">{atlasCard.consumed.toLocaleString()}</span>
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center w-5 h-5 mt-1 rounded-full cursor-help">
                          <Info className="w-3.5 h-3.5 text-white/50" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-white font-semibold text-black rounded-xl w-64 shadow-lg border border-black/10">
                        Consumed usage is applied to your usage cap balance and does not imply requests limit.
                      </TooltipContent>
                    </Tooltip>
                  </CardDescription>
                  <div className="h-px w-18 bg-white/10 my-2" />
                  <CardDescription className="text-white/70 flex items-center gap-2 mt-1">
                    <span>
                      Burn Rate: <span className="text-white font-semibold">₹{burnRateRupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center w-5 h-5 mt-1 rounded-full cursor-help">
                          <Info className="w-3.5 h-3.5 text-white/50" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-white font-semibold text-black rounded-xl w-64 shadow-lg border border-black/10">
                        This rate shows the total cost of your consumed requests
                      </TooltipContent>
                    </Tooltip>
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onPurchase(atlasCard.name)}
                      className="bg-white text-black font-semibold hover:bg-white/90 rounded-full"
                    >
                      Add Prepaid Credits
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/50 backdrop-blur-xl hover:bg-black/60 transition-colors">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(60% 70% at 50% 55%, rgba(255,255,255,0.06), transparent)" }} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60">Active</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-white/80 font-semibold">Owned</Badge>
                  <img src="/resources/apple.svg" alt="Mac" className="w-3.5 h-3.5 brightness-0 invert" />
                  <img src="/resources/windows.svg" alt="Windows" className="w-3.5 h-3.5 brightness-0 invert" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-5">
              <div className="flex items-start gap-4">
                <img src={ceresCard.logo} alt={ceresCard.name} className="w-14 h-14 rounded-xl ring-1 ring-white/10 shadow-lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      {ceresCard.name}
                      <img src="/verified/badge.svg" alt="Verified" className="w-4 h-4" />
                    </CardTitle>
                  </div>
                  {/* <div className="mt-1">
                    <Badge variant="outline" className="text-white/70">Channel: <span className="font-semibold text-white uppercase">{ceresUsageData?.channel || "ceres"}</span></Badge>
                  </div> */}
                  <CardDescription className="text-white/70 mt-1">
                    Request Limit: <span className="text-white font-semibold">Unlimited</span>
                  </CardDescription>
                  <CardDescription className="text-white/70 flex items-center gap-2">
                    <span>
                      Consumed: <span className="text-white font-semibold">{ceresCard.consumed.toLocaleString()}</span>
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center w-5 h-5 mt-1 rounded-full cursor-help">
                          <Info className="w-3.5 h-3.5 text-white/50" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-white font-semibold text-black rounded-xl w-64 shadow-lg border border-white/10">
                        Consumed usage is applied to your usage cap balance and does not imply requests limit.
                      </TooltipContent>
                    </Tooltip>
                  </CardDescription>
                  <div className="h-px w-18 bg-white/10 my-2" />
                  <CardDescription className="text-white/70 flex items-center gap-2 mt-1">
                    <span>
                      Burn Rate: <span className="text-white font-semibold">₹{burnRateRupeesCeres.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center w-5 h-5 mt-1 rounded-full cursor-help">
                          <Info className="w-3.5 h-3.5 text-white/50" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-white font-semibold text-black rounded-xl w-64 shadow-lg border border-white/10">
                        This rate shows the total cost of your consumed requests
                      </TooltipContent>
                    </Tooltip>
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onPurchase(ceresCard.name)}
                      className="bg-white text-black font-semibold hover:bg-white/90 rounded-full"
                    >
                      Add Prepaid Credits
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <div className="px-8 xl:px-12 pb-20 mt-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Transaction History</h2>
          <Button variant="outline" size="sm" className="rounded-full text-white">View All</Button>
        </div>
        <Card className="bg-black/40 border-white/10">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>App</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-white/90">{t.date}</TableCell>
                    <TableCell className="text-white/90">{t.app}</TableCell>
                    <TableCell className="text-white/90">{t.requests.toLocaleString()}</TableCell>
                    <TableCell className="text-white/90">{t.amount}</TableCell>
                    <TableCell className="text-white/90">{t.method}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white">
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-white/80">{t.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div> */}

      <Dialog open={purchaseOpen} onOpenChange={setPurchaseOpen}>
        <DialogContent className="max-w-md rounded-2xl border-white/10 bg-black/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Purchase Extra Requests</DialogTitle>
            <DialogDescription>Select total requests to purchase and proceed to pay</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={selectedApp.logo} alt={selectedApp.name} className="w-13 h-13 rounded-full border border-white/5" />
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm flex items-center gap-1">
                    {selectedApp.name}
                    <img
                      src={
                        selectedApp.platform === "Windows"
                          ? "/resources/windows.svg"
                          : "/resources/apple.svg"
                      }
                      alt={selectedApp.platform}
                      className="w-4 h-4 brightness-0 invert"
                    />
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-white/80">{selectedApp.platform}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/80">Requests</p>
                  <p className="text-sm font-semibold text-white">{requestAmount.toLocaleString()}</p>
                </div>
                <input
                  type="range"
                  min={100}
                  max={100000}
                  step={100}
                  value={requestAmount}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setRequestAmount(v)
                  }}
                  className="w-full h-2 rounded-full cursor-pointer bg-white/10"
                />
                <div className="mt-1 text-xl font-semibold text-white">₹ <span className="font-bold text-3xl">{(requestAmount * 1.13).toLocaleString("en-IN")}</span></div>
              </div>

              <DialogFooter>
                <Button className="bg-white text-black font-semibold hover:bg-white/90 rounded-full">Pay ₹{(requestAmount * 1.13).toLocaleString("en-IN")}</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        [data-slot="dialog-overlay"] {
          background-color: rgba(0,0,0,0.3) !important;
          backdrop-filter: blur(12px) !important;
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 0.375rem;
          border-radius: 9999px;
          background: rgba(255,255,255,0.1);
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1rem;
          height: 1rem;
          border-radius: 9999px;
          background: #ffffff;
          border: none;
        }
        input[type="range"]::-moz-range-thumb {
          width: 1rem;
          height: 1rem;
          border-radius: 9999px;
          background: #ffffff;
          border: none;
        }
      `}</style>

      <div className="px-8 xl:px-12 pb-20 mt-12" />
    </div>
  )
}
