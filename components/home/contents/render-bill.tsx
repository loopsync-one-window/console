import Billings from "../secure/billings";

export default function RenderBill() {
  return (
    <div className="h-full bg-background overflow-auto scrollbar-hide relative">
      {/* Watermark and Wave Pattern */}
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

      {/* Watermark Logo */}
      <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
        <img 
          src="/images/logo.png" 
          alt="LoopSync Logo Watermark" 
          className="h-100 w-auto"
        />
      </div>
      
      <div className="relative z-10">
        <Billings />
      </div>
    </div>
  )
}