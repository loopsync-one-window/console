import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"

const articles = {
  "intelligent-capture": {
    title: "Intelligent Capture",
    description: "Capture any content with AI-powered understanding and context awareness.",
    gradientColors: ["#0f1629", "#1e3a8a", "#2563eb", "#1d4ed8"],
    sections: [
      { heading: "Overview", body: "LoopSync captures text, code, and rich content while preserving author intent, layout, and structure. It anchors each capture to a session and timeline so follow‑ups remain grounded in original context." },
      { heading: "Input Types", body: "Capture supports plain text, code blocks, screenshots, and file metadata. Each input is normalized, hashed, and enriched with shallow semantics to drive fast indexing and accurate retrieval." },
      { heading: "Model Guidance", body: "Models receive structured context headers that describe provenance, capture tags, and inferred subject matter. This boosts relevance in answers and reduces hallucinations." },
      { heading: "Organization", body: "Use tags and lightweight notes to cluster related captures. Collections group sessions and make it easy to scan summaries, sources, and linked responses." },
      { heading: "Best Practices", body: "Capture dense sources early, include a short note, and tag with consistent labels. Prefer fewer, high‑quality captures over many fragmented ones." },
    ],
  },
  "smart-analysis": {
    title: "Smart Analysis",
    description: "Get deep insights and analysis of your captured content with advanced AI models.",
    gradientColors: ["#001a00", "#003300", "#00cc00", "#00ff00"],
    sections: [
      { heading: "Overview", body: "Analysis orchestrates multiple engines to examine captured material, derive structure, and generate verifiable conclusions. Outputs emphasize clarity and traceability." },
      { heading: "Parallel Reasoning", body: "OpenAI, Gemini, and Grok operate in parallel with cross‑checks. Divergences are highlighted and summarized to support confident decisions." },
      { heading: "Evidence", body: "Each claim links back to original sources. Inline citations and code references let you audit findings without leaving the workspace." },
      { heading: "Use Cases", body: "Debug complex codebases, review contracts, compare requirements, or synthesize research notes into action plans." },
      { heading: "Tuning", body: "Choose conservative mode for risk‑sensitive reviews or exploratory mode for broad discovery. Switch providers per task." },
    ],
  },
  "seamless-integration": {
    title: "Seamless Integration",
    description: "Connect with your favorite tools and workflows for maximum productivity.",
    gradientColors: ["#1a0000", "#330000", "#cc0000", "#ff0000"],
    sections: [
      { heading: "Overview", body: "Integrations connect storage, ticketing, CI, and analytics so work flows smoothly across teams and environments." },
      { heading: "Connectors", body: "Use webhooks and REST APIs to push captures and pull results. Map identities and permissions with your existing auth." },
      { heading: "Data Exchange", body: "JSON payloads preserve structure with minimal transformation. Versioned schemas reduce breaking changes during upgrades." },
      { heading: "Automation Hooks", body: "Trigger downstream jobs on capture, analysis, and approval events to keep pipelines consistent and auditable." },
      { heading: "Monitoring", body: "Emit activity logs for ingestion, processing, and delivery to integrate with observability stacks." },
    ],
  },
  "privacy-first": {
    title: "Privacy First",
    description: "Your data is encrypted and never shared without your explicit permission.",
    gradientColors: ["#300010", "#660033", "#cc3399", "#ff66cc"],
    sections: [
      { heading: "Overview", body: "Security is layered across transport, storage, and access. Keys are isolated, and sensitive fields are masked in logs." },
      { heading: "Access Control", body: "Role‑based policies define who can capture, analyze, and export. Approvals are recorded and can be audited later." },
      { heading: "Locality", body: "Choose data locality options to keep regulated information within approved regions." },
      { heading: "Retention", body: "Set retention windows per collection. Expired material is purged with verifiable deletion events." },
      { heading: "Compliance", body: "Operational practices align with enterprise requirements and are designed to support formal certification paths." },
    ],
  },
  "cross-platform": {
    title: "Cross-Platform",
    description: "Works seamlessly across desktop, mobile, and web applications.",
    gradientColors: ["#1a1a1a", "#2d2d2d", "#404040", "#595959"],
    sections: [
      { heading: "Overview", body: "Interfaces are unified and accessible, with consistent commands and shortcuts across devices." },
      { heading: "Session Sync", body: "Preferences, tags, and recent items sync automatically, keeping context when switching devices." },
      { heading: "Offline Mode", body: "Core capture remains available offline with queued uploads when connectivity returns." },
      { heading: "Performance", body: "Incremental rendering and streaming responses keep the UI responsive under heavy workloads." },
      { heading: "Accessibility", body: "Keyboard navigation and scalable typography improve readability and productivity." },
    ],
  },
  "advanced-automation": {
    title: "Advanced Automation",
    description: "Set up custom workflows and automations to save time and reduce manual work.",
    gradientColors: ["#331a00", "#663300", "#cc6600", "#ff9900"],
    sections: [
      { heading: "Overview", body: "Automations chain capture, analysis, review, and export with clear checkpoints and notifications." },
      { heading: "Workflow Design", body: "Compose steps with conditions, retries, and timeouts to handle real‑world variability." },
      { heading: "Templates", body: "Start from templates for code review, contract analysis, onboarding guides, and support summaries." },
      { heading: "Review Gates", body: "Insert human approvals where necessary. Accepted changes propagate automatically to downstream steps." },
      { heading: "Examples", body: "Build routines to ingest new repositories, produce QA summaries, and publish weekly reports." },
    ],
  },
} as const

export default async function SupportArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = (articles as Record<string, any>)[id] || {
    title: "Support",
    description: "Details and guidance.",
    gradientColors: ["#0f1629", "#1e3a8a", "#2563eb", "#1d4ed8"],
    sections: [{ heading: "Details", body: "Content will be available soon." }],
  }
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="mt-20 relative w-full h-[400px]">
        <div className="absolute inset-0">
          <GradientBlinds
            gradientColors={article.gradientColors}
            angle={45}
            noise={0.2}
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
          <div className="max-w-5xl">
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <p className="text-black/70 mt-2">{article.description}</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="prose prose-lg max-w-none">
          {article.sections.map((s: { heading: string; body: string }, i: number) => (
            <section key={i} className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">{s.heading}</h2>
              <p className="text-[15px] leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
