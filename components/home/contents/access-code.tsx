"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, CheckCheckIcon, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getProfileMe } from "@/lib/api"
import { getAtlasAccessCodeClient, getCachedAtlasAccessCode, updateAtlasAccessCodeClient, recoverAtlasAccessCodeClient } from "@/lib/atlas-api"
import { getCeresAccessCodeClient, getCachedCeresAccessCode, updateCeresAccessCodeClient, recoverCeresAccessCodeClient } from "@/lib/ceres-api"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { consumeBilling } from "@/lib/api"

export function AccessCode() {
  const { toast } = useToast()
  const [accessCode, setAccessCode] = useState("")
  const [showCode, setShowCode] = useState(false)
  const [appName, setAppName] = useState("")
  const [logoSrc, setLogoSrc] = useState("/apps/atlas.png")
  const [totalChangeCount, setTotalChangeCount] = useState("0")
  const [isChargable, setIsChargable] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isChangeOpen, setIsChangeOpen] = useState(false)
  const [changeLoading, setChangeLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [showNewCode, setShowNewCode] = useState(false)
  const [showDebit, setShowDebit] = useState(false)
  const [debitMessage, setDebitMessage] = useState("")
  const [debitPhase, setDebitPhase] = useState<"loading" | "success" | "error" | null>(null)
  const [providerName, setProviderName] = useState("atlas")
  const [isLoadingAccess, setIsLoadingAccess] = useState(true)
  const [ceresAccessCode, setCeresAccessCode] = useState("")
  const [showCeresCode, setShowCeresCode] = useState(false)
  const [ceresAppName, setCeresAppName] = useState("")
  const [ceresLogoSrc, setCeresLogoSrc] = useState("/apps/ceres.png")
  const [ceresTotalChangeCount, setCeresTotalChangeCount] = useState("0")
  const [ceresIsChargable, setCeresIsChargable] = useState(false)
  const [ceresIsBlocked, setCeresIsBlocked] = useState(false)
  const [ceresProviderName, setCeresProviderName] = useState("ceres")
  const [isLoadingCeres, setIsLoadingCeres] = useState(true)
  const [isCeresChangeOpen, setIsCeresChangeOpen] = useState(false)
  const [ceresChangeLoading, setCeresChangeLoading] = useState(false)
  const [showCeresNewCode, setShowCeresNewCode] = useState(false)
  const [ceresShowDebit, setCeresShowDebit] = useState(false)
  const [ceresDebitMessage, setCeresDebitMessage] = useState("")
  const [ceresDebitPhase, setCeresDebitPhase] = useState<"loading" | "success" | "error" | null>(null)
  

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getProfileMe()
        const userEmail = profile.email
        setEmail(userEmail)
        const atlasCached = getCachedAtlasAccessCode(userEmail)
        const ceresCached = getCachedCeresAccessCode(userEmail)
        ;(async () => {
          try {
            const atlasData = atlasCached ? atlasCached : await getAtlasAccessCodeClient(userEmail)
            setAccessCode(atlasData.currentAccessCode || "")
            setAppName(atlasData.appName || "Atlas")
            const provider = String(atlasData.provider || "atlas").toLowerCase()
            setProviderName(provider)
            setLogoSrc(provider === "atlas" ? "/apps/atlas.png" : "/apps/atlas.png")
            setTotalChangeCount(atlasData.totalChangeCount || "0")
            setIsChargable(Boolean(atlasData.isChargable))
            setIsBlocked(Boolean(atlasData.isBlocked))
          } catch {
            toast({ title: "Error", description: "Unable to load Atlas access code" })
          } finally {
            setShowCode(false)
            setIsLoadingAccess(false)
          }
        })()
        ;(async () => {
          try {
            const ceresData = ceresCached ? ceresCached : await getCeresAccessCodeClient(userEmail)
            setCeresAccessCode(ceresData.currentAccessCode || "")
            setCeresAppName(ceresData.appName || "Ceres Assist")
            const provider = String(ceresData.provider || "ceres").toLowerCase()
            setCeresProviderName(provider)
            setCeresLogoSrc(provider === "ceres" ? "/apps/ceres.png" : "/apps/ceres.png")
            setCeresTotalChangeCount(ceresData.totalChangeCount || "0")
            setCeresIsChargable(Boolean(ceresData.isChargable))
            setCeresIsBlocked(Boolean(ceresData.isBlocked))
          } catch {
            toast({ title: "Error", description: "Unable to load Ceres access code" })
          } finally {
            setShowCeresCode(false)
            setIsLoadingCeres(false)
          }
        })()
      } catch (e) {
        toast({ title: "Error", description: "Unable to load access code" })
      } finally {
        //
      }
    }
    load()
  }, [toast])

  const requestChange = () => {
    setIsChangeOpen(true)
  }
  const requestCeresChange = () => {
    setIsCeresChangeOpen(true)
  }

  const makeRequestId = () => `req_${Date.now()}_${Math.floor(Math.random() * 1000000)}`

  const handleAgree = async () => {
    if (!email) return
    setChangeLoading(true)
    try {
      // Close modal so overlays are visible
      setIsChangeOpen(false)
      if (isBlocked) {
        const reqId = makeRequestId()
        setDebitMessage("Processing ₹349.00 for Account Recovery")
        setDebitPhase("loading")
        setShowDebit(true)
        try {
          const res = await consumeBilling(email, 34900, "penalty.loopsync", reqId)
          if (!res?.success) {
            setDebitPhase("error")
            setDebitMessage(res?.message || "Insufficient Credits")
            toast({ title: "Payment failed", description: res?.message || "Insufficient Credits", variant: "destructive" })
            return
          }
        } catch (err: any) {
          setDebitPhase("error")
          setDebitMessage("Insufficient Credits")
          toast({ title: "Payment failed", description: "Insufficient Credits", variant: "destructive" })
          return
        }
        await new Promise((r) => setTimeout(r, 2000))
        setDebitPhase("success")
        await new Promise((r) => setTimeout(r, 1000))
        setShowDebit(false)
        const data = await recoverAtlasAccessCodeClient(email)
        setAccessCode(data.currentAccessCode || "")
        setTotalChangeCount(data.totalChangeCount || "0")
        setIsChargable(Boolean(data.isChargable))
        setIsBlocked(Boolean(data.isBlocked))
        setShowNewCode(true)
        setTimeout(() => setShowNewCode(false), 3000)
        toast({ title: "Recovered", description: "Your account access has been recovered." })
        return
      } else if (isChargable) {
        const reqId = makeRequestId()
        setDebitMessage("Processing ₹16.49 for Access Code Change")
        setDebitPhase("loading")
        setShowDebit(true)
        try {
          const res = await consumeBilling(email, 1649, "penalty.loopsync", reqId)
          if (!res?.success) {
            setDebitPhase("error")
            setDebitMessage(res?.message || "Insufficient Credits")
            toast({ title: "Payment failed", description: res?.message || "Insufficient Credits", variant: "destructive" })
            return
          }
        } catch (err: any) {
          setDebitPhase("error")
          setDebitMessage("Insufficient Credits")
          toast({ title: "Payment failed", description: "Insufficient Credits", variant: "destructive" })
          return
        }
        await new Promise((r) => setTimeout(r, 2000))
        setDebitPhase("success")
        await new Promise((r) => setTimeout(r, 1000))
        setShowDebit(false)
      }
      const data = await updateAtlasAccessCodeClient(email)
      setAccessCode(data.currentAccessCode || "")
      setTotalChangeCount(data.totalChangeCount || "0")
      setIsChargable(Boolean(data.isChargable))
      setIsBlocked(Boolean(data.isBlocked))
      setShowNewCode(true)
      setTimeout(() => setShowNewCode(false), 3000)
      toast({ title: "Updated", description: "Your access code has been changed." })
    } catch (e: any) {
      const msg = e?.message || "Unable to process change"
      toast({ title: "Failed", description: msg, variant: "destructive" })
    } finally {
      setChangeLoading(false)
    }
  }

  const handleCeresAgree = async () => {
    if (!email) return
    setCeresChangeLoading(true)
    try {
      setIsCeresChangeOpen(false)
      if (ceresIsBlocked) {
        const reqId = makeRequestId()
        setCeresDebitMessage("Processing ₹349.00 for Account Recovery")
        setCeresDebitPhase("loading")
        setCeresShowDebit(true)
        try {
          const res = await consumeBilling(email, 34900, "penalty.loopsync", reqId)
          if (!res?.success) {
            setCeresDebitPhase("error")
            setCeresDebitMessage(res?.message || "Insufficient Credits")
            toast({ title: "Payment failed", description: res?.message || "Insufficient Credits", variant: "destructive" })
            return
          }
        } catch (err: any) {
          setCeresDebitPhase("error")
          setCeresDebitMessage("Insufficient Credits")
          toast({ title: "Payment failed", description: "Insufficient Credits", variant: "destructive" })
          return
        }
        await new Promise((r) => setTimeout(r, 2000))
        setCeresDebitPhase("success")
        await new Promise((r) => setTimeout(r, 1000))
        setCeresShowDebit(false)
        const data = await recoverCeresAccessCodeClient(email)
        setCeresAccessCode(data.currentAccessCode || "")
        setCeresTotalChangeCount(data.totalChangeCount || "0")
        setCeresIsChargable(Boolean(data.isChargable))
        setCeresIsBlocked(Boolean(data.isBlocked))
        setShowCeresNewCode(true)
        setTimeout(() => setShowCeresNewCode(false), 3000)
        toast({ title: "Recovered", description: "Your Ceres access has been recovered." })
        return
      } else if (ceresIsChargable) {
        const reqId = makeRequestId()
        setCeresDebitMessage("Processing ₹16.49 for Access Code Change")
        setCeresDebitPhase("loading")
        setCeresShowDebit(true)
        try {
          const res = await consumeBilling(email, 1649, "penalty.loopsync", reqId)
          if (!res?.success) {
            setCeresDebitPhase("error")
            setCeresDebitMessage(res?.message || "Insufficient Credits")
            toast({ title: "Payment failed", description: res?.message || "Insufficient Credits", variant: "destructive" })
            return
          }
        } catch (err: any) {
          setCeresDebitPhase("error")
          setCeresDebitMessage("Insufficient Credits")
          toast({ title: "Payment failed", description: "Insufficient Credits", variant: "destructive" })
          return
        }
        await new Promise((r) => setTimeout(r, 2000))
        setCeresDebitPhase("success")
        await new Promise((r) => setTimeout(r, 1000))
        setCeresShowDebit(false)
      }
      const data = await updateCeresAccessCodeClient(email)
      setCeresAccessCode(data.currentAccessCode || "")
      setCeresTotalChangeCount(data.totalChangeCount || "0")
      setCeresIsChargable(Boolean(data.isChargable))
      setCeresIsBlocked(Boolean(data.isBlocked))
      setShowCeresNewCode(true)
      setTimeout(() => setShowCeresNewCode(false), 3000)
      toast({ title: "Updated", description: "Your Ceres access code has been changed." })
    } catch (e: any) {
      const msg = e?.message || "Unable to process change"
      toast({ title: "Failed", description: msg, variant: "destructive" })
    } finally {
      setCeresChangeLoading(false)
    }
  }

  return (
    <>
    <div className={"flex-1 bg-background relative overflow-auto scrollbar-hide"}>
      <div className="px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text-white">Access Code</p>
      </div>

      <div className="px-8 xl:px-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
          <Card
            className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/50 backdrop-blur-xl hover:bg-black/60 transition-colors"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(60% 70% at 50% 55%, rgba(255,255,255,0.06), transparent)" }}
            />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60">Primary</p>
                <Badge variant="outline" className="text-black bg-white font-semibold">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="py-5">
              <div className="flex items-start gap-4">
                <img src={logoSrc} alt="Access Code" className="w-14 h-14 rounded-xl ring-1 ring-white/10 shadow-lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white text-base">{appName || "Atlas"}</CardTitle>
                    {providerName === "atlas" && (
                      <img src="/verified/badge.svg" alt="Verified" className="w-4 h-4" />
                    )}
                    <Badge variant="outline" className="text-white/70">
                      {totalChangeCount === "0" ? "Newly Issued" : `RC#${totalChangeCount}`}
                    </Badge>
                  </div>
                  <CardDescription className="text-white font-bold mt-2 line-clamp-2">
                    {isLoadingAccess ? (
                      <span className="relative inline-block w-10 h-6 rounded-full overflow-hidden bg-white/10">
                        <span className="absolute inset-0 shimmer" />
                      </span>
                    ) : (
                      showCode ? accessCode : accessCode.replace(/./g, "*")
                    )}
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setShowCode(!showCode) }}
                      className="bg-white text-black font-semibold hover:bg-white/90 rounded-full"
                    >
                      {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showCode ? " Hide" : " Reveal"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); requestChange() }}
                      className="text-white font-semibold hover:bg-transparent cursor-pointer rounded-full"
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/50 backdrop-blur-xl hover:bg-black/60 transition-colors"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(60% 70% at 50% 55%, rgba(255,255,255,0.06), transparent)" }}
            />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60">Primary</p>
                <Badge variant="outline" className="text-black bg-white font-semibold">Active</Badge>
              </div>
            </CardHeader>
          <CardContent className="py-5">
            <div className="flex items-start gap-4">
              <img src={ceresLogoSrc} alt="Ceres Access Code" className="w-14 h-14 rounded-xl ring-1 ring-white/10 shadow-lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-white text-base">{ceresAppName || "Ceres Assist"}</CardTitle>
                  {ceresProviderName === "ceres" && (
                    <img src="/verified/badge.svg" alt="Verified" className="w-4 h-4" />
                  )}
                  <Badge variant="outline" className="text-white/70">
                    {ceresTotalChangeCount === "0" ? "Newly Issued" : `RC#${ceresTotalChangeCount}`}
                  </Badge>
                </div>
                <CardDescription className="text-white font-bold mt-2 line-clamp-2">
                  {isLoadingCeres ? (
                    <span className="relative inline-block w-10 h-6 rounded-full overflow-hidden bg-white/10">
                      <span className="absolute inset-0 shimmer" />
                    </span>
                  ) : (
                    showCeresCode ? ceresAccessCode : ceresAccessCode.replace(/./g, "*")
                  )}
                </CardDescription>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setShowCeresCode(!showCeresCode) }}
                    className="bg-white text-black font-semibold hover:bg-white/90 rounded-full"
                  >
                    {showCeresCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showCeresCode ? " Hide" : " Reveal"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); requestCeresChange() }}
                    className="text_white font-semibold hover:bg-transparent cursor-pointer rounded-full"
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <Dialog open={isChangeOpen} onOpenChange={setIsChangeOpen}>
      <DialogContent className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white mb-4">Confirm Change</DialogTitle>
          <DialogDescription className="text-white">
            You can change your access code up to <span className="font-bold text-white">3-4 times for free</span>. After that, each change costs <span className="font-bold text-white">₹16.49</span>. The maximum allowed changes is <span className="font-bold text-white">12</span>. Once this limit is reached, your account will be <span className="font-bold text-white">temporarily blocked</span>, and recovery may cost <span className="font-bold text-white">₹349</span>. Please keep your access code secure and classified.
          </DialogDescription>
        </DialogHeader>
        {isBlocked && (
          <div className="mt-2 text-red-400 font-semibold">Your account is currently blocked. Recovery incurs ₹349.00.</div>
        )}
        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => setIsChangeOpen(false)} disabled={changeLoading}>Cancel</Button>
          <Button className="bg-white text-black font-semibold rounded-full hover:bg-white/90" onClick={handleAgree} disabled={changeLoading}>
            {changeLoading ? "Processing..." : isBlocked ? "Recovery Access" : "Agree"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Dialog open={isCeresChangeOpen} onOpenChange={setIsCeresChangeOpen}>
      <DialogContent className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white mb-4">Confirm Change</DialogTitle>
          <DialogDescription className="text-white">
            You can change your access code up to <span className="font-bold text-white">3-4 times for free</span>. After that, each change costs <span className="font-bold text-white">₹16.49</span>. The maximum allowed changes is <span className="font-bold text-white">12</span>. Once this limit is reached, your account will be <span className="font-bold text-white">temporarily blocked</span>, and recovery may cost <span className="font-bold text-white">₹349</span>. Please keep your access code secure and classified.
          </DialogDescription>
        </DialogHeader>
        {ceresIsBlocked && (
          <div className="mt-2 text-red-400 font-semibold">Your account is currently blocked. Recovery incurs ₹349.00.</div>
        )}
        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => setIsCeresChangeOpen(false)} disabled={ceresChangeLoading}>Cancel</Button>
          <Button className="bg-white text-black font-semibold rounded-full hover:bg-white/90" onClick={handleCeresAgree} disabled={ceresChangeLoading}>
            {ceresChangeLoading ? "Processing..." : ceresIsBlocked ? "Recovery Access" : "Agree"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <NewCodeOverlay open={showNewCode} code={accessCode} />
    <NewCodeOverlay open={showCeresNewCode} code={ceresAccessCode} />
    <DebitOverlay open={showDebit} message={debitMessage} phase={debitPhase} onClose={() => { setShowDebit(false); setDebitPhase(null); setDebitMessage("") }} />
    <DebitOverlay open={ceresShowDebit} message={ceresDebitMessage} phase={ceresDebitPhase} onClose={() => { setCeresShowDebit(false); setCeresDebitPhase(null); setCeresDebitMessage("") }} />
    </>
  )
}

