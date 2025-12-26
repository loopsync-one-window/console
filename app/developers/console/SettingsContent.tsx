import React, { useState } from "react";
import { Maximize2, Key, Trash2, CheckCircle2, Copy, X, Upload, Edit2, Settings, Loader2 } from "lucide-react";
import {
    getDeveloperProfile, updateDeveloperProfile, updateDeveloperAvatar,
    getDeveloperApiKeys, rollDeveloperApiKey, createDeveloperApiKey, deleteDeveloperApiKey,
    getDeveloperNotifications, updateDeveloperNotifications,
    deleteDeveloperAccount,
    DeveloperProfile, ApiKey, DeveloperNotifications
} from "@/lib/api";

export default function SettingsContent() {
    const [profile, setProfile] = useState<DeveloperProfile | null>(null);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [notifications, setNotifications] = useState<DeveloperNotifications | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newKeyModal, setNewKeyModal] = useState<{ open: boolean, key: string }>({ open: false, key: "" });
    const [confirmModal, setConfirmModal] = useState<{ open: boolean, type: 'roll' | 'delete', keyId: string, title: string, message: string }>({ open: false, type: 'roll', keyId: "", title: "", message: "" });
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [prof, keys, notifs] = await Promise.all([
                    getDeveloperProfile(),
                    getDeveloperApiKeys(),
                    getDeveloperNotifications()
                ]);
                setProfile(prof);
                setApiKeys(keys.keys);
                setNotifications(notifs);
            } catch (error) {
                console.error("Failed to load settings", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleUpdateProfile = async (field: keyof DeveloperProfile, value: string) => {
        if (!profile) return;
        // Optimistic update
        setProfile({ ...profile, [field]: value });
        try {
            await updateDeveloperProfile({ [field]: value });
        } catch (e) { console.error(e); }
    };

    const handleRollKeyConfirm = (keyId: string) => {
        setConfirmModal({
            open: true,
            type: 'roll',
            keyId,
            title: "Roll API Key?",
            message: "Are you sure you want to regenerate this key? The old key will stop working immediately."
        });
    };

    const handleDeleteKeyConfirm = (keyId: string) => {
        setConfirmModal({
            open: true,
            type: 'delete',
            keyId,
            title: "Delete API Key?",
            message: "Are you sure you want to delete this key? Any application using it will stop working immediately. This action cannot be undone."
        });
    };

    const handleConfirmAction = async () => {
        setConfirmModal({ ...confirmModal, open: false });
        try {
            if (confirmModal.type === 'roll') {
                const { newKey } = await rollDeveloperApiKey(confirmModal.keyId);
                setNewKeyModal({ open: true, key: newKey });
            } else if (confirmModal.type === 'delete') {
                await deleteDeveloperApiKey(confirmModal.keyId);
            }
            // Refresh keys
            const keys = await getDeveloperApiKeys();
            setApiKeys(keys.keys);
        } catch (e) {
            alert(`Failed to ${confirmModal.type} key`);
        }
    };

    const handleCreateKey = async () => {
        try {
            const { key } = await createDeveloperApiKey("production");
            setNewKeyModal({ open: true, key: key });
            const keys = await getDeveloperApiKeys();
            setApiKeys(keys.keys);
        } catch (e) {
            alert("Failed to create key");
        }
    };

    const handleToggleNotification = async (field: keyof DeveloperNotifications) => {
        if (!notifications) return;
        const newValue = !notifications[field];
        // Optimistic update
        setNotifications({ ...notifications, [field]: newValue });
        try {
            await updateDeveloperNotifications({ [field]: newValue });
        } catch (e) {
            // Revert
            setNotifications({ ...notifications, [field]: !newValue });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteDeveloperAccount(true);
            window.location.href = "/";
        } catch (e) {
            alert("Failed to delete account");
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        setUploadingAvatar(true);

        try {
            const { avatarUrl } = await updateDeveloperAvatar(file);
            setProfile({ ...profile, avatarUrl: `${avatarUrl}?t=${Date.now()}` });
        } catch (e) {
            console.error("Failed to upload avatar", e);
            alert("Failed to upload avatar");
        } finally {
            setUploadingAvatar(false);
            // reset input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#d1aea0]" />
        </div>
    );

    return (
        <div className="animate-[fadeIn_0.5s_ease-out] pb-20 relative">
            <div className="mb-10">
                <h1 className="text-3xl font-light text-white mb-2">Settings</h1>
                <p className="text-zinc-500 text-sm">Manage your account, team, and preferences.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">

                {/* Profile Section */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium text-zinc-200">Profile & Visibility</h2>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                        <div className="flex items-start gap-6">
                            <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                                <img src={profile?.avatarUrl || "https://pbs.twimg.com/profile_images/2002969448937050112/l6up6jJp_400x400.jpg"} className="w-20 h-20 rounded-full border-2 border-white/10 shrink-0 bg-zinc-800 object-cover" alt="" />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 className="w-6 h-6 text-white" />
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <EditableField
                                        label="Display Name"
                                        value={profile?.displayName || ''}
                                        onSave={(val) => handleUpdateProfile('displayName', val)}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Email Address</label>
                                        <div className="w-full bg-[#090909] border border-white/5 hover:border-white/5 rounded-xl font-semibold px-4 py-3 text-sm text-zinc-400 cursor-not-allowed mt-2">
                                            {profile?.email}
                                        </div>
                                    </div>
                                </div>
                                <EditableField
                                    label="Bio"
                                    value={profile?.bio || ''}
                                    multiline
                                    minLength={0}
                                    maxLength={600}
                                    onSave={(val) => handleUpdateProfile('bio', val)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Keys */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-zinc-200">API Access</h2>
                        <button className="text-xs text-[#d1aea0] hover:underline" onClick={() => window.open('https://loopsync.cloud/developers/docs', '_blank')}>View Documentation</button>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-4">
                        {apiKeys.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-sm text-zinc-500 mb-4">API access hasn't been configured for this account.</p>
                                <button
                                    onClick={handleCreateKey}
                                    className="px-4 py-2 bg-[#d1aea0] text-black text-sm font-semibold rounded-full hover:bg-white transition-colors"
                                >
                                    Get New Key
                                </button>
                            </div>
                        )}
                        {apiKeys.map(key => (
                            <div key={key.id} className={`flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl ${key.status === 'disabled' ? 'opacity-60' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-lg ${key.type === 'production' ? 'bg-[#d1aea0]/10 text-[#d1aea0]' : 'bg-zinc-800 text-zinc-400'}`}>
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white capitalize">{key.type} Key</p>
                                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{key.prefix}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleRollKeyConfirm(key.id)} className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/5 font-semibold">Roll Key</button>
                                    <button onClick={() => handleDeleteKeyConfirm(key.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Notifications */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium text-zinc-200">Notifications</h2>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Deployment Status</p>
                                    <p className="text-xs text-zinc-500">Get notified when your builds succeed or fail.</p>
                                </div>
                                <ToggleSwitch checked={notifications?.deploymentStatus || false} onChange={() => handleToggleNotification('deploymentStatus')} />
                            </div>
                            <div className="w-full h-px bg-white/5"></div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Payout Updates</p>
                                    <p className="text-xs text-zinc-500">Receive emails about your earnings and transfers.</p>
                                </div>
                                <ToggleSwitch checked={notifications?.payoutUpdates || false} onChange={() => handleToggleNotification('payoutUpdates')} />
                            </div>
                            <div className="w-full h-px bg-white/5"></div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Marketing Emails</p>
                                    <p className="text-xs text-zinc-500">Product updates and newsletters.</p>
                                </div>
                                <ToggleSwitch checked={notifications?.marketingEmails || false} onChange={() => handleToggleNotification('marketingEmails')} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium text-red-500">Danger Zone</h2>
                    <div className="p-6 rounded-3xl border border-red-500/10 bg-red-500/[0.02] backdrop-blur-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Delete Developer Account</p>
                            <p className="text-xs text-zinc-500 mt-1">Permanently remove this workspace and all associated data.</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 rounded-lg bg-red-900 text-white text-xs font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20">
                            Delete Account
                        </button>
                    </div>
                </section>

            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-[#000]/20 border border-white/5 rounded-3xl w-full max-w-md p-6 shadow-2xl scale-100 animate-[scaleIn_0.2s_ease-out]">
                        <div className="flex items-center gap-4 text-red-500 mb-4">
                            <div className="p-3 bg-red-500/10 rounded-full">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">Delete Account?</h3>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                            This action cannot be undone. This will permanently delete your account, all published applications, and remove your data from our servers.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Key Modal */}
            {newKeyModal.open && (
                <NewKeyModal
                    apiKey={newKeyModal.key}
                    onClose={() => setNewKeyModal({ open: false, key: "" })}
                />
            )}

            {/* Modal Layer */}
            {confirmModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl scale-100 animate-[scaleIn_0.2s_ease-out]">
                        <div className="flex items-center gap-4 text-black mb-2">
                            <div className={`p-3 rounded-full ${confirmModal.type === 'delete' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                {confirmModal.type === 'delete' ? <Trash2 className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
                            </div>
                            <h3 className="text-xl font-bold">{confirmModal.title}</h3>
                        </div>
                        <p className="text-zinc-600 text-sm mb-6 leading-relaxed mt-2">
                            {confirmModal.message}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmModal({ ...confirmModal, open: false })}
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors shadow-lg ${confirmModal.type === 'delete' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-black hover:bg-zinc-800 shadow-zinc-200'}`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AvatarModal
                isOpen={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                avatarUrl={profile?.avatarUrl || ""}
                onUpload={() => fileInputRef.current?.click()}
                isUploading={uploadingAvatar}
            />
        </div>
    )
}

function EditableField({ label, value, onSave, multiline, minLength, maxLength }: { label: string, value: string, onSave: (val: string) => void, multiline?: boolean, minLength?: number, maxLength?: number }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [error, setError] = useState("");

    // Update tempValue when prop value changes
    React.useEffect(() => setTempValue(value), [value]);

    const handleSave = () => {
        if (minLength && tempValue.length < minLength) {
            setError(`Minimum ${minLength} characters required`);
            return;
        }
        if (maxLength && tempValue.length > maxLength) {
            setError(`Maximum ${maxLength} characters allowed`);
            return;
        }

        setError("");
        setIsEditing(false);
        if (tempValue !== value) {
            onSave(tempValue);
        }
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
                            className={`w-full bg-black/20 mt-2 border font-semibold rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors min-h-[5rem] resize-none ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#d1aea0]/50'}`}
                            value={tempValue}
                            onChange={(e) => {
                                setTempValue(e.target.value);
                                if (error) setError("");
                            }}
                            onBlur={handleSave} // Might be annoying if validation fails, but standard behavior
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
                            className={`w-full bg-black/20 mt-2 border font-semibold rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#d1aea0]/50'}`}
                            value={tempValue}
                            onChange={(e) => {
                                setTempValue(e.target.value);
                                if (error) setError("");
                            }}
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
                    <span className={`break-words whitespace-pre-wrap w-full pr-2 ${!value ? "text-zinc-600" : ""}`}>
                        {value || "Click to add..."}
                    </span>
                    <Edit2 className="w-3.5 h-3.5 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>
            )}
        </div>
    )
}

function ToggleSwitch({ defaultChecked, onChange, checked }: { defaultChecked?: boolean, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, checked?: boolean }) {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} checked={checked} onChange={onChange} />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d1aea0]"></div>
        </label>
    )
}

function NewKeyModal({ apiKey, onClose }: { apiKey: string, onClose: () => void }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl scale-100 animate-[scaleIn_0.2s_ease-out] relative">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                        <Key className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-black">New API Key Generated</h3>

                    <p className="text-zinc-600 text-sm max-w-xs mx-auto">
                        Make sure to copy it now. You won't be able to see it again.
                    </p>

                    <div className="w-full bg-white border border-zinc-200 rounded-xl p-4 mt-2 flex items-center justify-between gap-4 group hover:border-zinc-300 transition-colors">
                        <code className="text-sm font-mono text-zinc-800 break-all text-left">
                            {apiKey}
                        </code>
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-500 hover:text-black cursor-pointer transition-all shadow-sm"
                            title="Copy to clipboard"
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-zinc-800 transition-colors mt-4"
                    >
                        I've stored it securely
                    </button>

                </div>
            </div>
        </div>
    );
}

function AvatarModal({ isOpen, onClose, avatarUrl, onUpload, isUploading }: { isOpen: boolean, onClose: () => void, avatarUrl: string, onUpload: () => void, isUploading: boolean }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
            onClick={onClose}
        >
            <div
                className="relative flex flex-col items-center gap-8 max-w-2xl w-full animate-[scaleIn_0.2s_ease-out]"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Large Avatar */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-[#0A0A0A]">
                    <img
                        src={avatarUrl || "https://pbs.twig.com/profile_images/2002969448937050112/l6up6jJp_400x400.jpg"}
                        className="w-full h-full object-cover"
                        alt="Profile"
                    />
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <button
                    onClick={onUpload}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    <Upload className="w-4 h-4" />
                    {isUploading ? "Uploading..." : "Change Profile Picture"}
                </button>
            </div>
        </div>
    )
}
