"use client"

import { Dithering } from "@paper-design/shaders-react"
import ModelShowcase from "@/components/ModelShowcase"
import { Mail, ChevronDown, Eye, EyeOff, Package, Building, Plus, ChevronRight, ChevronLeft, Zap, Brain, TreeDeciduousIcon } from "lucide-react"
import { useState, useCallback, memo, useEffect, useRef } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Suspense } from "react"
import { signupWithEmail, signupWithGoogle, loginWithEmail, requestPasswordReset, resetPassword, verifyEmailOTP, resendVerificationOTP, saveAuthTokens, API_BASE_URL } from "@/lib/api"

// API base URL is provided by lib/api

// Types for our API responses
interface User {
  id: string;
  fullName: string;
  email: string;
  provider: string;
  googleId: string | null;
  status: string;
  accountType: string;
  createdAt: string;
  updatedAt: string;
}

interface GoogleSignupResponse {
  accessToken: string;
  user: User;
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
}

// Memoized Pricing Card Component to prevent unnecessary re-renders
const PricingCard = memo(({ plan, isAnnual, onStartClick }: { plan: any; isAnnual: boolean; onStartClick: (planCode: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStartClick = () => {
    onStartClick(plan.code);
  };

  return (
    <div className="relative group">
      {/* Pure black card with glowing border */}
      <div
        className={`
          h-full  bg-transparent border border-white/10 
          transition-all duration-300 overflow-hidden 
          group-hover:border-white/10
          group-hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]
        `}
      >
        {/* Card Content */}
        <div className="relative p-5 flex flex-col h-full text-left">
          {/* Icon */}
          <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center mb-3 border border-white/10">
            {plan.icon}
          </div>

          {/* Plan Name */}
          <h3 className="text-[20px] font-bold text-white mb-1">{plan.name}</h3>
          <p className="text-[12px] text-white font-medium mb-3">{plan.description}</p>

          {/* Divider */}
          <div className="w-8 h-0.5 bg-white/30 mb-3" />

          {/* Price */}
          <div className="mb-5">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">
                ₹{isAnnual ? plan.annualPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
              </span>
              <span className="text-white/70 text-[12px]">
                {isAnnual ? "/yr" : "/mo"}
              </span>
            </div>
            {/* Show savings for annual plans */}
            {isAnnual && plan.annualSavings && (
              <div className="text-[12px] text-white mt-1 p-2 font-bold border border-white/10 w-fit mt-2">
                Save ₹{plan.annualSavings.toLocaleString()}+
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartClick}
            className="w-full py-3 rounded-full font-semibold cursor-pointer mb-5 transition-all border text-xs bg-white/10 text-white hover:bg-white/20 border-white/10"
          >
            {plan.name === "PRO" ? "Start Free" : "Get Started"}
          </button>

          {/* Features */}
          <div className="space-y-1 mb-3">
            <h4 className="text-[12px] font-semibold text-white mb-2">Features:</h4>

            <div className="space-y-2">
              {plan.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center">
                    <span className="text-white/70 text-xs">+</span>
                  </div>
                  <span className="text-[12px] text-white/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* More Features */}
          <button
            className="text-[12px] text-white/70 hover:text-white transition-colors inline-flex items-center font-bold gap-1 group/more"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            and {plan.moreFeatures} more
            <span className={`group-hover/more:translate-x-0.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              →
            </span>
          </button>

          {/* Expanded Features */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
              {plan.detailedFeatures.map((section: any, sectionIndex: number) => (
                <div key={sectionIndex} className="mb-4">
                  <h5 className="text-[12px] font-bold text-white mb-2">{section.category}</h5>
                  <ul className="space-y-2">
                    {section.items.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                        <span className="text-[12px] text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

PricingCard.displayName = "PricingCard"

// Memoized form component to prevent re-renders that could affect the WebGL context
const SignUpForm = memo(({ onContinue }: { onContinue: (userData: { email: string; userId: string; fullName: string }) => void }) => {
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = formData.fullName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "";

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setEmailLoading(true);
    setError("");

    try {
      const user = await signupWithEmail(
        formData.fullName,
        formData.email,
        formData.password
      );

      // Successful signup - redirect to verification or next step
      console.log("Email signup successful:", user);
      // Pass the email, userId, and fullName to the verification step
      onContinue({ email: user.email, userId: user.id, fullName: formData.fullName });
    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof Error) {
        setError(err.message || "Signup failed. Please try again.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center justify-center py-8 pt-24">
      {/* Heading */}
      <h1 className="text-5xl font-light tracking-tight mb-12 text-white text-center">Create your account</h1>

      {/* Error message */}
      {error && (
        <div className="w-full mb-4 p-3 text-center bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Continue with Google */}
      <button
        onClick={handleGoogleSignup}
        disabled={googleLoading}
        className="w-full border border-white/30 text-black cursor-pointer rounded-full px-6 py-3 mb-8 font-semibold text-base flex items-center justify-center gap-3 hover:border-white/50 transition-colors bg-white disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Continue with Google"
      >
        {googleLoading ? (
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11.5" fill="none" stroke="none" />
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.15-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6 w-full">
        <div className="flex-1 h-px bg-white/20"></div>
        <span className="text-white/50 text-sm">or</span>
        <div className="flex-1 h-px bg-white/20"></div>
      </div>

      {/* Sign up with Email Title */}
      <h2 className="text-sm font-semibold mb-4 text-white">Sign up with Email</h2>

      {/* Full Name Inputs */}
      <div className="flex gap-4 w-full mb-4">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Full name"
          className="flex-1 font-semibold bg-transparent backdrop-blur-sm border border-white/10 rounded-full px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/10 transition-colors"
          required
        />
      </div>

      {/* Email Input */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        className="w-full font-semibold bg-transparent backdrop-blur-sm border border-white/10 rounded-full px-4 py-3 mb-4 text-white placeholder-white/50 focus:outline-none focus:border-white/10 transition-colors"
        required
      />

      {/* Password Input */}
      <div className="relative w-full mb-6">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full font-semibold bg-transparent backdrop-blur-sm border border-white/10 rounded-full px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-white/10 transition-colors"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/50 hover:text-white transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleEmailSignup}
        disabled={emailLoading || !isFormValid}
        className={`w-full rounded-full px-6 py-3 mb-6 font-semibold text-base flex items-center justify-center ${emailLoading || !isFormValid
          ? "bg-white/5 text-white/50 cursor-not-allowed"
          : "bg-white text-black hover:bg-gray-200 transition-colors"
          }`}
      >
        {emailLoading ? (
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          "Continue"
        )}
      </button>

      {/* Sign In Link */}
      <p className="text-center text-white/70 font-medium text-sm">
        Already have an account?{" "}
        <a href="?login=true" className="text-white hover:underline font-semibold">
          Sign in
        </a>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-10 w-full">
        <div className="flex-1 h-px bg-white/5"></div>
      </div>

      {/* Legal Links */}
      <div className="mt-8 text-center text-sm text-white/50">
        <p>
          By continuing, you agree to{" "}
          <a
            href="https://loopsync.cloud/policies"
            className="text-white font-semibold hover:font-bold cursor-pointer"
          >
            One Window™ Policies
          </a>
        </p>

        {/* <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {[
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Use", href: "#" },
            { name: "Refund Policy", href: "#" },
            { name: "Software License", href: "#" },
            { name: "Fair Use Policy", href: "#" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div> */}
      </div>
    </div>
  );
});

SignUpForm.displayName = 'SignUpForm';

// Pricing Content Component
const PricingContent = memo(({ userData }: { userData?: { email: string; fullName: string } }) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [urlUpdated, setUrlUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleStartClick = (planCode: string) => {
    setSelectedPlan(planCode);
    setIsLoading(true);

    // After 4 seconds, redirect to payment page with plan information
    setTimeout(() => {
      // Pass plan code and billing cycle as query parameters (properly encoded)
      router.push(`/secure/checkout?plan=${encodeURIComponent(planCode)}&email=${encodeURIComponent(userData?.email || '')}&billingCycle=${isAnnual ? 'annual' : 'monthly'}`);
    }, 2000);
  };

  useEffect(() => {
    // Update URL to show pro=true when PricingContent is displayed, but only once
    if (!urlUpdated) {
      setUrlUpdated(true);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('pro', 'true');

      // Remove login parameter if present
      newSearchParams.delete('login');

      router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [router, pathname, searchParams, urlUpdated]);

  const plans = [
    {
      name: "PRO",
      code: "PRO",
      icon: <Package className="w-5 h-5 text-white" />,
      // Updated pricing values
      monthlyPrice: 759,
      annualPrice: 7399,
      annualSavings: 2000,
      description: "Ideal for individuals and small teams evaluating PRO features.",
      features: ["One Window Intelligence", "Workflow Automations", "Stealth Mode (limited)", "High-accuracy Responses"],
      moreFeatures: 7,
      detailedFeatures: [
        { category: "Free Trial", items: ["5 Requests / day"] },
        { category: "PRO", items: ["80 Requests / day", "500 total monthly quota"] },
        {
          category: "Included Features", items: [
            "Multi-Model Access (Limited) - Access multiple AI models with reduced parallel outputs.",
            "Code Sync (Limited) - Sync captured code across devices with basic restrictions.",
            "Dual Response View - View up to 2 AI responses side-by-side.",
            "Dashboard Output (Limited) - Access simplified dashboard insights with capped data display."
          ]
        }
      ]
    },
    {
      name: "PRO PRIME-X",
      code: "PRO_PRIME-X",
      icon: <Building className="w-5 h-5 text-white" />,
      // Updated pricing values
      monthlyPrice: 1299,
      annualPrice: 12599,
      annualSavings: 3000,
      description: "Built for scaling businesses and teams that need more power.",
      features: ["All in PRO (enhanced)", "One Window Intelligence+", "Priority Compute", "Expanded Context Window"],
      moreFeatures: 7,
      detailedFeatures: [
        { category: "Requests", items: ["Unlimited Requests / day", "1,500 total monthly quota"] },
        {
          category: "Included Features", items: [
            "Full Multi-Model Access - Leverage all 8 AI models simultaneously for richer, cross-verified insights.",
            "Advanced Code Sync - Sync and manage your code across devices without limits.",
            "Unlimited Response View - Compare and view all model outputs side-by-side for complete reasoning.",
            "Enhanced Dashboard Output - Access full dashboard analytics, summaries, and structured insights.",
            "Priority Processing - Faster response times and priority allocation for all requests."
          ]
        }
      ]
    },
  ];

  // Extract initials from fullName for profile avatar
  const getUserInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="w-full max-w-xl text-center py-8 pt-24">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>

      {userData && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center rounded-full gap-4 px-5 py-1 bg-white/5 border-t-1 border-b-1 border-white/20 backdrop-blur-md shadow-lg">

            {/* Avatar */}
            <div className="relative w-10 mt-1 mb-1 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg shadow-md">
              <div className="w-full h-full rounded-full uppercase bg-white flex items-center justify-center text-black font-bold text-lg shadow-md">
                {getUserInitials(userData.fullName)}
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col">
              <span className="text-white uppercase font-bold text-sm leading-tight">
                {userData.fullName}
              </span>
              <span className="text-white/60 text-xs">
                {userData.email}
              </span>
            </div>
          </div>
        </div>
      )}


      {/* <div className="inline-flex items-center justify-center mb-4 w-full">
        <div className="px-3 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
          <span className="text-[14px] text-white font-medium">You're Almost There</span>
        </div>
      </div> */}

      <h1 className="text-3xl md:text-4xl font-bold mb-3">
        Start Free, Upgrade Anytime
      </h1>

      <p className="text-sm text-white/70 mb-6 max-w-xl mx-auto">
        Experience full <span className="font-bold text-white">PRO</span> access free for 7 days. Explore advanced<br />
        tools and upgrade to <span className="font-bold text-white">PRO PRIME-X</span> whenever it fits your workflow.
      </p>

      {/* Billing Toggle */}
      <div className="inline-flex gap-1.5 p-2 rounded-full border border-white/20 bg-white/5">
        <button
          onClick={() => setIsAnnual(false)}
          className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${!isAnnual ? "bg-white text-black" : "text-white/70 hover:text-white"
            }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setIsAnnual(true)}
          className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${isAnnual ? "bg-white text-black" : "text-white/70 hover:text-white"
            }`}
        >
          Annually
        </button>
      </div>

      {/* Cards */}
      <div className="mt-6">
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} isAnnual={isAnnual} onStartClick={handleStartClick} />
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            {/* <p className="text-white text-lg font-medium">
              Setting up your {selectedPlan} account...
            </p> */}
          </div>
        </div>
      )}
    </div>
  );
});

PricingContent.displayName = 'PricingContent';

// Login Form Component
const LoginForm = memo(({ onForgotPassword }: { onForgotPassword?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignInClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await loginWithEmail(formData.email, formData.password);

      // Store tokens and user details
      saveAuthTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken, expiresAt: response.expiresAt });
      localStorage.setItem("user", JSON.stringify(response.user));

      // Check account type and redirect accordingly
      if (response.user.accountType === 'VISITOR') {
        // For VISITOR users, redirect to plan selection page with user data
        const userData = {
          email: response.user.email,
          fullName: response.user.fullName
        };
        const encodedUserData = encodeURIComponent(JSON.stringify(userData));
        router.push(`/open-account?pro=true&userData=${encodedUserData}`);
      } else {
        // Redirect to home page for other account types
        router.push('/home');
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message || "Login failed. Please try again.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Redirect to Google OAuth endpoint for login
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center justify-center py-8 pt-24">
      {/* Heading */}
      <h1 className="text-5xl font-light tracking-tight mb-12 text-white text-center">Welcome back</h1>

      {/* Continue with Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full border border-white/30 cursor-pointer text-black rounded-full px-6 py-3 mb-8 font-semibold text-base flex items-center justify-center gap-3 hover:border-white/50 transition-colors bg-white disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Continue with Google"
      >
        {googleLoading ? (
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11.5" fill="none" stroke="none" />
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6 w-full">
        <div className="flex-1 h-px bg-white/20"></div>
        <span className="text-white/50 text-sm">or</span>
        <div className="flex-1 h-px bg-white/20"></div>
      </div>

      {/* Sign in with Email Title */}
      <h2 className="text-sm font-semibold mb-4 text-white">Sign in with Email</h2>

      {/* Email Input */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        className="w-full font-semibold bg-transparent backdrop-blur-sm border border-white/10 rounded-full px-4 py-3 mb-4 text-white placeholder-white/50 focus:outline-none focus:border-white/10 transition-colors"
      />

      {/* Password Input */}
      <div className="relative w-full mb-6">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full font-semibold bg-transparent backdrop-blur-sm border border-white/10 rounded-full px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-white/10 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/50 hover:text-white transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Forgot Password Link */}
      <div className="w-full text-right mb-6">
        <button
          onClick={onForgotPassword}
          className="text-white/70 font-semibold text-sm hover:text-white hover:underline transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full mb-4 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Sign In Button */}
      <button
        onClick={handleSignInClick}
        disabled={isLoading || !formData.email || !formData.password}
        className="w-full bg-white/10 text-white rounded-full px-6 py-3 mb-6 font-semibold text-base hover:bg-white/10 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          "Sign in"
        )}
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-white/70 font-medium text-sm">
        Don't have an account?{" "}
        <a href="?login=false" className="text-white hover:underline font-semibold">
          Sign up
        </a>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-10 w-full">
        <div className="flex-1 h-px bg-white/5"></div>
      </div>

      {/* Legal Links */}
      <div className="mt-8 text-center text-sm text-white/50">
        <p>
          By continuing, you agree to{" "}
          <a
            href="https://loopsync.cloud/policies"
            className="text-white font-semibold hover:font-bold cursor-pointer"
          >
            One Window™ Policies
          </a>
        </p>
        {/* <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {[
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Use", href: "#" },
            { name: "Refund Policy", href: "#" },
            { name: "Software License", href: "#" },
            { name: "Fair Use Policy", href: "#" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div> */}
      </div>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

// Email Verification Component
const EmailVerification = memo(({ userId, email, onVerified, onBack }: { userId: string; email: string; onVerified: () => void; onBack: () => void }) => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Add success state for resend feedback
  const [resendLoading, setResendLoading] = useState(false); // Add loading state for resend
  const [verificationSuccess, setVerificationSuccess] = useState(false); // Add state for verification success
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleInputChange = (index: number, value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input if value entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(""); // Clear any success message

    try {
      const response = await verifyEmailOTP(userId, code);
      console.log("Verification successful:", response);
      setVerificationSuccess(true);
      setSuccess("Email successfully verified!");

      // Store tokens after verification
      saveAuthTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
      localStorage.setItem("user", JSON.stringify(response.user));

      // Call onVerified after a short delay to show the success message
      setTimeout(() => {
        onVerified();
      }, 1500);
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationSuccess(false);
      if (err instanceof Error) {
        setError(err.message || "Invalid verification code. Please try again.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await resendVerificationOTP(email);
      console.log("Resend code response:", response);
      // Show success message to the user
      setSuccess("Verification code resent successfully! Check your email.");
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      console.error("Resend code error:", err);
      // Show error message to the user
      if (err instanceof Error) {
        setError(err.message || "Failed to resend verification code. Please try again.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center justify-center py-8 pt-24">
      {/* Heading */}
      <h1 className="text-4xl font-light tracking-tight mb-4 text-white text-center">Verify your email</h1>

      <p className="text-white/70 text-center mb-8 mt-25">
        Enter the 6-digit code sent to <span className="font-semibold text-white">{email}</span>
      </p>

      {/* Error message */}
      {error && (
        <div className="w-full mb-4 p-3 text-center text-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="w-full mb-4 p-3 text-center bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
          {success}
        </div>
      )}

      {/* Verification Code Inputs */}
      <div className="flex justify-center gap-3 mb-8">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-bold bg-transparent border border-white/20 rounded-lg focus:border-white focus:outline-none"
            autoFocus={index === 0}
            disabled={verificationSuccess} // Disable inputs after successful verification
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={isLoading || verificationSuccess}
        className="w-full bg-white text-black rounded-full px-6 py-3 mb-6 font-semibold text-base hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-70"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : verificationSuccess ? (
          "Verified Successfully"
        ) : (
          "Verify"
        )}
      </button>

      {/* Resend Code */}
      <div className="text-center text-white/70 text-sm mb-2">
        Didn't receive the code?
      </div>
      <button
        className="text-white font-semibold text-sm hover:underline mb-8 flex items-center justify-center"
        onClick={handleResendCode}
        disabled={resendLoading || verificationSuccess}
      >
        {resendLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Sending...
          </>
        ) : (
          "Resend code"
        )}
      </button>

      {/* Back to Signup */}
      <button
        className="text-white/70 font-semibold text-sm hover:text-white hover:underline"
        onClick={onBack}
        disabled={verificationSuccess}
      >
        Back to signup
      </button>
    </div>
  );
});

EmailVerification.displayName = 'EmailVerification';

// Password Reset Component
const PasswordReset = memo(({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleInputChange = (index: number, value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input if value entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await requestPasswordReset(email);
      setSuccess(response.message);
      setStep('reset');
    } catch (err) {
      console.error("Password reset request error:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to send reset code. Please try again.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const resetCode = code.join("");

    if (!email || resetCode.length !== 6 || !newPassword || newPassword !== confirmPassword) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await resetPassword(email, resetCode, newPassword);
      setSuccess(response.message);

      // After successful reset, show success message for a moment then go back to login
      setTimeout(() => {
        onBack();
      }, 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to reset password. Please try again.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'request') {
    return (
      <div className="w-full max-w-sm flex flex-col items-center justify-center py-8 pt-24">
        {/* Heading */}
        <h1 className="text-5xl font-light tracking-tight mb-12 text-white text-center">Reset Password</h1>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="self-start mb-6 text-white/70 mt-10 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Login
        </button>

        <p className="text-white text-center mb-8">
          Enter your email address and we'll send you a code to reset your password.
        </p>

        {/* Email Input */}
        <form onSubmit={handleRequestReset} className="w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full font-semibold bg-transparent backdrop-blur-sm border border-white/20 rounded-full px-4 py-3 mb-6 text-white placeholder-white/50 focus:outline-none focus:border-white/70 transition-colors"
          />

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="w-full mb-4 text-green-400 text-sm text-center">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-white text-black rounded-full px-6 py-3 mb-6 font-semibold text-base hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>
      </div>
    );
  }

  // Reset password step
  return (
    <div className="w-full max-w-sm flex flex-col items-center justify-center py-8 pt-24">
      {/* Heading */}
      <h1 className="text-5xl font-light tracking-tight mb-12 text-white text-center">Reset Password</h1>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start mb-6 text-white/70 mt-10 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Login
      </button>

      <p className="text-white text-center mb-8">
        Enter the 6-digit code sent to your email and create a new password.
      </p>

      <form onSubmit={handleResetPassword} className="w-full">
        {/* Verification Code Inputs */}
        <div className="flex justify-center gap-3 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { if (el) inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold bg-transparent border border-white/20 rounded-lg focus:border-white focus:outline-none"
            />
          ))}
        </div>

        {/* New Password Input */}
        <div className="relative w-full mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full font-semibold bg-transparent backdrop-blur-sm border border-white/20 rounded-full px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-white/70 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/50 hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative w-full mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full font-semibold bg-transparent backdrop-blur-sm border border-white/20 rounded-full px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-white/70 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/50 hover:text-white transition-colors"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Match Validation */}
        {newPassword && confirmPassword && newPassword !== confirmPassword && (
          <div className="w-full mb-4 text-red-400 text-sm text-center">
            Passwords do not match
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="w-full mb-4 text-green-400 text-sm text-center">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || code.join("").length !== 6 || !newPassword || newPassword !== confirmPassword}
          className="w-full bg-white text-black rounded-full px-6 py-3 mb-6 font-semibold text-base hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
});

PasswordReset.displayName = 'PasswordReset';

// Wrapper component to handle search params in suspense boundary
const OpenAccountContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [urlParamSet, setUrlParamSet] = useState(false);
  const [showPricing, setShowPricing] = useState(false); // State to control pricing content visibility
  const [showVerification, setShowVerification] = useState(false); // State to control verification UI visibility
  const [showPasswordReset, setShowPasswordReset] = useState(false); // State to control password reset UI visibility
  const [signupEmail, setSignupEmail] = useState(""); // Store email from signup form
  const [signupUserId, setSignupUserId] = useState(""); // Store userId from signup form
  const [signupFullName, setSignupFullName] = useState(""); // Store fullName from signup form
  const [userData, setUserData] = useState<{ email: string; fullName: string } | null>(null); // Store user data for profile display

  // Check if login parameter exists
  const loginParam = searchParams.get('login');
  // Check if pro parameter exists
  const proParam = searchParams.get('pro');
  // Check if verifyEmail parameter exists
  const verifyEmailParam = searchParams.get('verifyEmail');
  // Check for user data in query parameters (for Google OAuth)
  const userDataParam = searchParams.get('userData');
  // Check for reset parameter
  const resetParam = searchParams.get('reset');

  const accessTokenParam = searchParams.get('accessToken');
  const refreshTokenParam = searchParams.get('refreshToken');
  const expiresAtParam = searchParams.get('expiresAt');

  // Handle user data and tokens from Google OAuth
  useEffect(() => {
    if (userDataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(userDataParam));
        setUserData(decodedData);

        // If we have an access token, this is a successful login/signup
        // Save the tokens and user data to storage
        if (accessTokenParam) {
          saveAuthTokens({
            accessToken: accessTokenParam,
            refreshToken: refreshTokenParam || undefined,
            expiresAt: expiresAtParam || undefined
          });
          localStorage.setItem("user", JSON.stringify(decodedData));

          // Optionally clean up the URL or redirect to remove tokens
          // For now, let's leave it as the state updates might trigger other effects
        }
      } catch (e) {
        console.error('Error parsing user data from query parameters', e);
      }
    }
  }, [userDataParam, accessTokenParam, refreshTokenParam, expiresAtParam]);

  // Handle reset parameter
  useEffect(() => {
    if (resetParam === 'true') {
      setShowPasswordReset(true);
    }
  }, [resetParam]);

  // Redirect to not-found page if no valid parameters
  useEffect(() => {
    if (loginParam === null && proParam === null && verifyEmailParam === null && !userDataParam) {
      router.replace('/not-found');
    }
  }, [loginParam, proParam, verifyEmailParam, userDataParam, router]);

  // If no valid parameters, don't render the page content
  if (loginParam === null && proParam === null && verifyEmailParam === null && !userDataParam) {
    return null;
  }

  // Determine if we should show login or signup form
  const isLogin = loginParam === 'true';
  // Determine if we should show the PRO plan directly
  const isPro = proParam === 'true';
  // Determine if we should show email verification
  const isVerifyEmail = verifyEmailParam === 'true';

  // Set URL parameter on initial load
  useEffect(() => {
    // If no relevant parameters are present, set appropriate defaults
    if (searchParams.get('login') === null &&
      searchParams.get('pro') === null &&
      searchParams.get('verifyEmail') === null &&
      searchParams.get('reset') === null &&
      !urlParamSet) {
      setUrlParamSet(true);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('login', 'false');
      router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [pathname, router, urlParamSet]);

  // Update URL when verification state changes
  useEffect(() => {
    if (!showVerification) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Show verification UI - set verifyEmail=true and remove others
    newSearchParams.set('verifyEmail', 'true');
    newSearchParams.delete('login');
    newSearchParams.delete('pro');

    router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  }, [showVerification, pathname, router]);

  // Update URL when pricing state changes
  useEffect(() => {
    if (!showPricing) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('pro', 'true');
    newSearchParams.delete('verifyEmail');
    newSearchParams.delete('login');
    router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  }, [showPricing, pathname, router]);

  // Update URL when password reset state changes
  useEffect(() => {
    const currentReset = searchParams.get('reset');

    if (showPasswordReset && currentReset !== 'true') {
      // Show password reset UI - set login=true and add reset param
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('login', 'true');
      newSearchParams.set('reset', 'true');
      router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    } else if (!showPasswordReset && currentReset === 'true') {
      // Remove reset param when closing password reset
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('reset');
      // If we're closing password reset and we were in login mode, keep login param
      if (isLogin) {
        newSearchParams.set('login', 'true');
      }
      router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [showPasswordReset, pathname, router, isLogin]);

  // Define gradient colors for signup (blue) and login (red)


  return (
    <div className="h-screen bg-[#000000] text-white overflow-hidden relative">
      {/* Header */}
      <header className="absolute top-0 left-0 backdrop-blur-sm right-0 flex items-center justify-between px-8 py-6 z-999">
        <div className="text-3xl font-bold tracking-tight">
          <img
            src="/resources/logo.svg"
            alt="LoopSync Logo"
            className="h-9 w-auto brightness-150 contrast-125"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
          <span className="text-sm font-semibold">You are signing into LoopSync Cloud Console</span>
          <ChevronDown className="w-4 h-4 mt-1 text-white" />
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-2 h-screen">
        {/* Left Column - Form or Pricing Content */}
        <div className="flex flex-col items-center justify-start overflow-y-auto py-8 px-16 h-screen scrollbar-hide">
          {isLogin ? (
            showPasswordReset ? (
              <PasswordReset onBack={() => setShowPasswordReset(false)} />
            ) : (
              <LoginForm onForgotPassword={() => setShowPasswordReset(true)} />
            )
          ) : isPro ? (
            <PricingContent userData={userData || undefined} />
          ) : isVerifyEmail || showVerification ? (
            <EmailVerification
              userId={signupUserId}
              email={signupEmail}
              onVerified={() => {
                setShowVerification(false);
                setShowPricing(true);
                // Set user data for profile display
                setUserData({
                  email: signupEmail,
                  fullName: signupFullName
                });
              }}
              onBack={() => {
                setShowVerification(false);
                // Update URL to show signup form
                const newSearchParams = new URLSearchParams(searchParams.toString());
                newSearchParams.set('login', 'false');
                newSearchParams.delete('verifyEmail');
                router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
              }}
            />
          ) : showPricing ? (
            <PricingContent userData={userData || undefined} />
          ) : (
            <SignUpForm onContinue={(userData: { email: string; userId: string; fullName: string }) => {
              setSignupEmail(userData.email);
              setSignupUserId(userData.userId);
              setSignupFullName(userData.fullName);
              setShowVerification(true);
            }} />
          )}
        </div>

        {/* Right Column - Visual Background */}
        <div className="relative overflow-hidden h-screen flex items-center justify-center bg-black">
          {/* Animated gradient blinds */}
          {/* Animated gradient blinds */}
          <Dithering
            style={{ height: "100%", width: "100%" }}
            colorBack="hsl(0, 0%, 0%)"
            colorFront={isLogin ? "#3b31c9ff" : "#c7dc26ff"}
            shape={"cat" as any}
            type="4x4"
            pxSize={3}
            offsetX={0}
            offsetY={0}
            scale={0.8}
            rotation={0}
            speed={1.1}
          />
          {/* Model Showcase */}
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/10 backdrop-blur-3xl">
            <div className="w-full max-w-2xl">
              <div className="text-white py-20 px-6 flex flex-col items-center relative">
                <div className="text-center mb-10 relative z-20">
                  <h1 className="text-6xl font-bold">One Window<sup className="text-sm ml-2 align-super">TM</sup></h1>
                  <p className="text-white font-semibold text-2xl">A spectrum of models.</p>

                  <div className="mt-12 mb-12 w-full">
                    <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-6">Top Models</p>
                    <div className="grid grid-cols-3 gap-4">
                      {/* LS Compute-Max */}
                      <div className="p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-default flex flex-col items-center gap-3 backdrop-blur-md group hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <TreeDeciduousIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm">LS Compute-Max</p>
                        </div>
                      </div>

                      {/* R3 Advanced */}
                      <div className="p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-default flex flex-col items-center gap-3 backdrop-blur-md group hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <TreeDeciduousIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm">R3 Advanced</p>
                        </div>
                      </div>

                      {/* Vision Pro */}
                      <div className="p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-default flex flex-col items-center gap-3 backdrop-blur-md group hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <TreeDeciduousIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm">Vision Pro</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-white text-xl mt-4 max-w-lg mx-auto leading-relaxed">
                    "Choose a <span className="text-white font-bold italic">faster</span> model when speed matters
                    <br />and a <span className="text-white font-bold italic">smarter</span> one for more complex tasks"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optional overlay content */}
          <div className="absolute z-30 text-white p-4">
          </div>

          {/* QR Code (Bottom right side) */}
          <div className="absolute bottom-0 right-0 pr-4 pb-4 flex flex-col items-center space-y-1 z-40">
            <a href="https://loopsync.cloud/one-window/support/resources" target="_blank" rel="noopener noreferrer">
              <img
                src="/resources/qr-support.svg"
                alt="QR Code"
                className="w-20 h-20 opacity-90 hover:opacity-100 transition duration-200"
              />
            </a>
            <span className="text-white text-xs font-medium text-center leading-tight max-w-[8rem]">
              Scan or Click for<br /><span className="font-semibold text-white">One Window Support</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export the component wrapped in Suspense
export default function OpenAccount() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#07080a] flex items-center justify-center"></div>}>
      <OpenAccountContent />
    </Suspense>
  );
}
