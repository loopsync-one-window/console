"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Info, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Dithering } from "@paper-design/shaders-react"

// Mock data for browsers
const mockBrowsers = [
  { id: "1", name: "Chrome", logo: "/browser/chrome.png", version: "5.2.9" },
  { id: "2", name: "Firefox", logo: "/browser/firefox.png", version: "5.2.9" },
]

// Mock data for products
const mockProducts = [
  {
    id: "1",
    name: "Atlas",
    version: "9.2.9",
    description: "Atlas helps you understand anything on your screen instantly. Press a shortcut, select a screen region, and get AI-powered answers in seconds. Customizable and powerful.",
    logo: "/apps/atlas.png",
    installed: false,
    isPaid: true,
    platform: "mac",
    addedAt: "2025-11-25",
    downloads: 12450
  },
  {
    id: "2",
    name: "Ceres Assist",
    version: "5.2.9",
    description: "Ceres Assist is an autonomous agentic browser assistant that works across tabs.",
    logo: "/apps/ceres.png",
    installed: false,
    isPaid: true,
    platform: "windows",
    addedAt: "2025-12-02",
    downloads: 8650
  },

]

const mockApps = [
  {
    id: "101",
    name: "Rage Platformer",
    version: "1.0.0",
    description: "A visually refined 2D platformer developed using Unreal Engine 5, combining tight controls, engaging level design, and fluid character movement.",
    logo: "/apps/daimond.png",
    installed: false,
    isPaid: false,
    platform: "windows",
    addedAt: "2025-12-07",
    downloads: 0,
  },
]

