import React, { useState } from "react";
import {
    Landmark,
    CheckCircle2,
    IndianRupee,
    Edit2,
    Shield,
    Eye,
    Loader2
} from "lucide-react";
import {
    getDeveloperProfile,
    getBankingPayoutAccount, updateBankingPayoutAccount,
    getBankingTaxInfo, updateBankingTaxInfo,
    getBankingPayoutSchedule, updateBankingPayoutSchedule,
    uploadBankingPanCard,
    DeveloperProfile, PayoutAccount, TaxInfo, PayoutSchedule
} from "@/lib/api";

function EditableField({ label, value, onSave, multiline, minLength, maxLength, validate, uppercase }: {
    label: string,
    value: string,
    onSave: (val: string) => void,
    multiline?: boolean,
    minLength?: number,
    maxLength?: number,
    validate?: (val: string) => string | null,
    uppercase?: boolean
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [error, setError] = useState("");

    React.useEffect(() => setTempValue(value), [value]);

    const handleSave = () => {
        let val = tempValue.trim();
        if (uppercase) val = val.toUpperCase();

        if (minLength && val.length < minLength) {
            setError(`Minimum ${minLength} characters required`);
            return;
        }
        if (maxLength && val.length > maxLength) {
            setError(`Maximum ${maxLength} characters allowed`);
            return;
        }

        if (validate) {
            const validationError = validate(val);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setError("");
        setIsEditing(false);
        if (val !== value) {
            onSave(val);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let val = e.target.value;
        if (uppercase) val = val.toUpperCase();
        setTempValue(val);
        if (error) setError("");
    };

    return (
        <div className="space-y-2">
            <label className="text-xs mt-2 text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-2 justify-between">
                <span>{label}</span>
                {isEditing && maxLength && (
                    <span className={`text-[10px] ${tempValue.length > maxLength ? 'text-red-500' : 'text-zinc-600'}`}>
                        {tempValue.length} / {maxLength}
                    </span>
                )}
            </label>
            {isEditing ? (
                <>
                    {multiline ? (
                        <textarea
                            className={`w-full bg-black/20 mt-2 border font-semibold rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors min-h-[5rem] resize-none ${uppercase ? 'uppercase' : ''} ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#d1aea0]/50'}`}
                            value={tempValue}
                            onChange={handleChange}
                            onBlur={handleSave}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setIsEditing(false);
                                    setTempValue(value);
                                    setError("");
                                }
                            }}
                        />
                    ) : (
                        <input
                            type="text"
                            className={`w-full bg-black/20 mt-2 border font-semibold rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors ${uppercase ? 'uppercase' : ''} ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#d1aea0]/50'}`}
                            value={tempValue}
                            onChange={handleChange}
                            onBlur={handleSave}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') {
                                    setIsEditing(false);
                                    setTempValue(value);
                                    setError("");
                                }
                            }}
                        />
                    )}
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </>
            ) : (
                <div
                    onClick={() => setIsEditing(true)}
                    className="group cursor-pointer w-full bg-[#090909] mt-2 border border-white/5 hover:border-white/10 rounded-xl px-4 py-2.5 text-sm text-white transition-all hover:bg-white/5 flex items-start justify-between min-h-[42px]"
                >
                    <span className={`break-words whitespace-pre-wrap w-full pr-2 ${!value ? "text-zinc-600" : ""} ${uppercase ? 'uppercase' : ''}`}>
                        {value || "Click to add..."}
                    </span>
                    <Edit2 className="w-3.5 h-3.5 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>
            )}
        </div>
    );
}

