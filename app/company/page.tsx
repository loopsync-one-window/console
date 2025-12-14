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
  CheckCircle
} from "lucide-react"
import Navbar from "@/components/NavBar"

export default function CompanyPage() {
  const companyInfo = {
    name: "Intellaris Private Limited",
    cin: "U62011AS2025PTC027817",
    incorporationDate: "18 March 2025",
    address: "Khaniram Boro Pathghy, Garchuk, Kamrup (Metro), Assam, India - 781035",
    status: "Active (non-government, private company limited by shares)",
    category: "Private limited company, company limited by shares, non-government company",
    authorisedCapital: "₹ 10XXXXXX",
    paidUpCapital: "₹ 10XXXXXX",
    email: "business@intellaris.co",
    phone: "+91 70994 50202",
    website: "www.intellaris.co"
  };

  const directors = [
    {
      name: "Ripun Basumatary",
      role: "Director",
      appointmentDate: "18 March 2025"
    },
    {
      name: "Veeshal D Bodosa",
      role: "Director",
      appointmentDate: "18 March 2025"
    }
  ];


  const whyChooseUs = [
    "Newly incorporated agile technology firm",
    "Based in Assam with global aspirations",
    "Focused on client-specific software solutions",
    "Dedicated team of experienced professionals",
    "Commitment to quality and innovation",
    "State-of-the-art facilities and infrastructure",
  ];

  return (
    <div className="min-h-screen bg-[#07080a] flex flex-col">
      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .glass-effect::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        .glass-effect:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }
        .glass-effect:hover::before {
          opacity: 1;
        }
        .logo-effect {
          filter: brightness(0) invert(1) brightness(1.5) contrast(1.2);
          animation: pulse 2s infinite;
          transition: all 0.3s ease;
        }
        .logo-effect:hover {
          filter: brightness(0) invert(1) brightness(1.7) contrast(1.3) drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }
        @keyframes pulse {
          0% {
            filter: brightness(0) invert(1) brightness(1.5) contrast(1.2);
          }
          50% {
            filter: brightness(0) invert(1) brightness(1.7) contrast(1.3);
          }
          100% {
            filter: brightness(0) invert(1) brightness(1.5) contrast(1.2);
          }
        }
      `}</style>
      {/* Added Navbar */}
      <Navbar />
      
      {/* Main content container with padding to account for fixed navbar */}
      <div className="pt-20 flex flex-col items-center justify-center px-4 flex-grow">
        {/* Background gradient effect */}
        <div className="absolute inset-0 opacity-60 pointer-events-none overflow-hidden">
          {/* Center blob — larger + lower */}
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-purple-800 rounded-full blur-[140px]" />

          {/* Left blob — bigger + more spread */}
          <div className="absolute top-1/2 left-1/5 w-[380px] h-[380px] bg-purple-800/30 rounded-full blur-[150px]" />

          {/* Right blob — bigger + spread */}
          <div className="absolute bottom-20 right-1/5 w-[420px] h-[420px] bg-purple-800/30 rounded-full blur-[150px]" />
        </div>

        {/* Content container */}
        <div className="relative z-10 w-full max-w-6xl flex flex-col mt-35 items-center justify-center">
          {/* Page Title */}
          <h1 className="text-6xl font-bold text-white mb-6 text-center">Intellaris Private Limited</h1>
          <p className="text-center text-white/70 text-lg mb-12 max-w-4xl leading-relaxed">
            We're a technology and fintech company committed to solving real-world problems through intelligent software and smart financial innovation - helping businesses operate with clarity, efficiency, and confidence.
          </p>

          {/* About Us Section */}
          <div className="w-full mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">About Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-transparent border border-white/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Company Overview</h3>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Intellaris Private Limited is a private limited company incorporated on March 18, 2025, 
                  in Assam, India. We are focused on delivering high-quality software development and 
                  programming services tailored to meet specific client requirements.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/70" />
                    <span className="text-[12px] text-white/70">Incorporated: {companyInfo.incorporationDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white/70" />
                    <span className="text-[12px] text-white/70">Based in Assam, India</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-transparent border border-white/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  To provide innovative and reliable software solutions that empower businesses to achieve 
                  their digital transformation goals through custom programming and development services.
                </p>
                <p className="text-white/80 text-sm">
                  As a newly incorporated agile technology firm, we bring fresh perspectives and 
                  cutting-edge approaches to software development challenges.
                </p>
              </div>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="w-full mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Leadership Team</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {directors.map((director, index) => (
                <div key={index} className="bg-transparent border border-white/10 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">{director.name}</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-2">{director.role}</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/70" />
                    <span className="text-[12px] text-white/70">Appointed: {director.appointmentDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Why Choose Us */}
          <div className="w-full mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Us</h2>
            <div className="bg-transparent border border-dashed border-white/10 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                    <span className="text-[13px] text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="w-full mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact Information</h2>
            <div className="bg-transparent border border-dashed border-white/10 rounded-lg p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-[12px] text-white/70">Email</p>
                    <a href={`mailto:${companyInfo.email}`} className="text-sm text-white hover:underline">
                      {companyInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-[12px] text-white/70">Phone</p>
                    <a href={`tel:${companyInfo.phone}`} className="text-sm text-white hover:underline">
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-[12px] text-white/70">Website</p>
                    <a href={`https://${companyInfo.website}`} className="text-sm text-white hover:underline" target="_blank" rel="noopener noreferrer">
                      {companyInfo.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full max-w-4xl mb-16">
            <div className="bg-transparent border border-white/10 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-2">Learn More About Our Us</h3>
                <p className="text-white/80 text-sm">
                  Discover how LoopSync Atlas can transform your digital content capture and analysis.
                </p>
              </div>
              <Link 
                href="https://intellaris.co" 
                className="flex items-center gap-2 text-black font-semibold bg-white hover:bg-white px-6 py-3 rounded-full text-sm transition-all border border-white/10 whitespace-nowrap"
              >
                View Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-16 w-full py-8 border-t border-white/10">
            {/* Center Content */}
            <div className="text-center text-white text-sm space-y-1">
            <p>
            © 2025{" "}
            <a
              href="https://www.intellaris.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline hover:font-bold cursor-pointer"
            >
              Intellaris Private Limited
            </a>
            . All rights reserved.
          </p>
              <p className="flex flex-wrap justify-center items-center gap-x-2 text-white/70">
                <a href="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span className="text-white/40">|</span>
                <a href="/policies/software-license" className="hover:text-white transition-colors">Software License</a>
                <span className="text-white/40">|</span>
                <a href="/policies/terms-of-use" className="hover:text-white transition-colors">Terms of Use</a>
                <span className="text-white/40">|</span>
                <a href="/policies/fair-use-policy" className="hover:text-white transition-colors">Fair Use Policy</a>
                <span className="text-white/40">|</span>
                <a href="/policies/refund-policy" className="hover:text-white transition-colors">Refund Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}