"use client"

import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-[#07080a]">
            <Navbar />

            {/* Animated Gradient Background */}
            <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
                <GradientBlinds
                    gradientColors={["#0f1629", "#3f2b96", "#a8c0ff", "#2563eb"]}
                    angle={50}
                    noise={0.25}
                    blindCount={13}
                    blindMinWidth={50}
                    spotlightRadius={0.38}
                    spotlightSoftness={1.6}
                    spotlightOpacity={0.42}
                    mouseDampening={0.15}
                    distortAmount={0.8}
                    shineDirection="right"
                    mixBlendMode="overlay"
                    animateColors={false}
                    transitionDuration={2000}
                />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl mt-15 md:text-5xl font-bold text-white mb-4">
                            Cookie Policy
                        </h1>
                        <p className="text-lg text-white">
                            Last Updated: 01 Nov 2025
                        </p>
                    </div>

                    <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                        <div className="prose prose-invert max-w-none">
                            <p className="text-white/80 mb-6">
                                This Cookie Policy explains how Intellaris Private Limited ("Company," "we," "our," or "us") uses cookies and similar technologies (collectively, "Cookies") when you visit our website, use our applications, or interact with LoopSync – One Window (collectively, the "Service").
                            </p>

                            <p className="text-white/80 mb-6">
                                This policy provides detailed information about what Cookies are, why we use them, and your choices regarding their use.
                            </p>

                            <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. What are Cookies?</h2>
                            <p className="text-white/80 mb-4">
                                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners and service providers to make their websites work, or to work more efficiently, as well as to provide reporting information.
                            </p>
                            <p className="text-white/80 mb-6">
                                Cookies set by the website owner (in this case, Intellaris Private Limited) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
                            </p>

                            <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Why We Use Cookies</h2>
                            <p className="text-white/80 mb-4">
                                We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Service to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Service.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Essential Cookies</h3>
                            <p className="text-white/80 mb-4">
                                These cookies are strictly necessary to provide you with services available through our Service and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Service, you cannot refuse them without impacting how our website functions.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Performance and Functionality Cookies</h3>
                            <p className="text-white/80 mb-4">
                                These cookies are used to enhance the performance and functionality of our Service but are non-essential to their use. However, without these cookies, certain functionality (like video playback or user preferences) may become unavailable.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3 Analytics and Customization Cookies</h3>
                            <p className="text-white/80 mb-4">
                                These cookies collect information that is used either in aggregate form to help us understand how our Service is being used or how effective our marketing campaigns are, or to help us customize our Service for you.
                            </p>

                            <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Types of Cookies We Use</h2>
                            <div className="overflow-x-auto mb-8">
                                <table className="min-w-full text-left text-white/80 border border-white/10 rounded-lg">
                                    <thead className="bg-white/5 border-b border-white/10">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-white">Type</th>
                                            <th className="px-6 py-4 font-semibold text-white">Purpose</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-white">Authentication</td>
                                            <td className="px-6 py-4">To identify you when you sign in to our Service.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-white">Security</td>
                                            <td className="px-6 py-4">To help detect and prevent security risks and fraud.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-white">Preferences</td>
                                            <td className="px-6 py-4">To remember your settings and preferences (e.g., language, region).</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-white">Analytics</td>
                                            <td className="px-6 py-4">To understand how visitors interact with our Service (e.g., Google Analytics).</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. How Can You Control Cookies?</h2>
                            <p className="text-white/80 mb-4">
                                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                            </p>
                            <p className="text-white/80 mb-4">
                                As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
                            </p>
                            <p className="text-white/80 mb-6">
                                Most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noreferrer">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noreferrer">http://www.youronlinechoices.com</a>.
                            </p>

                            <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Updates to This Policy</h2>
                            <p className="text-white/80 mb-6">
                                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                            </p>

                            <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Contact Us</h2>
                            <p className="text-white/80 mb-4">
                                If you have any questions about our use of cookies or other technologies, please contact us at:
                            </p>
                            <p className="text-white font-semibold mb-2">
                                INTELLARIS PRIVATE LIMITED
                            </p>
                            <p className="text-white font-semibold mb-2">
                                Khaniram Boro Pathghy, Garchuk, Kamrup (Metro), Assam, India - 781035
                            </p>
                            <p className="text-white font-semibold mb-2">
                                Email: privacy.onewindow@intellaris.co
                            </p>
                            <p className="text-white font-semibold mb-6">
                                Website: www.intellaris.co
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
