import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"

export default function SupportResourcesWorking() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="mt-20 relative w-full h-[400px]">
        <div className="absolute inset-0">
          <GradientBlinds
            gradientColors={["#0f1629", "#1e3a8a", "#2563eb", "#1d4ed8"]}
            angle={45}
            noise={0.22}
            blindCount={12}
            blindMinWidth={40}
            spotlightRadius={0.35}
            spotlightSoftness={1.4}
            spotlightOpacity={0.35}
            mouseDampening={0.12}
            distortAmount={0.6}
            shineDirection="right"
            mixBlendMode="normal"
            animateColors={false}
            transitionDuration={1500}
          />
        </div>
        <div className="relative z-10 h-full flex items-center px-6">
          {/* <div className="max-w-5xl">
            <h1 className="text-3xl text-white font-bold">Resources</h1>
            <p className="text-white mt-2">Working on it</p>
          </div> */}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border border-black/10 shadow-2xl rounded-2xl p-8">
          <div className="text-xl font-semibold">We’re building this experience</div>
          <p className="text-black/70 mt-2">
            This section will host curated documentation, guides, and downloadable assets.
            Please check back soon.
          </p>
        </div>
      </div>
    </div>
  )
}
