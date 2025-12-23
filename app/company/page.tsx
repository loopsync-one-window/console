"use client"

import Link from "next/link"
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Mail,
  Phone,
  Globe,
  User,
  ArrowRight,
  CheckCircle,
  ArrowUpRight
} from "lucide-react"
import Navbar from "@/components/NavBar"
import Image from "next/image"

export default function CompanyPage() {
  const companyInfo = {
    name: "Intellaris Private Limited",
    cin: "U62011AS2025PTC027817",
    incorporationDate: "18 March 2025",
    address: "Khaniram Boro Pathghy, Garchuk, Kamrup (Metro), Assam, India - 781035",
    status: "Active",
    email: "business@intellaris.co",
    phone: "+91 70994 50202",
    website: "www.intellaris.co"
  };

  const directors = [
    { name: "Ripun Basumatary", role: "Director" },
    { name: "Veeshal D Bodosa", role: "Director" }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 relative overflow-hidden">

      {/* Ambient Background - Clean Red/Rose Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-red-900/10 rounded-full blur-[120px] mix-blend-screen opacity-100" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-rose-900/5 rounded-full blur-[100px] mix-blend-screen opacity-100" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-red-950/20 rounded-full blur-[150px] mix-blend-screen opacity-100" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-[1200px] mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 backdrop-blur-md">
            <span>Incorporated 2025</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent pb-4">
            Intellaris
            <span className="block text-3xl md:text-5xl font-medium text-white/40 mt-2">Intelligence meets Polaris.</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-white leading-relaxed font-light">
            We're a technology and fintech company committed to solving real-world problems through intelligent software and smart financial innovation.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">

          {/* Mission Card - Large */}
          <div className="md:col-span-2 bg-[#000] border border-white/10 rounded-[32px] p-8 md:p-10 relative overflow-hidden group hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5">

            <div className="relative z-10 h-full flex flex-col justify-between space-y-8">
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-medium mb-3">Our Mission</h2>
                <p className="text-white/60 leading-relaxed text-balance">
                  To provide innovative and reliable software solutions that empower businesses to achieve their digital transformation goals. As a newly incorporated agile technology firm, we bring fresh perspectives and cutting-edge approaches.
                </p>
              </div>
            </div>
          </div>



          {/* Leadership Card - Founder Profile */}
          <div className="lg:row-span-2 bg-[#000] border border-white/10 rounded-[32px] p-8 overflow-hidden group hover:border-[#252527] transition-all duration-500 flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-medium mb-1">Leadership</h2>
              <p className="text-white/40 text-sm">Vision & Direction</p>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/founder/profile_me.png"
                  alt="Ripun Basumatary"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">Ripun Basumatary</h3>
                <p className="text-sm text-white font-medium mt-1">Founder & MD</p>
              </div>

              <div className="relative bg-white/5 rounded-2xl p-6 border border-white/5 mx-2">
                <p className="text-sm text-white/70 italic leading-relaxed font-light">
                  "At Intellaris, we are building the digital infrastructure for tomorrow. LoopSync is just the first step in our journey to simplify complex systems through elegant, intelligent design."
                </p>
                <div className="absolute top-0 left-0 w-4 h-4 text-white/20 -mt-2 -ml-2 text-4xl leading-none">"</div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>Founder Profile</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>Est. {companyInfo.incorporationDate}</span>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="md:col-span-2 bg-[#000] border border-white/10 rounded-[32px] p-8 md:p-10 group hover:border-white/20 transition-all duration-500">
            <h2 className="text-2xl font-medium mb-8">Why Intellaris?</h2>
            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
              {[
                "Agile technology firm",
                "Client-specific solutions",
                "Global aspirations",
                "State-of-the-art facilities",
                "Experienced professionals",
                "Quality & innovation"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Card - Moved Here */}
          <Link href="https://www.loopsync.cloud" target="_blank" className="md:col-span-3 bg-[#000] border border-white/10 rounded-[32px] p-8 flex flex-col justify-between group hover:border-white/20 transition-all duration-500 relative overflow-hidden block">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row h-full justify-between gap-8 items-center">
              <div>
                <h3 className="text-white/40 font-medium mb-4 uppercase tracking-wider text-xs">Our Product</h3>
                <h2 className="text-3xl font-medium text-white mb-2">LoopSync One Window™</h2>
                <div className="h-1 w-12 bg-white rounded-full mb-4"></div>
                <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                  LoopSync One Window is a flagship product designed and developed by <span className="text-white font-semibold">Intellaris Private Limited</span>.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Powered By</span>
                  <span className="text-sm font-semibold text-white/80">OnDust Engine</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-red-500/20 group-hover:border-red-500/50 transition-colors">
                  <ArrowUpRight className="w-6 h-6 text-white/70 group-hover:text-white" />
                </div>
              </div>
            </div>
          </Link>

          {/* Contact Card */}
          <div className="md:col-span-3 bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none -mr-20 -mt-20 group-hover:bg-red-500/40 transition-colors duration-700"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl font-medium mb-3">Get in touch</h2>
                <p className="text-white/50 max-w-md mb-8">
                  Based in Assam, India. Open to the world. Reach out to us for collaborations and inquiries.
                </p>

                <div className="flex flex-wrap gap-6">
                  <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10">
                    <Mail className="w-4 h-4" />
                    {companyInfo.email}
                  </a>
                  <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10">
                    <Phone className="w-4 h-4" />
                    {companyInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <a href="https://loopsync.cloud/one-window/support/resources" target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                  Connect
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <p className="text-white/30 text-xs text-right max-w-[250px] leading-relaxed">
                  {companyInfo.address}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-24 border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40">
          <p>© 2025 Intellaris Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/policies/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/policies/software-license" className="hover:text-white transition-colors">Software License</Link>
          </div>
        </footer>
      </main>
    </div>
  )
}