export function AllProducts() {
  const { toast } = useToast()
  const [products, setProducts] = useState(mockProducts)
  const [apps, setApps] = useState(mockApps)
  const [category, setCategory] = useState<"all" | "recent" | "popular">("all")
  const [platform, setPlatform] = useState<"all" | "mac" | "windows">("all")
  const [query, setQuery] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isManualModalOpen, setIsManualModalOpen] = useState(false) // New state for manual modal
  const [selected, setSelected] = useState<(typeof mockProducts)[number] | null>(null)
  const [notifyButtonText, setNotifyButtonText] = useState("Notify Me")
  const [installedProducts, setInstalledProducts] = useState<Record<string, boolean>>({})
  const [detectedBrowser, setDetectedBrowser] = useState<string | null>(null)
  const [selectedBrowser, setSelectedBrowser] = useState<string | null>(null)
  const [isInstallingGame, setIsInstallingGame] = useState(false)

  // Initialize without auto-detection
  useEffect(() => {
    setDetectedBrowser(null);
  }, []);

  const handleInstallExtension = (id: string) => {
    setProducts(products.map(ext =>
      ext.id === id ? { ...ext, installed: true } : ext
    ))

    const extension = products.find(ext => ext.id === id)
    if (extension) {
      toast({
        title: "Extension Add",
        description: `${extension.name} has been successfully added. Please select your browser to continue.`,
      })
      setInstalledProducts(prev => ({ ...prev, [id]: true }))
      // No auto-detection, let user manually select
      setDetectedBrowser(null);
    }
  }

  // Extract browser detection to a separate function so we can call it anytime
  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      return "Chrome";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return "Safari";
    } else if (userAgent.includes("Edg")) {
      return "Edge";
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      return "Opera";
    } else {
      return "Unknown";
    }
  };

  const handleUninstallExtension = (id: string) => {
    setProducts(products.map(ext =>
      ext.id === id ? { ...ext, installed: false } : ext
    ))

    const extension = products.find(ext => ext.id === id)
    if (extension) {
      toast({
        title: "Extension Uninstalled",
        description: `${extension.name} has been successfully uninstalled.`,
      })
    }
  }

  const handleInstallApp = (id: string) => {
    setApps(apps.map(app => (app.id === id ? { ...app, installed: true } : app)))

    const app = apps.find(a => a.id === id)
    if (app) {
      toast({
        title: "App Installed",
        description: `${app.name} has been successfully installed.`,
      })
    }
  }

  const handleUninstallApp = (id: string) => {
    setApps(apps.map(app => (app.id === id ? { ...app, installed: false } : app)))

    const app = apps.find(a => a.id === id)
    if (app) {
      toast({
        title: "App Uninstalled",
        description: `${app.name} has been successfully uninstalled.`,
      })
    }
  }

  const handleGameInstall = (id: string) => {
    setIsInstallingGame(true)

    try {
      // Trigger download
      const link = document.createElement("a");
      link.href = "https://loopsync-game-builds.s3.ap-south-1.amazonaws.com/Rage+Platformer.zip";
      link.download = "Rage Platformer.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed", e);
    }

    // Simulate install time
    setTimeout(() => {
      setIsInstallingGame(false)
      handleInstallApp(id)
    }, 5000)
  }

  return (
    <div className={`flex flex-col h-full bg-background ${isModalOpen ? 'blur-sm transition-[filter] duration-200' : ''}`}>

      {/* Page title */}
      <div className="px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text-white">Discover</p>
      </div>

      {/* Hero Section */}
      <div className="px-8 xl:px-12 mt-4 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-black/40 border border-white/5">
          {/* Dithering effect replacing the grid lines */}
          <div className="absolute inset-0">
            <Dithering
              style={{ height: "100%", width: "100%" }}
              colorBack="hsl(0, 0%, 0%)"
              colorFront="#3b31c9ff"
              shape={"cat" as any}
              type="4x4"
              pxSize={3}
              offsetX={0}
              offsetY={0}
              scale={0.8}
              rotation={0}
              speed={0.1}
            />
          </div>

          <div className="relative flex flex-col items-center text-center gap-6 p-10 md:p-16 min-h-[420px]">
            {/* Lottie Animation at bottom left */}
            {/* <div className="absolute bottom-[-2%] left-4 w-55 h-55">
        <Lottie animationData={santaAnimation} loop={true} autoPlay={true} />
      </div> */}

            {/* Centered Logo */}
            <img
              src="/icon.svg"
              alt="Icon"
              className="w-20 h-20 rounded-full shadow-lg"
            />

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Sync Store
            </h2>

            {/* Description */}
            <p className="text-white max-w-md">
              Get amazing extensions and the best apps for every task.
            </p>

            {/* Search Bar */}
            <div className="mt-2 w-full flex justify-center">
              <input
                type="text"
                placeholder="Search extensions and apps..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
            w-full max-w-md px-5 py-3 
            rounded-full
            bg-black/80 text-white
            border border-white/0
            shadow-[inset_0_0_12px_rgba(255,255,255,0.25)]
            placeholder:text-white/40
            outline-none
            transition-all
            focus:border-white/0
          "
              />
            </div>

          </div>
        </div>
      </div>





      {/* Cards section */}
      <div className="px-8 xl:px-12 pb-20">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 bg-black/80 text-white rounded-full border border-white/0 shadow-[inset_0_0_12px_rgba(255,255,255,0.25)] p-1">
            <button
              className={`px-4 py-2 rounded-full text-sm ${category === "all" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}
              onClick={() => setCategory("all")}
            >
              All Extensions
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${category === "recent" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}
              onClick={() => setCategory("recent")}
            >
              Recently Added
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${category === "popular" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}
              onClick={() => setCategory("popular")}
            >
              Most Popular
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-black/80 text-white rounded-full border border-white/0 shadow-[inset_0_0_12px_rgba(255,255,255,0.25)] p-1">
              <button
                className={`px-3 py-2 rounded-full text-sm ${platform === "all" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}
                onClick={() => setPlatform("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-2 rounded-full text-sm flex items-center gap-1 ${platform === "mac" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}
                onClick={() => setPlatform("mac")}
                aria-label="Mac"
              >
                <img src="/resources/apple.svg" alt="Apple" className="w-5 h-5 brightness-0 invert" />
              </button>
              <button
                className={`px-3 py-2 rounded-full text-sm flex items-center gap-1 ${platform === "windows" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}
                onClick={() => setPlatform("windows")}
                aria-label="Windows"
              >
                <img src="/resources/windows.svg" alt="Windows" className="w-4 h-4 brightness-0 invert" />
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
          {products
            .filter((p) => (platform === "all" ? true : (p as any).platform === platform))
            .filter((p) => (query ? p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()) : true))
            .sort((a, b) => {
              if (category === "recent") return new Date((b as any).addedAt).getTime() - new Date((a as any).addedAt).getTime()
              if (category === "popular") return (b as any).downloads - (a as any).downloads
              return 0
            })
            .slice(0, 3)
            .map((p, idx) => (
              <Card
                key={p.id + idx}
                className="relative overflow-hidden rounded-2xl 
                     border border-white/5 
                     bg-black/50 backdrop-blur-xl
                     hover:bg-black/60 transition-colors"
                onClick={() => { setSelected(p); setIsModalOpen(true) }}
              >
                {/* Soft highlight */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(60% 70% at 50% 55%, rgba(255,255,255,0.06), transparent)"
                  }}
                />

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/60">Featured</p>
                    {p.isPaid && (
                      <Badge variant="outline" className="text-white/80">Paid</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl ring-1 ring-white/10 shadow-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-white text-base flex items-center gap-2">
                          {p.name}
                          {(p.id === "1" || p.id === "2") && (
                            <img src="/verified/badge.svg" alt="Verified" className="w-4 h-4 brightness-0 invert" />
                          )}
                        </CardTitle>
                        <Badge variant="outline" className="text-white/70">v{p.version}</Badge>
                      </div>
                      <CardDescription className="text-white/70 mt-1 line-clamp-2">
                        {p.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center gap-2">
                        {p.installed ? (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-white text-black font-semibold rounded-full cursor-pointer !opacity-100"
                            onClick={(e) => e.preventDefault()}
                          >
                            Add
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleInstallExtension(p.id)}
                            className="bg-white text-black font-semibold rounded-full cursor-pointer"
                          >
                            Add
                          </Button>
                        )}
                        {p.name !== "Ceres Assist" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Close the current modal and open the manual modal
                              setIsModalOpen(false);
                              setIsManualModalOpen(true);
                            }}
                            className="text-white font-semibold rounded-full cursor-pointer"
                          >
                            Read Manual
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

        </div>

        {/* Apps section */}
        <div className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xl font-semibold text-white">Apps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
            {apps
              .filter((a) => (query ? a.name.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase()) : true))
              .slice(0, 3)
              .map((a, idx) => (
                <Card
                  key={a.id + idx}
                  className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/50 backdrop-blur-xl hover:bg-black/60 transition-colors"
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(60% 70% at 50% 55%, rgba(255,255,255,0.06), transparent)",
                    }}
                  />
                  {a.platform === "windows" && (
                    <img
                      src="/resources/windows.svg"
                      alt="Windows"
                      className="absolute top-3 right-3 w-5 h-5 brightness-0 invert opacity-100"
                    />
                  )}

                  <CardContent className="py-5">
                    <div className="flex items-start gap-4">
                      <img
                        src={a.logo}
                        alt={a.name}
                        className="w-14 h-14 rounded-xl ring-1 ring-white/10 shadow-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-white text-base flex items-center gap-2">
                            {a.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-white/70">v{a.version}</Badge>
                        </div>
                        <CardDescription className="text-white/70 mt-1 line-clamp-2">
                          {a.description}
                        </CardDescription>
                        <div className="mt-4 flex items-center gap-2">
                          {a.installed ? (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-white text-black font-semibold rounded-full cursor-pointer !opacity-100"
                              onClick={(e) => e.preventDefault()}
                            >
                              Install
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => a.id === "101" ? handleGameInstall(a.id) : handleInstallApp(a.id)}
                              className="bg-white text-black font-semibold rounded-full cursor-pointer"
                            >
                              Install
                            </Button>
                          )}
                          {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({ title: "Read Manual", description: `Learn how ${a.name} works` })
                      }
                      className="text-white font-semibold rounded-full cursor-pointer"
                    >
                      Read Manual
                    </Button> */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        <div className="mt-30">
          <div className="rounded-2xl bg-black/70 border border-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] px-8 py-10 text-center">
            <div className="mx-auto w-fit px-4 py-2 rounded-full bg-white/5 text-white/80 border border-white/10 text-xs tracking-wide">Preview</div>
            <p className="mt-4 text-2xl font-semibold text-white">More Coming Soon</p>
            <p className="mt-2 text-white/70 text-sm">We're curating more extensions and experiences. Stay tuned.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-black bg-white font-semibold border-white/20 backdrop-blur-sm
               hover:border-white/40 hover:bg-white/5 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)]
               transition-all duration-300"
                onClick={() => {
                  setNotifyButtonText("You are up to date");
                  setTimeout(() => {
                    setNotifyButtonText("Notify Me");
                  }, 2000);
                }}
              >
                {notifyButtonText}
              </Button>

              {/* <Button
  variant="outline"
  size="sm"
  className="rounded-full text-black bg-white font-semibold border-white/20 backdrop-blur-sm
             hover:border-white/40 hover:bg-white/5 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)]
             transition-all duration-300"
>
  Sell on LoopSync
</Button> */}


            </div>
          </div>
        </div>

      </div>



      {selected && (
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          // Reset states when dialog closes
          if (!open) {
            setSelectedBrowser(null);
          }
        }}>
          <DialogContent className="bg-black/70 border border-white/5 w-[40vw] max-w-[95vw] rounded-3xl backdrop-blur-xl p-0 max-w-4xl overflow-hidden">
            <div className="relative">
              <div className="p-6">
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <img src={selected.logo} alt={selected.name} className="w-14 h-14 rounded-xl ring-1 ring-white/10" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <DialogTitle className="text-white text-xl">{selected.name}</DialogTitle>
                        {(selected.id === "1" || selected.id === "2") && (
                          <img src="/verified/badge.svg" alt="Verified" className="w-4 h-4 brightness-0 invert" />
                        )}
                        <Badge variant="outline" className="text-white/70">v{selected.version}</Badge>
                      </div>
                      <DialogDescription className="text-white/70 mt-1">{selected.description}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              {/* Browser Grid Section - Only show after installation */}
              {selected && installedProducts[selected.id] && (
                <div className="px-6 pb-6">
                  <h3 className="text-white font-semibold mb-4">Select your browser to continue:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {mockBrowsers.map(browser => (
                      <Card
                        key={browser.id}
                        className={`relative overflow-hidden rounded-3xl border border-white/5 bg-black/50 backdrop-blur-xl transition-colors cursor-pointer ${selectedBrowser === browser.name
                          ? 'ring-2 ring-white/5 bg-white/5'
                          : 'hover:bg-black/60'
                          } ${(selected?.id === "1" && browser.name === "Chrome") ||
                            (selected?.id === "2" && browser.name === "Chrome") ||
                            (selected?.id === "2" && browser.name === "Firefox") ?
                            'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          // Disable click for unavailable browsers
                          if ((selected?.id === "1" && browser.name === "Chrome") ||
                            (selected?.id === "2" && browser.name === "Chrome") ||
                            (selected?.id === "2" && browser.name === "Firefox")) {
                            return;
                          }

                          // Set the selected browser to the one the user clicked on
                          setSelectedBrowser(browser.name);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className="relative">
                              <img
                                src={browser.logo}
                                alt={browser.name}
                                className="w-12 h-12 rounded-lg"
                              />
                              {selectedBrowser === browser.name && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <span className="text-white font-bold text-xl">{browser.name}</span>

                            {/* Add badges for unavailable browsers */}
                            {selected?.id === "1" && browser.name === "Chrome" && (
                              <Badge variant="outline" className="text-white/70 border-white/50">
                                Available in 72 hours
                              </Badge>
                            )}
                            {selected?.id === "2" && browser.name === "Chrome" && (
                              <Badge variant="outline" className="text-white/70 border-white/50">
                                Available in 72 hours
                              </Badge>
                            )}
                            {selected?.id === "2" && browser.name === "Firefox" && (
                              <Badge variant="outline" className="text-white/70 border-white/50">
                                Available in 72 hours
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {selectedBrowser && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          // Handle external links
                          if (selected?.id === "1" && selectedBrowser === "Firefox") {
                            // Open Firefox addon page for Atlas
                            window.open("https://addons.mozilla.org/en-US/firefox/addon/loopsync-atlas/", "_blank");
                            toast({
                              title: "Redirecting to Firefox Add-ons",
                              description: `You're being redirected to install ${selected?.name} for ${selectedBrowser}.`
                            });
                          } else {
                            toast({
                              title: "Extension Added",
                              description: `${selected?.name} has been added to ${selectedBrowser}.`
                            });
                          }
                          setIsModalOpen(false);
                        }}
                        className="bg-blue-500 text-white font-semibold rounded-full cursor-pointer hover:bg-blue-600"
                        disabled={
                          (selected?.id === "1" && selectedBrowser === "Chrome") ||
                          (selected?.id === "2" && selectedBrowser === "Chrome") ||
                          (selected?.id === "2" && selectedBrowser === "Firefox")
                        }
                      >
                        {((selected?.id === "1" && selectedBrowser === "Chrome") ||
                          (selected?.id === "2" && selectedBrowser === "Chrome") ||
                          (selected?.id === "2" && selectedBrowser === "Firefox"))
                          ? "Not Available Yet"
                          : `Add to ${selectedBrowser}`}
                      </Button>
                    </div>
                  )}

                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Separate Manual Modal */}
      {selected && (
        <Dialog open={isManualModalOpen} onOpenChange={(open) => {
          setIsManualModalOpen(open);
          // Reset states when dialog closes
          if (!open) {
            setSelectedBrowser(null);
          }
        }}>
          <DialogContent className="bg-black/40 border border-white/5 rounded-3xl backdrop-blur-xl p-0 w-[70vw] max-w-[95vw] h-[90vh] overflow-hidden">
            <div className="relative h-full flex flex-col">
              <div className="p-6 flex-shrink-0">
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <img src={selected.logo} alt={selected.name} className="w-14 h-14 rounded-xl ring-1 ring-white/10" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <DialogTitle className="text-white text-xl">{selected.name} User Manual</DialogTitle>
                        {(selected.id === "1" || selected.id === "2") && (
                          <img src="/verified/badge.svg" alt="Verified" className="w-4 h-4 brightness-0 invert" />
                        )}
                        <Badge variant="outline" className="text-white/70">v{selected.version}</Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              {/* Manual Section */}
              <div className="px-6 pb-6 flex-grow overflow-hidden flex flex-col">
                {/* Horizontal scrollable manual images */}
                <div className="overflow-x-auto pb-4 flex-grow" style={{ scrollbarWidth: 'thin' }}>
                  <div className="flex gap-8 h-full" style={{ minWidth: 'max-content' }}>
                    {/* Render all 10 manual pages separately */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <div key={num} className="flex-shrink-0" style={{ width: '900px' }}>
                        <img
                          src={`/atlas-user-manual/${num}.png`}
                          alt={`Manual page ${num}`}
                          className="w-full h-full object-contain border border-white/10 rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-lg border border-white/10">
                              <div class="text-center">
                                <p class="text-white text-xl mb-2">Manual Page ${num}</p>
                                <p class="text-white/70">Image not found: /atlas-user-manual/${num}.png</p>
                              </div>
                            </div>
                          `;
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-white/70 text-sm mt-4 text-center flex-shrink-0">
                  Scroll to view all pages of the manual
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Game Install Modal */}
      <Dialog open={isInstallingGame} onOpenChange={setIsInstallingGame}>
        <DialogContent className="bg-white border border-white/20 shadow-2xl max-w-md rounded-2xl [&>button]:hidden text-black"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}>
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
            <img
              src="/apps/daimond.png"
              alt="Rage Platformer"
              className="w-24 h-24 rounded-2xl shadow-2xl mb-8 ring-1 ring-black/5"
            />

            <div className="relative mb-6">
              <div className="h-8 w-8 rounded-full border-[3px] border-black/5"></div>
              <div className="absolute inset-0 h-8 w-8 rounded-full border-[3px] border-black border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Installing Rage Platformer</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Downloading and setting up files...
            </p>
          </div>
        </DialogContent>
      </Dialog>

    </div>

  )
}