function NewCodeOverlay({ open, code }: { open: boolean; code: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center">
      <div className="bg-black/60 border border-white/10 rounded-2xl p-8 text-center transform transition-all duration-300 scale-100">
        <div className="text-5xl font-extrabold text-white tracking-widest">{code}</div>
        <div className="mt-3 text-white/80 font-semibold">Here's your new access code</div>
      </div>
    </div>
  )
}

function DebitOverlay({ open, message, phase, onClose }: { open: boolean; message: string; phase: "loading" | "success" | "error" | null; onClose?: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center">
      <div className="relative bg-black/60 border border-white/10 rounded-2xl p-8 text-center transform transition-all duration-300 scale-100">
        {phase === "error" && (
          <button aria-label="Close" onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10">
            <X className="w-4 h-4 text-white" />
          </button>
        )}
        <div className="text-lg font-semibold text-white/90 mt-4">{message || "Amount Debited"}</div>
        {phase === "loading" && (
          <div className="mt-4 w-10 h-10 border-4 border-white/60 border-t-transparent rounded-full animate-spin mx-auto" />
        )}
        {phase === "success" && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <CheckCheckIcon className="w-8 h-8 text-white" />
          </div>
        )}
        {phase === "error" && (
          <div className="mt-5 text-white px-4 py-2 rounded-full bg-red-900 text-center text-base font-semibold">Insufficient Credits</div>
        )}
      </div>
    </div>
  )
}
<style jsx>{`
  .shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.05) 100%);
    background-size: 200% 100%;
    animation: shimmerMove 1.2s linear infinite;
  }
  @keyframes shimmerMove {
    0% { background-position: -100% 0; }
    100% { background-position: 100% 0; }
  }
`}</style>
