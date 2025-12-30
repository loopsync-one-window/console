"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { updateOnboardStatus } from "@/lib/api"
import { registerAtlasUserClient } from "@/lib/atlas-api"
import { registerCeresUserClient } from "@/lib/ceres-api"
import { getProfileMe } from "@/lib/api"
import { CreditCard, PanelsTopLeft, ChevronRightIcon } from "lucide-react"
import { AccessCode } from "./contents/access-code"
import { Usage } from "./contents/usage"
import AtlasManager from "./contents/atlas-manager"
import AnswerLogs from "./contents/answer-logs"
import RenderBill from "./contents/render-bill"
import Profile from "./contents/profile"
import Settings from "./contents/settings"
import { Dashboard } from "./contents/dashboard"
import { AllProducts } from "./contents/all-products"
import { Help } from "./contents/help"
import { useSidebar } from "./contexts/sidebar-contexts"
import GradientBlinds from "@/components/GradientBlinds"
import SyncCreditStore from "./contents/sync-credit-store"

export function ContentArea({ skipOnboarding = false }: { skipOnboarding?: boolean }) {
  const [showDashboard, setShowDashboard] = useState<boolean>(skipOnboarding || false)
  const [showTutorialModal, setShowTutorialModal] = useState(false)
  const { activeItem, setActiveItem } = useSidebar()
  const [shareCopied, setShareCopied] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Fetch user email on component mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const profile = await getProfileMe();
        setUserEmail(profile.email);
      } catch (error) {
        console.error("Failed to fetch user email:", error);
        // Fallback to a default email for testing purposes
        setUserEmail("user@example.com");
      }
    };

    fetchUserEmail();
  }, []);

  // If All Products is selected in sidebar, show the AllProducts component
  if (activeItem === "products") {
    return (
      <div className="flex-1 overflow-auto bg-background relative scrollbar-hide">
        <AllProducts />
      </div>
    )
  }

  // If API Keys is selected in sidebar, show the API Key component
  if (activeItem === "access-code") {
    return <AccessCode />
  }

  // If Usage is selected in sidebar, show the Usage component
  if (activeItem === "usage") {
    return <Usage />
  }

  // If Atlas Manager is selected in sidebar, show the AtlasManager component
  if (activeItem === "atlas-manager") {
    return <AtlasManager />
  }

  // If Answer Logs is selected in sidebar, show the AnswerLogs component
  if (activeItem === "collections") {
    return <AnswerLogs />
  }

  // If Billing is selected in sidebar, show the RenderBill component
  if (activeItem === "billing") {
    return <RenderBill />
  }

  // If Profile is selected in sidebar, show the Profile component
  if (activeItem === "my-profile") {
    return <Profile />
  }

  // If Settings is selected in sidebar, show the Settings component
  if (activeItem === "settings") {
    return <Settings />
  }

  // If Help is selected in sidebar, show the Help component
  if (activeItem === "help") {
    return <Help />
  }

  if (activeItem === "credit-store") {
    return <SyncCreditStore />
  }

  // If Dashboard is selected in sidebar, show Dashboard directly
  if (activeItem === "dashboard") {
    return <Dashboard />
  }

  // If dashboard should be shown, render it instead
  if (showDashboard) {
    return <Dashboard />
  }

  const steps = [
    {
      title: "Invite your friends",
      description: "",
      action: "Share",
      icon: CreditCard,
      completed: false,
    },
    {
      title: "Explore Sync Store",
      description: "",
      action: "Explore",
      icon: ChevronRightIcon,
      completed: false,
    },
    {
      title: "Capture your first request",
      description: "",
      action: null,
      icon: PanelsTopLeft,
      completed: false,
    },
  ]

  const handleShare = async () => {
    const fallback = "🥓 You're invited to LoopSync.\nDiscover Atlas and Ceres Assist - our flagship AI experiences. Visit `https://www.loopsync.cloud` "
    const copyViaClipboard = async (text: string) => {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      }
      const ta = document.createElement("textarea")
      ta.value = text
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      let ok = false
      try {
        ok = document.execCommand("copy")
      } catch { }
      document.body.removeChild(ta)
      return ok
    }
    try {
      await copyViaClipboard(fallback)
      try { await updateOnboardStatus(true) } catch { }

      // Register user with Atlas and Ceres APIs
      if (userEmail) {
        console.log("Registering user with Atlas and Ceres APIs:", userEmail);
        Promise.all([
          registerAtlasUserClient(userEmail).catch(err => console.error("Failed to register with Atlas:", err)),
          registerCeresUserClient(userEmail).catch(err => console.error("Failed to register with Ceres:", err))
        ]).then(() => {
          console.log("Successfully registered with Atlas and Ceres APIs");
        }).catch(err => console.error("Failed to register with services:", err));
      }
    } finally {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  return (
    <main className="flex-1 overflow-auto bg-background relative scrollbar-hide">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="w-full h-full">
          <GradientBlinds
            gradientColors={["#000000ff", "#000000ff", "#000000ff", "#000000ff"]}
            angle={120}
            noise={0.3}
            blindCount={10}
            blindMinWidth={50}
            spotlightRadius={0.45}
            spotlightSoftness={1.6}
            spotlightOpacity={0.6}
            mouseDampening={0.15}
            distortAmount={0.8}
            shineDirection="right"
            animateColors={false}
            transitionDuration={1500}
          />
        </div>
      </div>
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

      <div className="relative z-10 flex h-full items-center justify-center overflow-auto scrollbar-hide">
        {/* Left content section */}
        <div className="flex flex-col justify-center items-start px-10 py-12 max-w-screen-2xl">
          <h1 className="text-6xl font-bold mb-4 text-foreground">You're all set!</h1>
          <p className="text-base font-medium text-white leading-relaxed mb-6">
            Your account is ready. Feel free to move through <br />the next steps at your own pace.
          </p>
          <Button
            className="rounded-none font-semibold cursor-pointer border border-white/20 bg-white/5 text-white hover:bg-white/10"
            onClick={async () => {
              setShowDashboard(true)
              try { await updateOnboardStatus(true) } catch { }

              // Register user with Atlas and Ceres APIs
              if (userEmail) {
                console.log("Registering user with Atlas and Ceres APIs:", userEmail);
                Promise.all([
                  registerAtlasUserClient(userEmail).catch(err => console.error("Failed to register with Atlas:", err)),
                  registerCeresUserClient(userEmail).catch(err => console.error("Failed to register with Ceres:", err))
                ]).then(() => {
                  console.log("Successfully registered with Atlas and Ceres APIs");
                }).catch(err => console.error("Failed to register with services:", err));
              }
            }}
          >
            Continue to Dashboard
          </Button>
        </div>

        {/* Right checklist section */}
        <div className="w-90 flex items-center justify-center px-4">
          <div className="space-y-4 w-full">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-5 rounded-full border-2 border-white/5 border-border bg-sidebar/30 hover:bg-sidebar/50 transition-all duration-200 backdrop-blur-sm ${index === 2 ? "cursor-pointer" : ""
                  }`}
                onClick={
                  index === 1
                    ? async () => {
                      setActiveItem("products")
                      try { await updateOnboardStatus(true) } catch { }

                      // Register user with Atlas and Ceres APIs
                      if (userEmail) {
                        console.log("Registering user with Atlas and Ceres APIs:", userEmail);
                        Promise.all([
                          registerAtlasUserClient(userEmail).catch(err => console.error("Failed to register with Atlas:", err)),
                          registerCeresUserClient(userEmail).catch(err => console.error("Failed to register with Ceres:", err))
                        ]).then(() => {
                          console.log("Successfully registered with Atlas and Ceres APIs");
                        }).catch(err => console.error("Failed to register with services:", err));
                      }
                    }
                    : index === 2
                      ? async () => {
                        setShowDashboard(true)
                        try { await updateOnboardStatus(true) } catch { }

                        // Register user with Atlas and Ceres APIs
                        if (userEmail) {
                          console.log("Registering user with Atlas and Ceres APIs:", userEmail);
                          Promise.all([
                            registerAtlasUserClient(userEmail).catch(err => console.error("Failed to register with Atlas:", err)),
                            registerCeresUserClient(userEmail).catch(err => console.error("Failed to register with Ceres:", err))
                          ]).then(() => {
                            console.log("Successfully registered with Atlas and Ceres APIs");
                          }).catch(err => console.error("Failed to register with services:", err));
                        }
                      }
                      : undefined
                }
              >
                <div className="flex-shrink-0">
                  <step.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                </div>
                {step.action && (
                  <Button
                    variant="ghost"
                    size="default"
                    className="text-black cursor-pointer hover:text-accent-foreground font-medium h-6 px-4 py-3.5 bg-white hover:bg-white/90 hover:text-black rounded-full"
                    onClick={index === 0 ? handleShare : undefined}
                    style={index === 0 && shareCopied ? { animation: "popIn 250ms ease" } : undefined}
                  >
                    {index === 0 && shareCopied ? "Copied!" : step.action}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tutorial link with play icon - moved higher up for better visibility */}
      {/* <div className="relative z-10 flex justify-center -mt-35">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setShowTutorialModal(true)}
        >
          <div className="p-2 rounded-full border border-border bg-sidebar/30 group-hover:bg-sidebar/50 transition-colors">
            <Play className="h-4 w-4 text-foreground" />
          </div>
          <span className="text-sm text-white group-hover:text-foreground transition-colors">
            See how it works — LoopSync (Atlas) Cloud Console Extension Tutorial
          </span>
        </div>
      </div> */}

      {/* Tutorial Video Modal with Apple-like animation */}
      {showTutorialModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowTutorialModal(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 scale-95 opacity-0"
            style={{
              animation: 'modalEnter 0.3s forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white z-10 bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
              onClick={() => setShowTutorialModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/kx5brvlQvKQ?si=qW3_fG6cp-f5uXN2?autoplay=1"
                title="LoopSync Cloud Console Extension Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Add the keyframes for the animation */}
      <style jsx>{`
        @keyframes modalEnter {
          from {
            transform: scale(0.95) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes popIn {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
      `}</style>
    </main>
  )
}