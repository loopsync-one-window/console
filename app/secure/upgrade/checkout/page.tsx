"use client";
export const dynamic = "force-dynamic";

import { ArrowLeft, Info, Search, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRIES, INDIA_STATES, USA_STATES } from "@/lib/country-list";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { getProfileMe, getBillingDetails } from '@/lib/api';

interface Plan {
  name: string;
  code: string;
  monthlyPrice: number;
  annualPrice: number;
}

interface PaymentSuccessData {
  amount: number;
  startDate: string;
  endDate: string;
  duration: string;
  billingCycle: string;
}

const UpgradeCheckoutPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<PaymentSuccessData | null>(null);
  const [isProcessingSuccess, setIsProcessingSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const query = React.useMemo(() => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null), []);
  const [email, setEmail] = useState<string>(() => query?.get('email') || '');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(() => (query?.get('billingCycle') as 'monthly' | 'annual') || 'monthly');
  const [selectedCountry, setSelectedCountry] = useState('in');
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [prepaidBeforeUpgrade, setPrepaidBeforeUpgrade] = useState<number>(0);
  const [prepaidEmail, setPrepaidEmail] = useState<string>('');
  type ApiBillingAddress = {
    addressLine1: string;
    addressLine2?: string;
    phoneNumber: string;
    city?: string;
    pinCode: string;
    country: string;
    state: string;
    isDefault?: boolean;
  };
  type SearchResponse = { billingAddresses?: ApiBillingAddress[] };

  const [billingAddress, setBillingAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    phoneNumber: '',
    city: '',
    pinCode: '',
    country: 'in',
    state: ''
  });

  const plans: Plan[] = [
    { name: "PRO", code: "PRO", monthlyPrice: 759, annualPrice: 7399 },
    { name: "PRO PRIME-X", code: "PRO_PRIME-X", monthlyPrice: 1299, annualPrice: 12599 }
  ];

  const formatPlanName = (planCode: string) => planCode.replace(/_/g, ' ');

  const getPlanPricing = (planCode: string) => {
    const normalized = planCode.replace(/ /g, '_');
    const plan = plans.find(p => p.code === normalized || p.code === planCode) || plans[1];
    let price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
    return { price, displayPrice: `₹${price.toLocaleString()}` };
  };

  const getChargeableAmount = () => {
    const planCode = query?.get('plan') || 'PRO_PRIME-X';
    const pricing = getPlanPricing(planCode);
    return pricing.price * 100;
  };

  const getDisplayAmount = () => {
    const planCode = query?.get('plan') || 'PRO_PRIME-X';
    const pricing = getPlanPricing(planCode);
    return pricing.displayPrice;
  };

  const getStates = () => {
    if (selectedCountry === 'in') return INDIA_STATES;
    if (selectedCountry === 'us') return USA_STATES;
    return [];
  };

  const banks = [
    { id: 'sbi', name: 'State Bank of India', icon: '/payment/sbi.svg' },
    { id: 'hdfc', name: 'HDFC Bank', icon: '/payment/phonepe.svg' },
    { id: 'icici', name: 'ICICI Bank', icon: '/payment/cred.svg' },
    { id: 'axis', name: 'Axis Bank', icon: '/payment/phonepe.svg' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '/payment/cred.svg' },
    { id: 'pnb', name: 'Punjab National Bank', icon: '/payment/gpay.svg' },
    { id: 'bob', name: 'Bank of Baroda', icon: '/payment/paytm.svg' },
    { id: 'boi', name: 'Bank of India', icon: '/payment/phonepe.svg' },
    { id: 'canara', name: 'Canara Bank', icon: '/payment/yes-bank.svg' },
    { id: 'union', name: 'Union Bank of India', icon: '/payment/phonepe.svg' },
    { id: 'yes', name: 'Yes Bank', icon: '/payment/yes-bank.svg' },
    { id: 'indusind', name: 'IndusInd Bank', icon: '/payment/paypal.svg' },
  ];

  const filteredBanks = banks.filter(bank => bank.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    script.onerror = () => console.error('Failed to load Razorpay SDK');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfileMe();
        if (!email) {
          setEmail(profile?.email || '');
        }
        const billing = await getBillingDetails();
        if (billing?.billingEmail && !email) {
          setEmail(billing.billingEmail);
        }
        const addr = billing?.billingAddress;
        if (addr) {
          setBillingAddress({
            addressLine1: addr.addressLine1 || '',
            addressLine2: addr.addressLine2 || '',
            phoneNumber: addr.phoneNumber || '',
            city: addr.city || '',
            pinCode: addr.pinCode || '',
            country: (addr.country || 'in').toLowerCase(),
            state: addr.state || '',
          });
          setSelectedCountry((addr.country || 'in').toLowerCase());
        }
      } catch { }
    })();
  }, []);

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!accessToken || !email) return;
    const url = `https://srv01.loopsync.cloud/payment-methods/search?email=${encodeURIComponent(email)}`;
    fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json() as Promise<SearchResponse>)
      .then((data) => {
        const addrs = data?.billingAddresses || [];
        if (Array.isArray(addrs) && addrs.length > 0) {
          const def = addrs.find((a) => a.isDefault) || addrs[0];
          setBillingAddress({
            addressLine1: def.addressLine1 || '',
            addressLine2: def.addressLine2 || '',
            phoneNumber: def.phoneNumber || '',
            city: def.city || '',
            pinCode: def.pinCode || '',
            country: def.country || 'in',
            state: def.state || '',
          });
        }
      })
      .catch(() => { /* ignore */ });
  }, [email]);

  const handleRazorpaySubscriptionPayment = (subscriptionId: string) => {
    if (!isRazorpayLoaded) {
      console.error('Razorpay SDK not loaded');
      return;
    }
    const options: Record<string, unknown> = {
      key: 'rzp_live_RhvHwqmzLiw3HA',
      subscription_id: subscriptionId,
      name: 'LoopSync',
      description: `LoopSync ${formatPlanName('PRO_PRIME-X')} Subscription`,
      handler: async function () {
        const startDate = new Date();
        const endDate = new Date();
        if (billingCycle === 'annual') endDate.setFullYear(endDate.getFullYear() + 1);
        else endDate.setMonth(endDate.getMonth() + 1);

        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          } as Record<string, string>;

          // Poll server for subscription activation via webhook
          const waitForActivation = async (): Promise<string | null> => {
            const started = Date.now();
            while (Date.now() - started < 60000) { // up to 60s
              const meResp = await fetch('https://srv01.loopsync.cloud/subscriptions/me', {
                method: 'GET',
                headers,
              });
              const meJson = await meResp.json();
              const id = meJson?.subscription?.id as string | undefined;
              if (id) return id;
              await new Promise(r => setTimeout(r, 2000));
            }
            return null;
          };

          const activatedId = await waitForActivation();
          if (activatedId) {
            await fetch('https://srv01.loopsync.cloud/billing/subscription/sync', {
              method: 'POST',
              headers,
              body: JSON.stringify({ subscriptionId: activatedId }),
            });
          }
        } catch { }

        // After activation, sync subscription billing and add previous prepaid credits
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          } as Record<string, string>;

          // Get current subscription to retrieve ID
          const meResp = await fetch('https://srv01.loopsync.cloud/subscriptions/me', {
            method: 'GET',
            headers,
          });
          const meJson = await meResp.json();
          const subId = meJson?.subscription?.id as string | undefined;

          if (subId) {
            await fetch('https://srv01.loopsync.cloud/billing/subscription/sync', {
              method: 'POST',
              headers,
              body: JSON.stringify({ subscriptionId: subId }),
            });

            if (prepaidBeforeUpgrade > 0 && (prepaidEmail || email)) {
              await fetch('https://srv01.loopsync.cloud/billing/credits/add', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  email: prepaidEmail || email,
                  type: 'prepaid',
                  amount: prepaidBeforeUpgrade,
                  reason: 'Manual credit',
                  referenceId: subscriptionId,
                }),
              });
            }
          }
        } catch { }

        setPaymentSuccessData({
          amount: getChargeableAmount(),
          startDate: startDate.toLocaleDateString(),
          endDate: endDate.toLocaleDateString(),
          duration: billingCycle === 'annual' ? '1 Year' : '1 Month',
          billingCycle: billingCycle === 'annual' ? 'Annually' : 'Monthly'
        });
        setShowPaymentSuccessModal(true);
      },
      prefill: {
        email,
        contact: billingAddress.phoneNumber,
      },
      theme: { color: '#000000' }
    };
    type RazorpayCtor = new (opts: Record<string, unknown>) => { open: () => void };
    const RZP = (window as unknown as { Razorpay: RazorpayCtor }).Razorpay;
    const rzp = new RZP(options);
    rzp.open();
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!accessToken) {
        setIsSubscribing(false);
        return;
      }
      // Collect current prepaid credits before upgrading
      try {
        const creditsResp = await fetch('https://srv01.loopsync.cloud/billing/credits', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        const creditsJson = await creditsResp.json();
        const currentPrepaid = creditsJson?.data?.credits?.prepaid ?? 0;
        const currentEmail = creditsJson?.data?.email ?? '';
        setPrepaidBeforeUpgrade(Number(currentPrepaid) || 0);
        setPrepaidEmail(String(currentEmail) || email);
      } catch { }
      const response = await fetch('https://srv01.loopsync.cloud/upgrade/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email,
          contact: billingAddress.phoneNumber,
          newPlanCode: 'PRO_PRIME-X',
          billingCycle: billingCycle.toUpperCase(),
        }),
      });
      const result = await response.json();
      if (result?.success && result?.subscriptionId) {
        handleRazorpaySubscriptionPayment(result.subscriptionId);
      } else {
        alert('Failed to initiate upgrade: ' + (result?.message || 'Unknown error'));
      }
    } catch {
      alert('Error initiating upgrade');
    } finally {
      setIsSubscribing(false);
    }
  };

  useEffect(() => {
    if (showPaymentSuccessModal && paymentSuccessData) {
      const t = setTimeout(() => router.push('/home'), 2500);
      return () => clearTimeout(t);
    }
  }, [showPaymentSuccessModal, paymentSuccessData, router]);

  return (
    <div className="flex h-screen w-full">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="iphone-spinner mt-[2px]" aria-label="Loading" role="status">
            <div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>
      )}

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="bg-white border border-white/20 shadow-2xl max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Cancel Payment?</DialogTitle>
            <DialogDescription className="text-gray-700 mt-2">
              Are you sure you want to cancel your payment? Your progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="bg-black relative overflow-hidden shimmer rounded-full font-semibold cursor-pointer border border-white/30 hover:bg-black/80"
            >
              <span className="absolute inset-0 shimmer" aria-hidden="true"></span>
              <span className="relative z-10">Continue Payment</span>
            </Button>
            <Button
              variant="destructive"
              onClick={() => router.push('https://loopsync.cloud')}
              className="bg-red-500 rounded-full font-semibold cursor-pointer border border-white/30 hover:bg-red-600"
            >
              Cancel Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentSuccessModal} onOpenChange={setShowPaymentSuccessModal}>
        <DialogContent className="bg-white border border-white/20 shadow-2xl max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Payment Successful
            </DialogTitle>
            <DialogDescription className="text-gray-700 mt-2">
              {paymentSuccessData && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{(paymentSuccessData.amount / 100).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Amount Paid</div>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Start Date</div>
                        <div className="font-medium">{paymentSuccessData.startDate}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">End Date</div>
                        <div className="font-medium">{paymentSuccessData.endDate}</div>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 col-span-2"></div>
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div className="font-medium">{paymentSuccessData.duration}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Charge</div>
                        <div className="font-medium">{paymentSuccessData.billingCycle}</div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 text-center text-sm text-gray-500">
                    {isProcessingSuccess ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Account activation in progress
                      </div>
                    ) : (
                      "Account activation in progress"
                    )}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className={`relative flex-1 bg-black flex flex-col p-8 ${isLoading ? 'blur-sm' : ''}`}>
        <div className="absolute bottom-0 left-0 right-0 h-[5%] opacity-100 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 1200 600" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <pattern id="zebraPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="#000" />
                <rect width="20" height="40" fill="#fff" />
              </pattern>
            </defs>
            <rect width="1200" height="600" fill="url(#zebraPattern)" />
          </svg>
        </div>
        <div className="flex items-center mb-8">
          <img src="/resources/logo.svg" alt="LoopSync Logo" className="h-7 w-auto" />
        </div>
        <div className="flex space-x-4" style={{ height: '500px' }}>
          <div className="flex-[0.3] bg-transparent rounded-lg p-6" style={{ height: '350px' }}></div>
          <div className="flex-[0.7] mr-10 bg-transparent rounded-lg p-6" style={{ height: '650px' }}>
            <div className="flex items-center justify-between mb-4 ml-11 mr-6">
              <div
                className="flex items-center cursor-pointer text-white px-4 py-2 border border-white/10 rounded-full hover:bg-white/10 transition-all"
                onClick={() => setShowCancelModal(true)}
              >
                <ArrowLeft className="h-4 w-4 mr-2 mt-0.5" />
                <span className="text-white text-[16px] font-medium">Back</span>
              </div>
              <span className="text-[12px] px-3 py-1 rounded-full font-bold tracking-wide bg-white border border-black text-black shadow-md backdrop-blur-sm">
                {formatPlanName('PRO_PRIME-X')}
              </span>
            </div>
            <h2 className="text-[16px] ml-11 font-medium text-white/70 mb-6">
              Upgrade to <br />
              <span className="font-semibold text-white">
                LoopSync One Window™ {formatPlanName('PRO_PRIME-X')}
              </span>
            </h2>
            <div className="flex items-center ml-11 mt-2 gap-3">
              <span className="text-white text-[38px] font-bold leading-none">
                {getDisplayAmount()}
              </span>
              <div className="flex flex-col leading-none mt-1">
                <span className="text-white text-[14px] font-semibold">per</span>
                <span className="text-white text-[14px] font-semibold">
                  {billingCycle === 'annual' ? 'year' : 'month'}
                </span>
              </div>
            </div>
            <div className="ml-11 mt-4 flex items-center gap-3">
              <div className="inline-flex rounded-full border border-white/20 bg-white/5 p-1">
                <button
                  className={`px-4 py-1 text-sm font-semibold rounded-full transition-all ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-white'}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-4 py-1 text-sm font-semibold rounded-full transition-all ${billingCycle === 'annual' ? 'bg-white text-black' : 'text-white'}`}
                  onClick={() => setBillingCycle('annual')}
                >
                  Annual
                </button>
              </div>
              {billingCycle === 'annual' && (
                <span className="text-[11px] px-3 py-1 rounded-full font-bold tracking-wide bg-green-500/20 text-green-300 border border-green-500/30">
                  Save ₹3,000
                </span>
              )}
            </div>
            <div className="ml-11 mt-7 mb-6 border-b border-dashed border-white/20" style={{ width: '330px' }}></div>
            <div className="ml-11 mt-8">
              <div className="flex items-center gap-3">
                <img src="/icon.svg" alt="LoopSync Logo" className="h-8 w-auto opacity-100 rounded-full invert" />
                <span className="text-white text-[16px] font-semibold tracking-wide opacity-100">One Window™</span>
              </div>
              <div className="flex items-start gap-2 mt-2 ml-[44px] cursor-pointer">
                <span className="text-white text-[14px] mb-4 font-medium opacity-70 leading-snug max-w-[350px] text-justify">
                  A cloud based single, intelligent framework that sees, understands,
                  and reasons across anything you face, from complex calculations to
                  intricate code and more.
                </span>
              </div>
            </div>
            <div className="ml-11 mt-5 mb-6 border-b border-dashed border-white/20" style={{ width: '330px' }}></div>
            <div className="ml-11 w-[330px] text-white space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-semibold">Subtotal</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold">
                    {getDisplayAmount()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-medium">Tax</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-white ml-1 mt-0.5 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[220px]">
                      <p className="text-black text-justify font-medium">Taxes are applied based on local laws and added at checkout.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-[14px] font-semibold">Incl. of 18% GST</span>
              </div>
            </div>
            <div className="ml-11 mt-5 mb-6 border-b border-dashed border-white/20" style={{ width: '330px' }}></div>
            <div className="ml-11 w-[330px] text-white space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-semibold">Total due today</span>
                <span className="text-[18px] font-bold">{getDisplayAmount()}</span>
              </div>
            </div>
            <div className="ml-11 mt-3 w-[330px]">
              <div className="bg-white/5 text-white/70 text-center border border-black px-3 py-2 rounded-none font-semibold text-[12px] flex items-center justify-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 bg-white/10 relative overflow-hidden shimmer">
                  <ShieldCheck className="w-3 h-3 text-white opacity-90 stroke-3" />
                </span>
                <span>Checkout Experience by <span className="text-white font-bold">TOUCHPAY.ONE</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`relative flex-1 bg-white flex flex-col items-center p-8 ${isLoading ? 'blur-sm' : ''}`} style={{ overflowY: 'auto' }}>
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 pt-5">Payment Information</h1>
          <div className="mt-4 rounded-xl w-full p-4 bg-white border border-black/5">
            <div className="flex justify-between items-center">
              <span className="text-black text-[14px] font-semibold">Billing Address</span>
              <button
                className="flex items-center text-sm font-semibold text-black"
                onClick={() => setShowBillingForm(!showBillingForm)}
              >
                {showBillingForm ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                {showBillingForm ? 'Hide' : 'Edit'}
              </button>
            </div>
            <div className="mt-2 text-xs uppercase text-gray-700">
              <div>{billingAddress.addressLine1 || '—'}</div>
              {billingAddress.addressLine2 && <div>{billingAddress.addressLine2}</div>}
              <div>{[billingAddress.city, billingAddress.state, billingAddress.country].filter(Boolean).join(', ')}</div>
              <div>PIN {billingAddress.pinCode || '—'} • {billingAddress.phoneNumber || '—'}</div>
            </div>
          </div>

          <div className="rounded-xl w-full p-4 bg-white border border-black/5 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-black text-[14px] font-semibold">Email</span>
              <span className="text-black text-[14px] font-semibold">{email || 'your@email.com'}</span>
            </div>
          </div>
          <div className="mt-8 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h2>
            <div className="border border-black/5 rounded-xl p-4 space-y-4 bg-white">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment-method"
                    className="h-4 w-4 accent-black cursor-pointer"
                    checked={selectedPaymentMethod === 'razorpay'}
                    onChange={() => setSelectedPaymentMethod('razorpay')}
                  />
                  <span className="text-black font-semibold text-[14px]">Pay using Razorpay</span>
                </div>
                <img src="/payment/razorpay.png" alt="Razorpay" className="h-5 filter brightness-0" />
              </label>
              <div className="bg-[repeating-linear-gradient(50deg,#ffffff_0px,#ffffff_10px,#f5f5f5_10px,#f5f5f5_20px)] border border-black/5 rounded-xl p-4 mt-3 flex items-start">
                <div className="mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black mb-1">Secure Payment</h4>
                  <p className="text-black text-xs leading-relaxed">
                    Payments made in <span className="font-bold inline-flex items-center relative top-0.5"><img src="/flags/india.svg" alt="India Flag" className="h-3 w-auto mr-1" />INDIA</span> are processed securely through Razorpay’s PCI-DSS compliant infrastructure.
                  </p>
                </div>
              </div>
              {selectedPaymentMethod === 'razorpay' && showBillingForm && (
                <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-white">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Billing Details</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 1 *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 uppercase font-semibold text-gray-900"
                        value={billingAddress.addressLine1}
                        onChange={(e) => {
                          if (e.target.value.length <= 300) {
                            setBillingAddress({ ...billingAddress, addressLine1: e.target.value });
                          }
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 2</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 uppercase font-semibold text-gray-900"
                        value={billingAddress.addressLine2}
                        onChange={(e) => {
                          if (e.target.value.length <= 300) {
                            setBillingAddress({ ...billingAddress, addressLine2: e.target.value });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 uppercase font-semibold text-gray-900"
                        value={billingAddress.phoneNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                          setBillingAddress({ ...billingAddress, phoneNumber: val });
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 uppercase font-semibold text-gray-900"
                        value={billingAddress.city}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, 100);
                          setBillingAddress({ ...billingAddress, city: val });
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 uppercase font-semibold text-gray-900"
                        value={billingAddress.pinCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                          setBillingAddress({ ...billingAddress, pinCode: val });
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Country *</label>
                      <Select
                        value={billingAddress.country}
                        onValueChange={(value) => {
                          setBillingAddress({ ...billingAddress, country: value, state: '' });
                          setSelectedCountry(value);
                        }}
                      >
                        <SelectTrigger className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-900 font-semibold">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.filter(c => c.code !== 'us').map((c) => (
                            <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                      <Select
                        value={billingAddress.state}
                        onValueChange={(value) => setBillingAddress({ ...billingAddress, state: value })}
                        disabled={!billingAddress.country}
                      >
                        <SelectTrigger className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-900 font-semibold">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {getStates().map((s, i) => (
                            <SelectItem key={i} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-black/5 bg-white p-4">
            <div className="flex items-center">
              <Checkbox id="save-details" defaultChecked className="h-4 w-4 border-1 cursor-pointer border-black text-black" />
              <label htmlFor="save-details" className="ml-2 cursor-pointer block text-sm font-semibold text-black">Save payment details for quicker checkout</label>
            </div>
            <p className="mt-1 ml-6 text-xs text-gray-500">Your details are encrypted and used only for payments inside LoopSync</p>
          </div>
          <div className="mt-8">
            <button
              className={`w-full py-3 px-4 rounded-lg font-semibold text-base flex items-center justify-center ${(selectedPaymentMethod === 'razorpay' &&
                billingAddress.addressLine1 &&
                billingAddress.phoneNumber &&
                billingAddress.city &&
                billingAddress.pinCode &&
                billingAddress.country &&
                billingAddress.state &&
                billingAddress.phoneNumber.length === 10 &&
                billingAddress.pinCode.length === 6)
                ? "bg-black text-white hover:bg-black/80 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              onClick={handleSubscribe}
              disabled={isSubscribing || !(
                selectedPaymentMethod === 'razorpay' &&
                billingAddress.addressLine1 &&
                billingAddress.phoneNumber &&
                billingAddress.city &&
                billingAddress.pinCode &&
                billingAddress.country &&
                billingAddress.state &&
                billingAddress.phoneNumber.length === 10 &&
                billingAddress.pinCode.length === 6
              )}
            >
              {isSubscribing ? (
                <div className="iphone-spinner mr-2" aria-label="Loading" role="status">
                  <div></div><div></div><div></div><div></div><div></div><div></div>
                  <div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
              ) : (
                "Upgrade"
              )}
            </button>
          </div>
          {isSubscribing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
              <div className="flex flex-col items-center">
                <div className="iphone-spinner mb-4" aria-label="Loading" role="status">
                  <div></div><div></div><div></div><div></div><div></div><div></div>
                  <div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
                <span className="text-white text-lg font-semibold">Processing your payment...</span>
              </div>
            </div>
          )}
          <div className="mt-4 text-center mb-8">
            <p className="text-xs text-black">
              By upgrading, you agree to recurring <a href="https://loopsync.cloud/policies" className="font-semibold underline">LoopSync One Window</a>™ charges<br />
              under our <a href="https://loopsync.cloud/policies/terms-of-use" className="font-semibold underline">terms</a> and <a href="https://loopsync.cloud/policies/privacy-policy" className="font-semibold underline">privacy</a> policies until you cancel.
            </p>
          </div>
          <Dialog open={showBankModal} onOpenChange={setShowBankModal}>
            <DialogContent className="bg-white border border-black/20 max-w-md w-full rounded-2xl h-[650px] p-0 flex flex-col">
              <DialogHeader className="border-b border-black/5 px-6 py-4">
                <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center justify-between">
                  <span>Select Bank</span>
                  <button onClick={() => setShowBankModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </DialogTitle>
                <DialogDescription className="text-gray-700 font-medium">Choose your preferred bank for Net Banking payment</DialogDescription>
              </DialogHeader>
              <div className="px-6 py-4 overflow-hidden flex-1 flex flex-col">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search banks..."
                    className="pl-10 pr-4 py-5 text-sm w-full text-black border border-black/10 rounded-xl font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                  <div className="space-y-2">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <div
                          key={bank.id}
                          onClick={() => {
                            setSelectedBank(bank.id);
                            setShowBankModal(false);
                          }}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedBank === bank.id ? 'bg-black/5' : 'hover:bg-gray-100'
                            }`}
                        >
                          <img src={bank.icon} alt={`${bank.name} logo`} className="h-7 w-7 mr-3 rounded-md" />
                          <span className="text-black font-medium text-sm">{bank.name}</span>
                          {selectedBank === bank.id && (
                            <svg className="ml-auto h-5 w-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 1 1 1.414 1.414l-8 8a1 1 0 1 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 1 1 1.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm font-medium">No banks found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="border-t border-gray-200 px-6 py-4">
                <Button onClick={() => setShowBankModal(false)} disabled={!selectedBank} className="w-full bg-black py-6 text-white font-semibold hover:bg-black/80 disabled:opacity-50">Confirm Selection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <style jsx>{`
        .shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          height: 100%;
          width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          animation: shimmer 2.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes shimmer { 0% { left: -150%; } 60% { left: 120%; } 100% { left: 120%; } }
      `}</style>
    </div>
  );
};

export default UpgradeCheckoutPage;