function PayoutAccountModal({ isOpen, onClose, currentData, onSave }: { isOpen: boolean, onClose: () => void, currentData: PayoutAccount | null, onSave: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState({
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        ifsc: ""
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        if (currentData) {
            setFormData({
                bankName: currentData.bankName || "",
                accountHolder: currentData.accountHolder || "",
                accountNumber: "",
                ifsc: ""
            });
        }
    }, [currentData, isOpen]);

    const handleSave = async () => {
        setError("");

        // Validations
        if (!formData.bankName.trim()) return setError("Bank Name is required");
        if (!formData.accountHolder.trim()) return setError("Account Holder Name is required");
        if (!formData.accountNumber.match(/^\d{9,18}$/)) return setError("Invalid Account Number (9-18 digits)");
        if (!formData.ifsc.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) return setError("Invalid IFSC Code");

        setSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (e) {
            alert("Failed to save payout account");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl scale-100 animate-[scaleIn_0.2s_ease-out]">
                <h3 className="text-xl font-bold text-black mb-4">Payout Method</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-semibold">Bank Name</label>
                        <input
                            className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2 text-black mt-1 uppercase"
                            value={formData.bankName}
                            onChange={e => {
                                setFormData({ ...formData, bankName: e.target.value.toUpperCase() });
                                if (error) setError("");
                            }}
                            placeholder="HDFC BANK"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-semibold">Account Holder</label>
                        <input
                            className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2 text-black mt-1 uppercase"
                            value={formData.accountHolder}
                            onChange={e => {
                                setFormData({ ...formData, accountHolder: e.target.value.toUpperCase() });
                                if (error) setError("");
                            }}
                            placeholder="JOHN DOE"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-semibold">Account Number</label>
                        <input
                            className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2 text-black mt-1"
                            placeholder="Enter full account number"
                            value={formData.accountNumber}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                setFormData({ ...formData, accountNumber: val });
                                if (error) setError("");
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-semibold">IFSC Code</label>
                        <input
                            className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2 text-black mt-1 uppercase"
                            value={formData.ifsc}
                            onChange={e => {
                                setFormData({ ...formData, ifsc: e.target.value.toUpperCase() });
                                if (error) setError("");
                            }}
                            placeholder="HDFC0001234"
                            maxLength={11}
                        />
                    </div>
                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-zinc-500 hover:bg-zinc-100">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-zinc-800 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Details"}
                    </button>
                </div>
            </div>
        </div>
    )
}

function UploadModal({ isOpen, onClose, title, onUpload }: { isOpen: boolean, onClose: () => void, title: string, onUpload: (file: File) => Promise<void> }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            await onUpload(file);
            onClose();
            setFile(null);
        } catch (e) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl scale-100 animate-[scaleIn_0.2s_ease-out]">
                <h3 className="text-xl font-bold text-black mb-4">{title}</h3>

                <div
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-400'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        accept="image/*,.pdf"
                    />

                    {file ? (
                        <div className="text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Shield className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-semibold text-black truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button onClick={() => setFile(null)} className="text-xs text-red-500 hover:underline mt-2">Remove</button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-12 h-12 bg-zinc-100 text-zinc-400 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-zinc-200 transition-colors">
                                <Shield className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-black">Click to upload or drag & drop</p>
                            <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or PDF</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-zinc-500 hover:bg-zinc-100">Cancel</button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? "Uploading..." : "Upload Document"}
                    </button>
                </div>
            </div>
        </div>
    )
}

function PayoutScheduleModal({ isOpen, onClose, currentDay, onSave }: { isOpen: boolean, onClose: () => void, currentDay: number, onSave: (day: number) => Promise<void> }) {
    const [day, setDay] = useState(currentDay || 1);
    const [saving, setSaving] = useState(false);

    React.useEffect(() => setDay(currentDay || 1), [currentDay]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(day);
            onClose();
        } catch (e) {
            alert("Failed to save schedule");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl scale-100 animate-[scaleIn_0.2s_ease-out]">
                <h3 className="text-xl font-bold text-black mb-4">Payout Schedule</h3>
                <p className="text-sm text-zinc-600 mb-4">Select the day of the month for automatic payouts.</p>

                <div className="flex flex-wrap gap-2">
                    {[1, 5, 10, 15, 20, 25].map(d => (
                        <button
                            key={d}
                            onClick={() => setDay(d)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${day === d ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-zinc-500 hover:bg-zinc-100">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-zinc-800 disabled:opacity-50"
                    >
                        {saving ? "Updating..." : "Update Schedule"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function BankingContent() {
    const [profile, setProfile] = useState<DeveloperProfile | null>(null);
    const [payoutAccount, setPayoutAccount] = useState<PayoutAccount | null>(null);
    const [taxInfo, setTaxInfo] = useState<TaxInfo | null>(null);
    const [payoutSchedule, setPayoutSchedule] = useState<PayoutSchedule | null>(null);
    const [loading, setLoading] = useState(true);

    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Fetch All Data
    const fetchData = async () => {
        try {
            const [p, pa, ti, ps] = await Promise.all([
                getDeveloperProfile(),
                getBankingPayoutAccount().catch(() => null),
                getBankingTaxInfo().catch(() => null),
                getBankingPayoutSchedule().catch(() => null)
            ]);
            setProfile(p);
            setPayoutAccount(pa);
            setTaxInfo(ti);
            setPayoutSchedule(ps);
        } catch (e) {
            console.error("Failed to load banking data", e);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateTax = async (field: 'gstin' | 'pan' | 'billingAddress' | 'panCardUrl', value: string) => {
        try {
            await updateBankingTaxInfo({ [field]: value });
            if (taxInfo) setTaxInfo({ ...taxInfo, [field]: value });
        } catch (e) { alert(`Failed to update ${field}`); }
    };

    const handlePanUpload = async (file: File) => {
        const { panCardUrl } = await uploadBankingPanCard(file);
        if (taxInfo) setTaxInfo({ ...taxInfo, panCardUrl });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#d1aea0]" />
        </div>
    );

    const currencySymbol = profile?.financials?.currency === 'INR' ? '₹' : '$';
    const totalPaid = profile?.financials?.totalPaid || 0;
    const taxes = totalPaid > 0 ? (totalPaid - (totalPaid / 1.18)) : 0;
    const baseAmount = totalPaid - taxes;

    return (
        <div className="animate-[fadeIn_0.5s_ease-out] pb-20">
            <div className="mb-10">
                <h1 className="text-3xl font-light text-white mb-2">Banking & Payouts</h1>
                <p className="text-zinc-500 text-sm">Manage where you receive funds and billing details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payout Method */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium text-zinc-200">Payout Method</h2>
                    <div className="flex-1 p-8 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-black border border-white/5 relative overflow-hidden group min-h-[14rem]">
                        <div className="absolute top-0 right-0 p-8 opacity-100 group-hover:opacity-100 transition-opacity">
                            <Landmark className="w-32 h-32 text-[#fff]/5" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-white tracking-wide">{payoutAccount?.bankName || "NO ACCOUNT LINKED"}</p>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">{payoutAccount?.isPrimary ? "Primary Account" : "Secondary Account"}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-2xl font-mono text-white tracking-widest">
                                    {payoutAccount?.accountLast4 ? `•••• •••• ${payoutAccount.accountLast4}` : "---- ---- ----"}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Account Holder</p>
                                        <p className="text-sm text-zinc-300 font-medium uppercase">{payoutAccount?.accountHolder || "---"}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPayoutModal(true)}
                                        className="text-xs bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                                    >
                                        {payoutAccount ? "Add / Change Account" : "Add / Change Account"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tax & Address */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium text-zinc-200">Tax & Billing</h2>
                    <div className="flex-1 p-6 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-black border border-white/5 backdrop-blur-xl flex flex-col">

                        <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white">Tax Verification</p>
                                    <p className="text-xs text-zinc-500">PAN Status</p>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${taxInfo?.status === 'verified' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'}`}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium uppercase">{taxInfo?.status || "Pending"}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <EditableField
                                                label="Permanent Account Number (PAN)"
                                                value={taxInfo?.pan || ""}
                                                onSave={(val) => handleUpdateTax('pan', val)}
                                                maxLength={10}
                                                uppercase
                                                validate={(val) => !val.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/) ? "Invalid PAN format" : null}
                                            />
                                        </div>

                                        {/* PAN URL Field Wrapper */}
                                        <div className="w-1/3 pt-2">
                                            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block opacity-0">Upload</label>
                                            {taxInfo?.panCardUrl ? (
                                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 w-full h-[42px]">
                                                    <div className="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center shrink-0">
                                                        <Shield className="w-3 h-3 text-zinc-400" />
                                                    </div>
                                                    <span className="text-xs text-white truncate flex-1">Uploaded</span>
                                                    <a href={taxInfo.panCardUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowUploadModal(true)}
                                                    className="w-full h-[42px] flex items-center justify-center gap-2 border border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl hover:bg-white/5 transition-all group"
                                                >
                                                    <Shield className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400" />
                                                    <span className="text-xs text-zinc-500 group-hover:text-zinc-300 font-medium">Upload Card</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <EditableField
                                        label="Billing Address"
                                        value={taxInfo?.billingAddress || ""}
                                        multiline
                                        onSave={(val) => handleUpdateTax('billingAddress', val)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium text-zinc-200 mb-4">License & Registration</h2>
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-base font-bold text-white tracking-wide">Developer License</p>
                            <p className="text-sm text-zinc-500">{profile?.license || "Standard License"}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${profile?.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                            {profile?.status === 'ACTIVE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full bg-yellow-500" />}
                            <span className="text-xs font-bold uppercase tracking-wider">{profile?.status === 'ACTIVE' ? 'Paid' : 'Pending'}</span>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-white/5 pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Registration Fee</span>
                            <span className="font-mono text-white">{currencySymbol}{(baseAmount * 0.5).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Taxes (18%)</span>
                            <span className="font-mono text-white">{currencySymbol}{taxes.toFixed(2)}</span>
                        </div>

                        <div className="py-4 border-t border-b border-white/5">
                            <div className="flex items-start gap-4">
                                <img src="/verified/badge.svg" alt="Verified Badge" className="h-5 w-5 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">Verified Developer Identity</p>
                                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed max-w-md">
                                        Stand out as a trusted developer with a verified badge that boosts profile visibility and user confidence.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-sm font-mono text-white">{currencySymbol}{(baseAmount * 0.5).toFixed(2)}</span>
                                    {profile?.verifiedBadge && <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">ACTIVE</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-base font-medium text-white">Total Paid</span>
                            <span className="text-xl font-bold text-white">{currencySymbol}{totalPaid.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-lg font-medium text-zinc-200 mb-4">Payout Schedule</h2>
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#d1aea0]/10 flex items-center justify-center text-[#d1aea0]">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{payoutSchedule?.type === "automatic" ? "Automatic Payouts" : "Manual Payouts"}</p>
                            <p className="text-xs text-zinc-500">Payouts are processed on the {payoutSchedule?.day || 1}{payoutSchedule?.day === 1 ? 'st' : payoutSchedule?.day === 2 ? 'nd' : payoutSchedule?.day === 3 ? 'rd' : 'th'} of every month.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">Next payout: <span className="text-white font-mono">{payoutSchedule?.nextPayout ? new Date(payoutSchedule.nextPayout).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "--"}</span></span>
                        <div className="h-4 w-[1px] bg-white/10 mx-4"></div>
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="text-xs text-[#d1aea0] font-medium hover:underline"
                        >
                            Change Schedule
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PayoutAccountModal
                isOpen={showPayoutModal}
                onClose={() => setShowPayoutModal(false)}
                currentData={payoutAccount}
                onSave={async (data) => {
                    await updateBankingPayoutAccount(data);
                    fetchData();
                }}
            />

            <PayoutScheduleModal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                currentDay={payoutSchedule?.day || 1}
                onSave={async (day) => {
                    await updateBankingPayoutSchedule({ day });
                    fetchData();
                }}
            />

            <UploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                title="Upload PAN Card"
                onUpload={handlePanUpload}
            />
        </div>
    )
}
