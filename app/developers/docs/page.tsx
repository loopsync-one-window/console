"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Search,
    Menu,
    ChevronRight,
    Book,
    Code2,
    Terminal,
    Cpu,
    Globe,
    Copy,
    Check,
    Box,
    ChevronDown,
    ArrowRight
} from "lucide-react";

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#d1aea0]/30 flex flex-col">

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4 group">
                        <img src="/resources/logo.svg" alt="LoopSync" className="h-7 w-auto brightness-200" />
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded bg-[#d1aea0]/10 border border-[#d1aea0]/20">
                                <Book className="w-4 h-4 text-[#d1aea0]" />
                            </div>
                            <span className="font-semibold text-sm tracking-wide text-white/90">Documentation</span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex relative max-w-sm w-64 group">
                        <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#d1aea0] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search docs..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-full pl-10 pr-4 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-[#d1aea0]/30 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <span className="text-[10px] text-zinc-600 border border-white/5 rounded px-1.5 py-0.5 bg-white/[0.02]">Ctrl</span>
                            <span className="text-[10px] text-zinc-600 border border-white/5 rounded px-1.5 py-0.5 bg-white/[0.02]">K</span>
                        </div>
                    </div>

                    <div className="h-4 w-[1px] bg-white/10 mx-2 hidden md:block"></div>

                    <Link href="/developers/console" className="hidden md:flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                        Go to Console <ArrowRight className="w-3 h-3" />
                    </Link>

                    <button
                        className="md:hidden p-2 text-zinc-400 hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 pt-16">

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed top-16 bottom-0 left-0 w-64 bg-[#050505] border-r border-white/5 overflow-y-auto z-40 transition-transform duration-300
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-6 space-y-8">

                        <NavGroup title="Getting Started">
                            <NavItem label="Introduction" active={activeSection === "introduction"} onClick={() => setActiveSection("introduction")} />
                            <NavItem label="Quick Start" />
                            <NavItem label="Authentication" />
                            <NavItem label="Errors" />
                        </NavGroup>

                        <NavGroup title="Core Concepts">
                            <NavItem label="Applications" />
                            <NavItem label="Workspaces" />
                            <NavItem label="Users & Teams" />
                            <NavItem label="Permissions" />
                        </NavGroup>

                        <NavGroup title="API Reference">
                            <NavItem label="Overview" />
                            <NavItem label="V1 Endpoints" badge="Legacy" />
                            <NavItem label="V2 Endpoints" badge="Latest" active={activeSection === "v2-endpoints"} onClick={() => setActiveSection("v2-endpoints")} />
                            <NavItem label="Webhooks" />
                        </NavGroup>

                        <NavGroup title="SDKs">
                            <NavItem label="Node.js" icon={<Terminal className="w-3 h-3" />} />
                            <NavItem label="Python" icon={<Code2 className="w-3 h-3" />} />
                            <NavItem label="Go" icon={<Box className="w-3 h-3" />} />
                        </NavGroup>

                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-0 md:ml-64 relative">
                    <div className="max-w-4xl mx-auto px-8 py-12 md:pr-64">

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-8 font-mono">
                            <span>Docs</span>
                            <ChevronRight className="w-3 h-3" />
                            <span>Getting Started</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-[#d1aea0]">Introduction</span>
                        </div>

                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Introduction</h1>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                Welcome to the LoopSync API documentation. Our API allows developers to build powerful integrations,
                                automate workflows, and extend the capabilities of the LoopSync platform.
                            </p>
                        </div>

                        {/* Content Blocks */}
                        <div className="space-y-12">

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">What is LoopSync?</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    LoopSync is a verifiable compute platform that enables developers to deploy applications with
                                    guaranteed execution integrity. By using our API, you can programmatically manage your deployments,
                                    monitor analytics, and handle payments.
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-2xl font-semibold text-white">Making your first request</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    All API requests must be authenticated using your API Key. You can find your key in the
                                    <Link href="/developers/console" className="text-[#d1aea0] hover:underline mx-1">Developer Console</Link>.
                                    Here is an example of how to fetch your user profile:
                                </p>

                                <CodeBlock
                                    language="bash"
                                    code={`curl -X GET https://api.loopsync.cloud/v2/user \\
  -H "Authorization: Bearer pk_live_837...98x2" \\
  -H "Content-Type: application/json"`}
                                />

                                <p className="text-zinc-400 leading-relaxed">
                                    The response will be a JSON object containing your user details:
                                </p>

                                <CodeBlock
                                    language="json"
                                    code={`{
  "id": "usr_829301",
  "name": "Ripun Basumatary",
  "email": "ripun@loopsync.cloud",
  "plan": "pro",
  "created_at": "2025-10-24T10:00:00Z"
}`}
                                />
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">Base URL</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    All API requests should be made to the following base URL:
                                </p>
                                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5 font-mono text-sm text-[#d1aea0]">
                                    https://api.loopsync.cloud/v2
                                </div>
                            </section>

                        </div>

                        {/* Pagination / Next Steps */}
                        <div className="mt-16 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div></div> {/* Spacer for alignment if no prev */}
                            <Link href="#" className="group p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors text-right">
                                <span className="text-xs text-zinc-500 mb-1 block">Next</span>
                                <div className="flex items-center justify-end gap-2 text-white font-medium group-hover:text-[#d1aea0] transition-colors">
                                    Authentication <ArrowRight className="w-4 h-4" />
                                </div>
                            </Link>
                        </div>

                    </div>

                    {/* Right TOC (Table of Contents) */}
                    <aside className="hidden lg:block w-64 fixed top-16 bottom-0 right-0 p-8 border-l border-white/5 overflow-y-auto">
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">On this page</h4>
                        <ul className="space-y-3 text-sm border-l border-white/10">
                            <TOCItem label="What is LoopSync?" active />
                            <TOCItem label="Making your first request" />
                            <TOCItem label="Base URL" />
                            <TOCItem label="Response Codes" />
                            <TOCItem label="Rate Limiting" />
                        </ul>
                    </aside>

                </main>
            </div>
        </div>
    );
}

// ------------------- Helper Components -------------------

function NavGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3">{title}</h3>
            <ul className="space-y-0.5">
                {children}
            </ul>
        </div>
    )
}

function NavItem({ label, active, badge, icon, onClick }: { label: string, active?: boolean, badge?: string, icon?: React.ReactNode, onClick?: () => void }) {
    return (
        <li>
            <button
                onClick={onClick}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${active
                    ? "text-[#d1aea0] bg-[#d1aea0]/10 font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}>
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{label}</span>
                </div>
                {badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${badge === 'Latest' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-amber-400 border-amber-500/20 bg-amber-500/10'
                        }`}>
                        {badge}
                    </span>
                )}
            </button>
        </li>
    )
}

function TOCItem({ label, active }: { label: string, active?: boolean }) {
    return (
        <li className={`pl-4 -ml-[1px] border-l-2 transition-colors cursor-pointer hover:border-zinc-500 hover:text-zinc-300 ${active
            ? "border-[#d1aea0] text-[#d1aea0]"
            : "border-transparent text-zinc-500"
            }`}>
            {label}
        </li>
    )
}

function CodeBlock({ code, language }: { code: string, language: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                <span className="text-xs text-zinc-500 font-mono lowercase">{language}</span>
                <button
                    onClick={handleCopy}
                    className="text-zinc-500 hover:text-white transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    )
}
