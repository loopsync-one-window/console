import React, { useState } from "react";
import { Download, IndianRupee, ArrowUpRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
    RevenueSummary, RevenueTransaction,
    getRevenueSummary, getRevenueTransactions, exportRevenueReport
} from "@/lib/api";

export default function RevenueContent() {
    const [summary, setSummary] = useState<RevenueSummary | null>(null);
    const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [txLoading, setTxLoading] = useState(false);

    // Initial Load
    React.useEffect(() => {
        const fetchSummary = async () => {
            try {
                const sum = await getRevenueSummary();
                setSummary(sum);
            } catch (e) {
                console.error("Failed to load summary", e);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    // Transaction Fetching with Pagination
    React.useEffect(() => {
        const fetchTxns = async () => {
            try {
                setTxLoading(true);
                const data = await getRevenueTransactions(10, page);
                setTransactions(data.items);
                setTotalPages(data.totalPages);
            } catch (e) {
                console.error("Failed to load transactions", e);
            } finally {
                setTxLoading(false);
            }
        };
        if (!loading) fetchTxns(); // Wait for initial load or run immediately? Better to run immediately.
        else fetchTxns();
    }, [page]); // Re-run when page changes

    const handleExport = async () => {
        try {
            await exportRevenueReport('csv', 'monthly');
        } catch (e) {
            alert("Failed to export report");
        }
    };

    if (loading && !summary) return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#d1aea0]" />
        </div>
    );

    const currencySymbol = summary?.currency === 'INR' ? '₹' : '$';

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-light text-white mb-2">Revenue</h1>
                    <p className="text-zinc-500 text-sm">Manage your earnings and payouts.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] text-white text-sm font-medium rounded-full hover:bg-white/[0.1] transition-colors border border-white/10"
                >
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#d1aea0]/20 to-black border border-[#d1aea0]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-100 transform translate-x-1/4 -translate-y-1/4">
                        <IndianRupee className="w-32 h-32 text-[#d1aea0]" />
                    </div>
                    <p className="text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">Total Earnings</p>
                    <h2 className="text-4xl font-bold text-white mb-1">
                        {currencySymbol}{summary?.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    <p className="text-[#d1aea0] text-sm flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> +{summary?.monthlyGrowthPercent}% this month
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative">
                    <p className="text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">Next Payout</p>
                    <div className="flex items-baseline gap-2 mb-1">
                        <h2 className="text-4xl font-bold text-white">
                            {currencySymbol}{summary?.nextPayout.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <span className={`text-sm ${summary?.nextPayout.status === 'pending' ? 'text-zinc-500' : 'text-emerald-500'}`}>
                            {summary?.nextPayout.status}
                        </span>
                    </div>
                    <p className="text-zinc-500 text-sm">Scheduled for {new Date(summary?.nextPayout.scheduledFor || "").toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </div>

            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Transaction History</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden relative">
                {txLoading && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10 text-[#d1aea0]">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                )}
                <div className="grid grid-cols-4 p-4 border-b border-white/5 text-xs text-zinc-500 font-medium uppercase tracking-wider">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Status</div>
                    <div className="text-right">Amount</div>
                </div>
                {transactions.length > 0 ? transactions.map(txn => (
                    <TransactionRow
                        key={txn.id}
                        date={new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        desc={txn.description}
                        status={txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        amount={`${txn.currency === 'INR' ? '₹' : '$'}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    />
                )) : (
                    <div className="p-8 text-center text-zinc-500 text-sm">No transactions found.</div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-4 mt-4">
                    <span className="text-xs text-zinc-500">Page {page} of {totalPages}</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function TransactionRow({ date, desc, status, amount }: { date: string, desc: string, status: string, amount: string }) {
    return (
        <div className="grid grid-cols-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors text-sm items-center">
            <div className="text-zinc-400">{date}</div>
            <div className="text-white font-medium">{desc}</div>
            <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    {status}
                </span>
            </div>
            <div className="text-right text-white font-mono">{amount}</div>
        </div>
    )
}
