"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full px-4 pt-10 sm:px-6 border-t border-white/5 mt-20">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-center text-center">
                <div className="text-center text-white text-sm space-y-1 mb-14">
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
        </footer>
    );
}
