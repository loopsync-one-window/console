"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { Dithering } from "@paper-design/shaders-react"
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Search,
  FileText,
  Shield,
  HelpCircle,
  Send,
  Loader2,
  Globe,
  Navigation,
  ArrowRight
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { submitContactSupport } from "@/lib/api"

// Accordion Component for FAQs/Docs
const AccordionItem = ({ title, icon, children, isOpen, onClick }: any) => {
  return (
    <div className="border border-white/5 rounded-lg bg-white/[0.02] backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-white/10 group">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-3.5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-white/50 group-hover:text-white/80 transition-colors">
            {icon}
          </div>
          <span className="font-medium text-white/80 text-sm group-hover:text-white transition-colors">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-3.5 pt-0 text-xs text-white/40 leading-relaxed font-light">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function SupportPage() {
  const [openItem, setOpenItem] = useState<string | null>("getting-started");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: ""
  });
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic) {
      alert("Please select a topic.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitContactSupport(formData.name, formData.email, formData.topic, formData.message);
      setFormData({ name: "", email: "", topic: "", message: "" });
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send support request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-screen bg-[#000000] text-white overflow-hidden relative font-sans selection:bg-white/20">
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-white text-black border-none sm:max-w-md p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold tracking-tight">Request Received</DialogTitle>
              <DialogDescription className="text-neutral-500 font-medium">
                We've received your support request and our team will get back to you shortly via email.
              </DialogDescription>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-black text-white rounded-full py-3 font-semibold text-sm hover:bg-neutral-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-2 h-screen">

        {/* Left Column: Query Form */}
        <div className="flex flex-col relative z-20 h-screen overflow-y-auto scrollbar-hide bg-black/95">
          {/* Header */}
          <div className="absolute top-0 left-0 w-full p-6 pl-12 flex items-center justify-between z-50">
            <div className="flex items-center gap-3 opacity-100 hover:opacity-100 transition-opacity cursor-default">
              <a
                className="flex items-center justify-center gap-2"
                href="/"
              >
                <img
                  src="/resources/logo.svg"
                  alt="LoopSync Logo"
                  className="h-9 w-auto brightness-150 contrast-125"
                />
              </a>
              <div className="h-3 w-[1px] bg-white/20" />
              <span className="text-xs font-mono uppercase tracking-widest text-white/50">Support</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center pl-12 pr-12 max-w-xl mx-auto w-full pt-12">
            <div className="mb-6 space-y-2">
              <h1 className="text-2xl font-medium tracking-tight text-white mb-1">Contact Support</h1>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                Connect with our team for assistance with your workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto w-full">
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2 group/input">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-all duration-300 font-medium tracking-wide"
                      placeholder="FULL NAME"
                    />
                  </div>
                  <div className="space-y-2 group/input">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-all duration-300 font-medium tracking-wide"
                      placeholder="EMAIL ADDRESS"
                    />
                  </div>
                </div>

                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Topic</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                      onBlur={() => setTimeout(() => setShowTopicDropdown(false), 200)}
                      className={`w-full bg-transparent border-b px-0 py-2.5 text-sm appearance-none focus:outline-none transition-all duration-300 font-medium tracking-wide text-left flex items-center justify-between group ${showTopicDropdown ? 'border-white' : 'border-white/20 focus:border-white'}`}
                    >
                      <span className={!formData.topic ? "text-neutral-500" : "text-white"}>
                        {formData.topic === "" && "Select a Topic"}
                        {formData.topic === 'general' && 'General Inquiry'}
                        {formData.topic === 'billing' && 'Billing & Subscription'}
                        {formData.topic === 'technical' && 'Technical Issue'}
                        {formData.topic === 'api' && 'API & Integration'}
                        {formData.topic === 'other' && 'Other'}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-neutral-600 transition-transform duration-300 ${showTopicDropdown ? 'rotate-180 text-white' : 'group-hover:text-white'}`} />
                    </button>

                    {/* Custom Dropdown Menu */}
                    <div className={`absolute left-0 right-0 top-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-200 z-50 origin-top ${showTopicDropdown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}>
                      <div className="p-1.5 space-y-0.5">
                        {[
                          { value: 'general', label: 'General Inquiry' },
                          { value: 'billing', label: 'Billing & Subscription' },
                          { value: 'technical', label: 'Technical Issue' },
                          { value: 'api', label: 'API & Integration' },
                          { value: 'other', label: 'Other' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onMouseDown={(e) => {
                              // Prevent blur from firing before click
                              e.preventDefault();
                            }}
                            onClick={() => {
                              setFormData({ ...formData, topic: option.value });
                              setShowTopicDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 flex items-center justify-between group/option ${formData.topic === option.value ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                          >
                            {option.label}
                            {formData.topic === option.value && (
                              <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 min-h-[40px] resize-none focus:outline-none focus:border-white transition-all duration-300 font-medium tracking-wide"
                    placeholder="Describe your issue..."
                  />
                </div>
              </div>

              <div className="pt-4 pb-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-neutral-200 disabled:opacity-70 disabled:hover:bg-white"
                >
                  <div className="flex items-center gap-2.5">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Processing</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Submit Request</span>
                        <Send className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between text-[10px] text-white/20 uppercase tracking-wider">
              <p>Intellaris Private Limited. © 2025</p>
              <div className="flex gap-4">
                <Link href="https://loopsync.cloud/policies/privacy-policy" className="hover:text-white/40 transition-colors">Privacy</Link>
                <Link href="https://loopsync.cloud/policies/terms-of-use" className="hover:text-white/40 transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visuals & Docs */}
        <div className="relative h-screen overflow-hidden bg-black flex flex-col z-10 border-l border-white/5">
          {/* Grayscale Dithering Background */}
          <div className="absolute inset-0 z-0 opacity-100">
            <Dithering
              style={{ height: "100%", width: "100%" }}
              colorBack="#000000"
              colorFront="#ccff00ff"
              shape={"cat" as any}
              type="4x4"
              pxSize={3.5}
              offsetX={0}
              offsetY={0}
              scale={0.8}
              rotation={0}
              speed={0.5}
            />
          </div>

          {/* Top Right Header Text */}
          <div className="absolute top-6 right-8 z-[1000] flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
            <span className="text-xs font-semibold text-white uppercase tracking-wider">LoopSync Support Console</span>
          </div>

          {/* Support Showcase */}
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-transparent backdrop-blur-3xl pointer-events-none">
            <div className="w-full max-w-xl">
              <div className="text-white py-20 px-6 flex flex-col items-center relative">
                <div className="text-center mb-10 relative z-20">
                  <h1 className="text-5xl font-bold mb-2">One Window<sup className="text-sm ml-2 align-super">TM</sup></h1>
                  <p className="text-white font-semibold text-xl tracking-wide">Support Intelligence.</p>



                  <p className="text-white/80 text-lg mt-4 max-w-3xl mt-20 mx-auto leading-relaxed font-light">
                    "Experience support that moves at the <span className="text-white font-bold italic">speed of thought</span>
                    <br />driven by <span className="text-white font-bold italic">One Window Intelligence</span>."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
