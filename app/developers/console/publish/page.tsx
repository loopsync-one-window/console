"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
    ChevronLeft,
    Upload,
    Image as ImageIcon,
    Monitor,
    Smartphone,
    Globe,
    Plus,
    X,
    Check,
    Copy,
    Video,
    Layout,
    ShieldCheck,
    FileCode,
    Settings,
    IndianRupee,
    Tag,
    Globe2,
    Mail,
    Cpu,
    Save,
    Rocket,
    ChevronDown,
    Loader2,
    AlertCircle,
    CheckCircle,
    Folder
} from "lucide-react";
import JSZip from 'jszip';

import { useSearchParams } from "next/navigation";
import { publishApp, getApp, updateApp, deployApp, getAssetUploadUrl, updateAppAssets, getBuildUploadUrl, verifyApp } from "@/lib/api";
import { useRouter } from "next/navigation";

type SectionId = 'general' | 'presence' | 'details' | 'distribution' | 'build' | 'reviewer';

function PublishAppContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get('edit');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [warningModalOpen, setWarningModalOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    const showWarning = (msg: string) => {
        setWarningMessage(msg);
        setWarningModalOpen(true);
    };

    const { toast } = useToast();

    const [activeSection, setActiveSection] = useState<SectionId>('build');
    const [mounted, setMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [appId, setAppId] = useState<string | null>(null);

    // Form States
    // General
    const [appName, setAppName] = useState("");
    const [version, setVersion] = useState("1.0.0");
    const [category, setCategory] = useState("productivity");
    const [customCategory, setCustomCategory] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [platforms, setPlatforms] = useState<string[]>(['web']);
    const [tagInput, setTagInput] = useState("");
    const [distributionMode, setDistributionMode] = useState<'global' | 'manual'>('global');
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

    // Details
    const [shortDesc, setShortDesc] = useState("");
    const [fullDesc, setFullDesc] = useState("");
    const [website, setWebsite] = useState("");
    const [supportEmail, setSupportEmail] = useState("");

    // Distribution
    const [pricing, setPricing] = useState("free");
    const [price, setPrice] = useState("");

    // Assets & Build State (Use refs for file inputs to keep UI clean)
    const bannerRef = React.useRef<HTMLInputElement>(null);
    const iconRef = React.useRef<HTMLInputElement>(null);
    const videoRef = React.useRef<HTMLInputElement>(null);
    const screenshotRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    const buildRef = React.useRef<HTMLInputElement>(null);

    const [bannerUrl, setBannerUrl] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [screenshots, setScreenshots] = useState<string[]>(Array(6).fill(""));
    const [verifyKey, setVerifyKey] = useState<string>("");
    const [buildUploaded, setBuildUploaded] = useState(false);

    // Reviewer Info State
    const [revTestCreds, setRevTestCreds] = useState("");
    const [revFunctionality, setRevFunctionality] = useState("");
    const [revLimitations, setRevLimitations] = useState("");
    const [revGuidance, setRevGuidance] = useState("");
    const [revDeclaration, setRevDeclaration] = useState(false);

    // Verification UI State

    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'analyzing' | 'verifying' | 'success' | 'error'>('idle');
    const [verificationError, setVerificationError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (field: string, value: any) => {
        let newErrors = { ...errors };

        if (field === 'appName') {
            if (value.length < 2) newErrors.appName = "Name must be at least 2 characters";
            else delete newErrors.appName;
        }
        if (field === 'fullDesc') {
            if (value.length < 10) newErrors.fullDesc = "Description must be at least 10 characters";
            else delete newErrors.fullDesc;
        }
        if (field === 'website') {
            // Simple URL regex
            const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
            if (value && !urlRegex.test(value)) newErrors.website = "Invalid URL format";
            else delete newErrors.website;
        }
        if (field === 'supportEmail') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) newErrors.supportEmail = "Invalid email format";
            else delete newErrors.supportEmail;
        }

        setErrors(newErrors);
    };

    useEffect(() => {
        setMounted(true);
        if (editId) {
            setAppId(editId);
            setIsSaving(true);
            getApp(editId).then(data => {
                if (data.status === 'review') {
                    toast({
                        title: "In Review",
                        description: "This application is currently pending review and cannot be edited.",
                    });
                    router.push('/developers/console');
                    return;
                }
                setAppName(data.name || "");
                setVersion(data.version || "1.0.0");
                setCategory(data.category || "productivity");
                setCustomCategory(data.customCategory || "");
                setTags(data.tags || []);
                setPlatforms(data.platforms || ['web']);
                setShortDesc(data.shortDescription || "");
                setFullDesc(data.fullDescription || "");
                setWebsite(data.website || "");
                setSupportEmail(data.supportEmail || "");
                setPricing(data.pricingModel || "free");
                setPrice(data.price?.toString() || "");
                setDistributionMode(data.distributionMode as 'global' | 'manual' || 'global');
                setSelectedRegions(data.distributionRegions || []);
                if (data.bannerUrl) setBannerUrl(data.bannerUrl);
                if (data.videoUrl) setVideoUrl(data.videoUrl);
                if (data.icons?.['512']) setIconUrl(data.icons['512']);
                if (data.screenshots && Array.isArray(data.screenshots)) {
                    const loaded = Array(6).fill("");
                    data.screenshots.forEach((url: string, i: number) => {
                        if (i < 6) loaded[i] = url;
                    });
                    setScreenshots(loaded);
                }

                console.log("App Data Loaded:", data);
                if (data.verifyKey) {
                    setVerifyKey(data.verifyKey);
                } else {
                    // Start polling or set a placeholder if key is missing (likely generated but not yet returned due to stale client?)
                    // With previous backend fix, it should return the key.
                    setVerifyKey("KEY_GENERATION_FAILED_RETRY");
                }

                if (data.reviewerInfo) {
                    const info = data.reviewerInfo as any;
                    setRevTestCreds(info.testCredentials || "");
                    setRevFunctionality(info.functionality || "");
                    setRevLimitations(info.limitations || "");
                    setRevGuidance(info.guidance || "");
                }
                if (data.reviewerDeclaration) {
                    setRevDeclaration(data.reviewerDeclaration);
                }

                if (data.buildUrl) {
                    setBuildUploaded(true);
                }
            }).catch(e => {
                console.error(e);
                if (e?.statusCode === 403 || e?.message?.toLowerCase().includes("terminated")) {
                    toast({
                        title: "Access Denied",
                        description: "This app has been terminated due to policy violations.",
                        variant: "destructive"
                    });
                    router.push('/developers/console');
                }
            }).finally(() => setIsSaving(false));
        } else {
            setIsCreateModalOpen(true);
        }
    }, [editId]);

    const handleCreateApp = async () => {
        if (!appName.trim()) return;
        setIsSaving(true);
        try {
            const res = await publishApp({ name: appName });
            if (res && res.id) {
                setAppId(res.id);
                router.replace(`/developers/console/publish?edit=${res.id}`);
                setIsCreateModalOpen(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };




    const regionsList = [
        "India"
    ];

    const toggleRegion = (region: string) => {
        setSelectedRegions(prev =>
            prev.includes(region)
                ? prev.filter(r => r !== region)
                : [...prev, region]
        );
    };


    const handleSave = async () => {
        if (!appName) {
            showWarning("Application Name is required");
            return;
        }
        setIsSaving(true);
        try {
            let currentAppId = appId;
            if (!currentAppId) {
                const res = await publishApp({
                    name: appName,
                    status: 'draft',
                    color: 'bg-white'
                });
                currentAppId = res.id;
                setAppId(res.id);
            }

            if (currentAppId) {
                await updateApp(currentAppId, {
                    name: appName,
                    version,
                    category,
                    customCategory,
                    tags,
                    platforms,
                    shortDescription: shortDesc,
                    fullDescription: fullDesc,
                    website,
                    supportEmail,
                    pricingModel: pricing,
                    price: parseFloat(price) || 0,
                    distributionMode,
                    distributionRegions: selectedRegions,
                    reviewerInfo: {
                        testCredentials: revTestCreds,
                        functionality: revFunctionality,
                        limitations: revLimitations,
                        guidance: revGuidance,
                    },
                    reviewerDeclaration: revDeclaration
                });
            }

            if (!appId) router.push('/developers/console');
        } catch (e) {
            console.error(e);
            showWarning("Failed to save app");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!appId) return;

        // Validation
        const missingFields = [];

        // General Info
        if (!appName.trim()) missingFields.push("Application Name");
        if (!category) missingFields.push("Primary Category");
        if (!version.trim()) missingFields.push("Current Version");
        if (platforms.length === 0) missingFields.push("Supported Platforms");
        if (tags.length === 0) missingFields.push("Tags");

        // Listing Details
        if (!shortDesc.trim()) missingFields.push("Short Description");
        if (!fullDesc.trim()) missingFields.push("Full Description");
        if (!website.trim()) missingFields.push("Official Website");
        if (!supportEmail.trim()) missingFields.push("Support Email");
        if (!bannerUrl) missingFields.push("Feature Graphics / Banner");
        if (!iconUrl) missingFields.push("Application Logo");
        if (screenshots.filter(s => s).length < 3) missingFields.push("Screenshots (Min 3)");

        // Reviewer Info
        if (!revTestCreds.trim()) missingFields.push("Test Credentials");
        if (!revFunctionality.trim()) missingFields.push("App Functionality");
        if (!revLimitations.trim()) missingFields.push("Known Limitations");
        if (!revGuidance.trim()) missingFields.push("Review Guidance");
        if (!revDeclaration) missingFields.push("Review Declaration");

        // Distribution
        if (!appId) return;

        const showValidationToast = (field: string) => {
            toast({
                title: "Action Required",
                description: <span className="font-medium">This field is required. Please provide a valid <span className="text-[#000] font-bold">{field}</span></span>,
                className: "bg-[#fff] border border-[#fff] text-[#000] rounded-2xl w-auto max-w-md [&_[toast-close]]:text-black [&_[toast-close]]:opacity-100",
                variant: 'default'
            });
        };

        // General Info
        if (!appName.trim()) { showValidationToast("Application Name"); return; }
        if (!category) { showValidationToast("Primary Category"); return; }
        if (!version.trim()) { showValidationToast("Current Version"); return; }
        if (platforms.length === 0) { showValidationToast("Supported Platforms"); return; }
        if (tags.length === 0) { showValidationToast("Tags"); return; }

        // Listing Details
        if (!shortDesc.trim()) { showValidationToast("Short Description"); return; }
        if (!fullDesc.trim()) { showValidationToast("Full Description"); return; }
        if (!website.trim()) {
            showValidationToast("Official Website"); return;
        } else {
            const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
            if (!urlRegex.test(website)) { showValidationToast("Official Website (Invalid Format)"); return; }
        }
        if (!supportEmail.trim()) {
            showValidationToast("Support Email"); return;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(supportEmail)) { showValidationToast("Support Email (Invalid Format)"); return; }
        }
        if (!bannerUrl) { showValidationToast("Feature Graphics / Banner"); return; }
        if (!iconUrl) { showValidationToast("Application Logo"); return; }
        if (screenshots.filter(s => s).length < 3) { showValidationToast("Screenshots (Min 3)"); return; }

        if (!revTestCreds.trim()) { showValidationToast("Test Credentials"); setActiveSection('reviewer'); return; }
        if (!revFunctionality.trim()) { showValidationToast("App Functionality"); setActiveSection('reviewer'); return; }
        if (!revLimitations.trim()) { showValidationToast("Known Limitations"); setActiveSection('reviewer'); return; }
        if (!revGuidance.trim()) { showValidationToast("Review Guidance"); setActiveSection('reviewer'); return; }
        if (!revDeclaration) { showValidationToast("Review Declaration"); setActiveSection('reviewer'); return; }

        // Distribution
        if (pricing === 'paid' && (!price || isNaN(parseFloat(price)) || parseFloat(price) < 1)) { showValidationToast("Price (Min ₹1)"); return; }
        if (distributionMode === 'manual' && selectedRegions.length === 0) { showValidationToast("Distribution Regions"); return; }

        // Build
        if (!buildUploaded) { showValidationToast("App Bundle (Build)"); return; }

        setIsPublishing(true);

        try {
            // Validate Asset Dimensions & Size (Async)
            const checkImage = (url: string, w: number, h: number, name: string): Promise<void> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => {
                        if (img.width !== w || img.height !== h) reject(`${name} must be ${w}x${h}px.`);
                        else resolve();
                    };
                    img.onerror = () => {
                        // Fallback: If CORS blocks it, we might skip validation or warn. 
                        // Assuming standard S3 public-read or signed URLs usually work or fail. 
                        // For now, let's treat error as 'cannot verify' but maybe not block if it's just a load error?
                        // User asked for validation, so strict is better.
                        reject(`Failed to verify ${name} dimensions.`);
                    };
                    img.src = url;
                });
            };

            const checkVideoSize = async (url: string, items: string): Promise<void> => {
                try {
                    const res = await fetch(url, { method: 'HEAD' });
                    const size = res.headers.get('content-length');
                    if (size && parseInt(size) > 100 * 1024 * 1024) {
                        throw new Error(`${items} must be smaller than 100MB`);
                    }
                } catch (e: any) {
                    throw new Error(e.message || `Failed to verify ${items} size`);
                }
            };

            await checkImage(iconUrl, 512, 512, "App Logo");
            await checkImage(bannerUrl, 1920, 1080, "Feature Banner");

            // Check all uploaded screenshots
            const uploadedScreenshots = screenshots.filter(s => s);
            for (let i = 0; i < uploadedScreenshots.length; i++) {
                await checkImage(uploadedScreenshots[i], 1920, 1080, `Screenshot ${i + 1}`);
            }

            if (videoUrl) {
                await checkVideoSize(videoUrl, "Preview Video");
            }

            // Distribution
            if (pricing === 'paid' && (!price || isNaN(parseFloat(price)) || parseFloat(price) < 1)) { showValidationToast("Price (Min ₹1)"); setIsPublishing(false); return; }

            // Update existing app with all details and set status to review
            await updateApp(appId, {
                name: appName,
                version,
                category,
                customCategory,
                tags,
                platforms,
                shortDescription: shortDesc,
                fullDescription: fullDesc,
                website,
                supportEmail,
                pricingModel: pricing,
                price: parseFloat(price) || 0,
                distributionMode,
                distributionRegions: selectedRegions,
                reviewerInfo: {
                    testCredentials: revTestCreds,
                    functionality: revFunctionality,
                    limitations: revLimitations,
                    guidance: revGuidance,
                },
                reviewerDeclaration: revDeclaration,
                status: 'review'
            });

            toast({
                title: "Submitted for Review",
                description: "Your app is now in review.",
                variant: 'success'
            });
            router.push('/developers/console');
        } catch (e: any) {
            console.error(e);
            toast({
                title: "Validation Failed",
                description: e.message || typeof e === 'string' ? e : "An error occurred while publishing.",
                variant: "destructive"
            });
        } finally {
            setIsPublishing(false);
        }
    };

    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadFileName, setUploadFileName] = useState<string>("");
    const [uploadingAsset, setUploadingAsset] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'icon' | 'build' | 'video') => {
        if (!e.target.files || !e.target.files[0]) return;
        if (!appId) {
            showWarning("Please save the app first before uploading assets.");
            return;
        }
        const file = e.target.files[0];
        if (type !== 'build') setUploadingAsset(type);

        try {
            if (type === 'build') {
                if (!verifyKey) {
                    setVerificationStatus('error');
                    setVerificationError("App verification key not found. Please save the app first.");
                    return;
                }
                setVerificationStatus('analyzing');
                setVerificationError("");

                try {
                    const zip = new JSZip();
                    const zipContent = await zip.loadAsync(file);

                    setVerificationStatus('verifying');
                    await new Promise(r => setTimeout(r, 800));

                    const configFile = zipContent.file("loopsync.json");

                    if (!configFile) {
                        const files = Object.keys(zipContent.files);
                        const foundPath = files.find(f => f.endsWith("loopsync.json"));
                        if (foundPath) {
                            throw new Error(`loopsync.json found at '${foundPath}'. Please zip the contents of your folder, not the folder itself.`);
                        }
                        throw new Error("loopsync.json not found in the root of the zip file.");
                    }

                    const configContent = await configFile.async("string");
                    let config;
                    try {
                        config = JSON.parse(configContent);
                    } catch (e) {
                        throw new Error("Invalid loopsync.json format.");
                    }

                    if (config.app_id !== appId) {
                        throw new Error(`App ID mismatch. Expected ${appId}, found ${config.app_id}`);
                    }

                    if (config.verify_key !== verifyKey) {
                        throw new Error("Verify Key mismatch. Please update your loopsync.json with the correct key found in the console.");
                    }

                    setVerificationStatus('success');
                    await new Promise(r => setTimeout(r, 500));

                } catch (e: any) {
                    console.error("Verification failed", e);
                    setVerificationStatus('error');
                    setVerificationError(e.message || "Failed to verify build file");
                    return;
                }

                const { uploadUrl, assetUrl } = await getBuildUploadUrl(appId, file.name, file.size);

                // Use XMLHttpRequest for progress
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', uploadUrl, true);
                xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(percentComplete);
                    }
                };

                xhr.onload = async () => {
                    if (xhr.status === 200) {
                        setIsSaving(true);
                        setUploadProgress(100);
                        setUploadFileName(file.name);

                        // IMPORTANT: Save the build URL to the database
                        await updateApp(appId, { buildUrl: assetUrl, buildSize: file.size });

                        await verifyApp(appId, verifyKey);
                        setBuildUploaded(true);
                        setVerificationStatus('idle');
                        setUploadProgress(0); // Reset progress so onClick works again
                        setIsSaving(false);
                    } else {
                        console.error('Upload failed', xhr.statusText);
                        setVerificationStatus('error');
                        setVerificationError("Upload failed: " + xhr.statusText);
                        setUploadProgress(0);
                    }
                };

                xhr.onerror = () => {
                    console.error('Upload failed');
                    setVerificationStatus('error');
                    setVerificationError("Network Error: Upload failed");
                    setUploadProgress(0);
                };

                xhr.send(file);
            } else {
                // Asset Validation Logic
                if (type === 'video') {
                    if (file.size > 100 * 1024 * 1024) { // 100MB
                        showWarning("Video file size must be less than 100MB.");
                        return;
                    }
                } else if (type === 'icon' || type === 'banner') {
                    const isValid = await new Promise<boolean>((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            if (type === 'icon' && (img.width !== 512 || img.height !== 512)) {
                                showWarning("App Logo must be exactly 512x512 pixels.");
                                resolve(false);
                            } else if (type === 'banner' && (img.width !== 1920 || img.height !== 1080)) {
                                showWarning("Feature Banner must be exactly 1920x1080 pixels.");
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        };
                        img.onerror = () => resolve(false);
                        img.src = URL.createObjectURL(file);
                    });

                    if (!isValid) return;
                }

                const { uploadUrl, assetUrl } = await getAssetUploadUrl(appId, type === 'banner' ? 'banner' : (type === 'video' ? 'video' : 'icon'), file.type);
                await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

                if (type === 'banner') {
                    await updateAppAssets(appId, { bannerUrl: assetUrl });
                    setBannerUrl(assetUrl);
                } else if (type === 'video') {
                    await updateAppAssets(appId, { videoUrl: assetUrl });
                    setVideoUrl(assetUrl);
                } else {
                    await updateAppAssets(appId, { icons: { '512': assetUrl } });
                    setIconUrl(assetUrl);
                }
            }
        } catch (err: any) {
            console.error(err);
            if (type === 'build') {
                setVerificationStatus('error');
                setVerificationError(err.message || "Upload request failed");
            } else {
                showWarning("Upload request failed");
            }
            setUploadProgress(0);
        } finally {
            if (type !== 'build') setUploadingAsset(null);
        }
    };

    const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (!e.target.files || !e.target.files[0]) return;
        if (!appId) {
            showWarning("Please save the app first.");
            return;
        }
        const file = e.target.files[0];
        setUploadingAsset(`screenshot-${index}`);
        try {
            // Validate Screenshot Dimensions
            const isValid = await new Promise<boolean>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width !== 1920 || img.height !== 1080) {
                        showWarning("Screenshots must be exactly 1920x1080 pixels.");
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                };
                img.onerror = () => resolve(false);
                img.src = URL.createObjectURL(file);
            });

            if (!isValid) return;

            const { uploadUrl, assetUrl } = await getAssetUploadUrl(appId, 'screenshot', file.type);
            await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

            const newScreenshots = [...screenshots];
            newScreenshots[index] = assetUrl;
            setScreenshots(newScreenshots);

            // Filter empty strings to push clean array to DB
            const dbScreenshots = newScreenshots.filter(s => s);
            await updateAppAssets(appId, { screenshots: dbScreenshots });

        } catch (err: any) {
            console.error(err);
            showWarning("Screenshot upload failed");
        } finally {
            setUploadingAsset(null);
        }
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim()) && tags.length < 5) {
                setTags([...tags, tagInput.trim()]);
                setTagInput("");
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const togglePlatform = (p: string) => {
        setPlatforms(prev =>
            prev.includes(p) ? prev.filter(i => i !== p) : [...prev, p]
        );
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 flex flex-col">

            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 z-50 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/developers/console"
                        className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-[1px] bg-white/10 mx-2" />
                    <h1 className="text-sm font-semibold text-white tracking-tight">New Application Submission</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        {isSaving ? "Saving..." : "Save Draft"}
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing || !appId}
                        className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wide rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Rocket className="w-3.5 h-3.5" />
                        {isPublishing ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </header>

            <div className="flex pt-16 min-h-screen">

                {/* Sidebar Navigation */}
                <aside className="w-64 fixed left-0 top-16 bottom-0 border-r border-white/5 bg-[#050505] overflow-y-auto z-40">
                    <div className="p-6 space-y-8">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-4 px-2">
                                Technical
                            </div>
                            <nav className="space-y-1">
                                <NavItem
                                    active={activeSection === 'build'}
                                    onClick={() => setActiveSection('build')}
                                    icon={<FileCode className="w-4 h-4" />}
                                    label="Build & Verification"
                                />
                            </nav>
                        </div>

                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-4 px-2">
                                Configuration
                            </div>
                            <nav className="space-y-1">
                                <NavItem
                                    active={activeSection === 'general'}
                                    onClick={() => setActiveSection('general')}
                                    icon={<Settings className="w-4 h-4" />}
                                    label="General Info"
                                />
                                <NavItem
                                    active={activeSection === 'details'}
                                    onClick={() => setActiveSection('details')}
                                    icon={<Layout className="w-4 h-4" />}
                                    label="Listing Details"
                                />
                                <NavItem
                                    active={activeSection === 'presence'}
                                    onClick={() => setActiveSection('presence')}
                                    icon={<ImageIcon className="w-4 h-4" />}
                                    label="Store Presence"
                                />
                                <NavItem
                                    active={activeSection === 'distribution'}
                                    onClick={() => setActiveSection('distribution')}
                                    icon={<Globe2 className="w-4 h-4" />}
                                    label="Distribution"
                                />
                                <NavItem
                                    active={activeSection === 'reviewer'}
                                    onClick={() => setActiveSection('reviewer')}
                                    icon={<ShieldCheck className="w-4 h-4" />}
                                    label="Reviewer Info"
                                />
                            </nav>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 ml-64 p-8 md:p-12 w-full">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* SECTION: GENERAL */}
                        {activeSection === 'general' && (
                            <div className="space-y-8">
                                <SectionHeader
                                    title="General Information"
                                    description="Configure the core identity and categorization of your application."
                                />

                                <GlassCard>
                                    <div className="grid grid-cols-3 gap-12">
                                        <div className="col-span-2 space-y-8">
                                            <div className="space-y-3">
                                                <Label>Application Name</Label>
                                                <Input
                                                    value={appName}
                                                    onChange={(e) => {
                                                        setAppName(e.target.value);
                                                        validate('appName', e.target.value);
                                                    }}
                                                    placeholder="e.g. Orbit AI"
                                                    className={`font-medium ${errors.appName ? "border-red-500/50 focus:border-red-500" : ""}`}
                                                    maxLength={40}
                                                />
                                                {errors.appName && <p className="text-[10px] text-red-400 mt-1">{errors.appName}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <Label>Primary Category</Label>
                                                    <Select
                                                        value={category}
                                                        onChange={(val) => setCategory(val)}
                                                        options={[
                                                            { label: 'Productivity', value: 'productivity' },
                                                            { label: 'Developer Tools', value: 'dev-tools' },
                                                            { label: 'Social Networking', value: 'social' },
                                                            { label: 'Education', value: 'education' },
                                                            { label: 'Entertainment', value: 'entertainment' },
                                                            { label: 'Health & Fitness', value: 'health' },
                                                            { label: 'Finance', value: 'finance' },
                                                            { label: 'Photo & Video', value: 'photo-video' },
                                                            { label: 'Games', value: 'games' },
                                                            { label: 'Utilities', value: 'utilities' },
                                                            { label: 'Travel', value: 'travel' },
                                                            { label: 'Others', value: 'others' }
                                                        ]}
                                                    />
                                                    {category === 'others' && (
                                                        <div className="animate-in fade-in slide-in-from-top-1 pt-1">
                                                            <Input
                                                                value={customCategory}
                                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                                placeholder="Specify Category"
                                                                className="bg-white/[0.05] border-white/[0.1]"
                                                                autoFocus
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    <Label>Current Version</Label>
                                                    <Input
                                                        value={version}
                                                        onChange={(e) => setVersion(e.target.value)}
                                                        placeholder="e.g. 1.0.0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label>Supported Platforms</Label>
                                                <div className="flex gap-4">
                                                    {[
                                                        { id: 'web', icon: <Globe className="w-5 h-5" />, label: 'Web' },
                                                        { id: 'desktop', icon: <Monitor className="w-5 h-5" />, label: 'Desktop' },
                                                        { id: 'mobile', icon: <Smartphone className="w-5 h-5" />, label: 'Mobile' }
                                                    ].map(platform => (
                                                        <button
                                                            key={platform.id}
                                                            onClick={() => togglePlatform(platform.id)}
                                                            className={`flex items-center gap-3 px-5 py-3 border transition-all duration-300 ${platforms.includes(platform.id)
                                                                ? "bg-white text-black border-white shadow-lg shadow-white/10"
                                                                : "bg-white/[0.03] border-white/5 text-zinc-500 hover:bg-white/[0.05]"
                                                                }`}
                                                        >
                                                            {platform.icon}
                                                            <span className="text-xs font-bold uppercase tracking-wide">{platform.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label>Tags <span className="text-white ml-2 font-normal lowercase ">(Max 5)</span></Label>
                                                <div className="bg-white/[0.03] border border-white/[0.06] px-3 py-3 flex flex-wrap gap-2 focus-within:border-white/20 transition-colors min-h-[60px] items-center">
                                                    {tags.map(tag => (
                                                        <span key={tag} className="bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-2">
                                                            {tag}
                                                            <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                                        </span>
                                                    ))}
                                                    <input
                                                        type="text"
                                                        value={tagInput}
                                                        onChange={(e) => setTagInput(e.target.value)}
                                                        onKeyDown={addTag}
                                                        disabled={tags.length >= 5}
                                                        placeholder={tags.length >= 5 ? "Max tags reached" : (tags.length === 0 ? "Type and press enter..." : "")}
                                                        className={`bg-transparent text-sm text-white outline-none flex-1 min-w-[120px] px-2 py-1 placeholder:text-zinc-700 ${tags.length >= 5 ? "cursor-not-allowed opacity-50" : ""}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sidebar Tips */}
                                        <div className="col-span-1 border-l border-white/5 pl-8">
                                            <TipCard
                                                title="Optimization Tips"
                                                content="Choose a clear, memorable name. Tags help users find your app in search. Ensure your version number follows semantic versioning (Major.Minor.Patch)."
                                            />
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {/* SECTION: DETAILS */}
                        {activeSection === 'details' && (
                            <div className="space-y-8">
                                <SectionHeader
                                    title="Listing Details"
                                    description="Provide comprehensive information to help users understand your application."
                                />

                                <GlassCard>
                                    <div className="grid grid-cols-3 gap-12">
                                        <div className="col-span-2 space-y-8">
                                            <div className="space-y-3">
                                                <Label>Short Description</Label>
                                                <Input
                                                    value={shortDesc}
                                                    onChange={(e) => setShortDesc(e.target.value)}
                                                    placeholder="A brief elevator pitch (Max 120 chars)"
                                                    maxLength={120}
                                                />
                                                <div className="text-right text-[10px] text-zinc-600 font-medium">{shortDesc.length}/120</div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label>Full Description</Label>
                                                <textarea
                                                    value={fullDesc}
                                                    onChange={(e) => {
                                                        setFullDesc(e.target.value);
                                                        validate('fullDesc', e.target.value);
                                                    }}
                                                    className={`w-full h-72 bg-white/[0.03] border px-5 py-4 text-sm text-white placeholder:text-zinc-700 
                                                    focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-white/[0.02] transition-all duration-300 resize-none leading-relaxed ${errors.fullDesc ? "border-red-500/50 focus:border-red-500" : "border-white/[0.06] focus:border-white/20"}`}
                                                    placeholder="Use Markdown to describe features, benefits, and usage..."
                                                    maxLength={1058}
                                                />
                                                <div className="flex justify-end gap-2 mt-1">
                                                    {errors.fullDesc && <p className="text-[10px] text-red-400 flex-1">{errors.fullDesc}</p>}
                                                    <div className="text-[10px] text-zinc-600 font-medium">{fullDesc.length}/1058</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                                <div className="space-y-3">
                                                    <Label>Official Website</Label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-4 top-4 w-5 h-5 text-zinc-600" />
                                                        <Input
                                                            className={`pl-12 ${errors.website ? "border-red-500/50 focus:border-red-500" : ""}`}
                                                            value={website}
                                                            onChange={(e) => {
                                                                setWebsite(e.target.value);
                                                                validate('website', e.target.value);
                                                            }}
                                                            placeholder="https://..."
                                                        />
                                                        {errors.website && <p className="text-[10px] text-red-400 mt-1 absolute -bottom-5 left-0">{errors.website}</p>}
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label>Support Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-600" />
                                                        <Input
                                                            className={`pl-12 ${errors.supportEmail ? "border-red-500/50 focus:border-red-500" : ""}`}
                                                            value={supportEmail}
                                                            onChange={(e) => {
                                                                setSupportEmail(e.target.value);
                                                                validate('supportEmail', e.target.value);
                                                            }}
                                                            placeholder="support@example.com"
                                                        />
                                                        {errors.supportEmail && <p className="text-[10px] text-red-400 mt-1 absolute -bottom-5 left-0">{errors.supportEmail}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-1 space-y-6 border-l border-white/5 pl-8">
                                            <TipCard title="Markdown Support" content="You can use standard markdown covering headers, lists, and bold text." />

                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {/* SECTION: STORE PRESENCE */}
                        {activeSection === 'presence' && (
                            <div className="space-y-8">
                                <SectionHeader
                                    title="Store Presence"
                                    description="Manage the visual assets that represent your app in the marketplace."
                                />

                                <GlassCard>
                                    <div className="space-y-12">

                                        {/* 1. Feature Graphic / Banner (First) */}
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                                            {/* 1. App Logo */}
                                            <div className="space-y-4">
                                                <Label>App Logo</Label>
                                                <div
                                                    onClick={() => !uploadingAsset && iconRef.current?.click()}
                                                    style={iconUrl ? { backgroundImage: `url(${iconUrl})`, backgroundSize: 'cover' } : {}}
                                                    className={`aspect-square w-full max-w-[180px] bg-white/[0.02] border border-dashed border-white/5 flex flex-col items-center justify-center hover:bg-white/[0.05] hover:border-white/40 cursor-pointer transition-all duration-300 group relative overflow-hidden shadow-2xl shadow-black/20 ${uploadingAsset === 'icon' ? 'pointer-events-none' : ''}`}
                                                >
                                                    {uploadingAsset === 'icon' ? (
                                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                    ) : !iconUrl && (
                                                        <>
                                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                                <Upload className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                                                            </div>
                                                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">512x512 PX</span>
                                                            <span className="text-[9px] text-zinc-600 mt-1">PNG Only</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 2. Preview Video */}
                                            <div className="space-y-4">
                                                <Label>Preview Video</Label>
                                                <div
                                                    onClick={() => !uploadingAsset && videoRef.current?.click()}
                                                    className={`aspect-video w-full bg-white/[0.02] border border-dashed border-white/5 flex flex-col items-center justify-center hover:bg-white/[0.05] hover:border-white/40 cursor-pointer transition-all duration-300 group relative overflow-hidden ${uploadingAsset === 'video' ? 'pointer-events-none' : ''}`}
                                                >
                                                    {uploadingAsset === 'video' ? (
                                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                    ) : videoUrl ? (
                                                        <video src={videoUrl} className="w-full h-full object-cover" controls muted />
                                                    ) : (
                                                        <>
                                                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                                                                <Video className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                                                            </div>
                                                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Preview Video</span>
                                                            <span className="text-[9px] text-zinc-600 mt-1">Max 100MB</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 3. Feature Graphic / Banner */}
                                            <div className="space-y-4">
                                                <Label>Feature Banner</Label>
                                                <div
                                                    onClick={() => !uploadingAsset && bannerRef.current?.click()}
                                                    style={bannerUrl ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                                    className={`aspect-video w-full bg-white/[0.02] border border-dashed border-white/5 flex flex-col items-center justify-center hover:bg-white/[0.05] hover:border-white/40 cursor-pointer transition-all duration-300 group shadow-lg shadow-black/20 relative overflow-hidden ${uploadingAsset === 'banner' ? 'pointer-events-none' : ''}`}
                                                >
                                                    {uploadingAsset === 'banner' ? (
                                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                    ) : !bannerUrl && (
                                                        <>
                                                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                                                                <ImageIcon className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                                                            </div>
                                                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">1920x1080 PX</span>
                                                            <span className="text-[9px] text-zinc-600 mt-1">Feature Banner</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. Screenshots */}
                                        <div className="space-y-6 pt-8 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <Label>Screenshots</Label>
                                                    <p className="text-xs text-zinc-500 ml-1">Upload at least 3 screenshots (1920x1080px).</p>
                                                </div>
                                                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md">Max 6 Images</span>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Mandatory */}
                                                <div>
                                                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" /> REQUIRED
                                                    </h5>
                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {[0, 1, 2].map(i => (
                                                            <div
                                                                key={i}
                                                                onClick={() => !uploadingAsset && screenshotRefs.current[i]?.click()}
                                                                style={screenshots[i] ? { backgroundImage: `url(${screenshots[i]})`, backgroundSize: 'cover' } : {}}
                                                                className={`aspect-video  bg-white/[0.02] border border-dashed border-white/5 flex flex-col items-center justify-center hover:bg-white/[0.05] hover:border-white/40 cursor-pointer transition-all duration-300 group relative overflow-hidden ${uploadingAsset === `screenshot-${i}` ? 'pointer-events-none' : ''}`}
                                                            >
                                                                {uploadingAsset === `screenshot-${i}` ? (
                                                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                                ) : !screenshots[i] ? (
                                                                    <>
                                                                        <span className="absolute top-3 left-4 text-[10px] font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors">0{i + 1}</span>
                                                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                            <Plus className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <Upload className="w-6 h-6 text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Optional */}
                                                <div>
                                                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white" /> Optional
                                                    </h5>
                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {[3, 4, 5].map(i => (
                                                            <div
                                                                key={i}
                                                                onClick={() => !uploadingAsset && screenshotRefs.current[i]?.click()}
                                                                style={screenshots[i] ? { backgroundImage: `url(${screenshots[i]})`, backgroundSize: 'cover' } : {}}
                                                                className={`aspect-video bg-white/[0.02] border border-dashed border-white/5 flex flex-col items-center justify-center hover:bg-white/[0.05] hover:border-white/30 cursor-pointer transition-all duration-300 group relative overflow-hidden ${screenshots[i] ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${uploadingAsset === `screenshot-${i}` ? 'pointer-events-none' : ''}`}
                                                            >
                                                                {uploadingAsset === `screenshot-${i}` ? (
                                                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                                ) : !screenshots[i] ? (
                                                                    <>
                                                                        <span className="absolute top-3 left-4 text-[10px] font-mono text-zinc-800 group-hover:text-zinc-600 transition-colors">0{i + 1}</span>
                                                                        <div className="w-8 h-8 rounded-full bg-white/[0.02] flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                            <Plus className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <Upload className="w-6 h-6 text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {/* SECTION: DISTRIBUTION */}
                        {activeSection === 'distribution' && (
                            <div className="space-y-8">
                                <SectionHeader
                                    title="Distribution & Pricing"
                                    description="Set your monetization strategy and geographic availability."
                                />

                                <GlassCard>
                                    <div className="grid grid-cols-3 gap-12">
                                        <div className="col-span-2 space-y-8">
                                            <div className="space-y-4">
                                                <Label>Pricing Model</Label>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <PricingCard
                                                        active={pricing === 'free'}
                                                        onClick={() => setPricing('free')}
                                                        title="Free"
                                                        desc="Free to download"
                                                    />
                                                    <PricingCard
                                                        active={pricing === 'paid'}
                                                        onClick={() => setPricing('paid')}
                                                        title="Paid"
                                                        desc="One-time purchase"
                                                    />
                                                    <PricingCard
                                                        active={pricing === 'sub'}
                                                        onClick={() => setPricing('sub')}
                                                        title="Subscription"
                                                        desc="Recurring billing"
                                                    />
                                                </div>
                                            </div>

                                            {pricing === 'paid' && (
                                                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                                                    <Label>Price (INR)</Label>
                                                    <div className="relative max-w-xs mt-2">
                                                        <IndianRupee className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                                                        <Input
                                                            className="pl-12 text-lg font-medium tracking-wide"
                                                            placeholder="0.00"
                                                            value={price}
                                                            onChange={(e) => setPrice(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-6 pt-8 border-t border-white/5">
                                                <Label>Geographic Availability</Label>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Global Option */}
                                                    <button
                                                        onClick={() => setDistributionMode('global')}
                                                        className={`p-5 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group ${distributionMode === 'global'
                                                            ? 'bg-white/5 border-white/5 shadow-lg'
                                                            : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:bg-white/[0.04]'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className={`p-2 rounded-full ${distributionMode === 'global' ? 'bg-white text-black' : 'bg-white/5 text-zinc-400'}`}>
                                                                <Globe className="w-5 h-5" />
                                                            </div>
                                                            {distributionMode === 'global' && <Check className="w-5 h-5 text-white" />}
                                                        </div>
                                                        <div className={`font-semibold text-lg mb-1 tracking-tight ${distributionMode === 'global' ? 'text-white' : 'text-zinc-400'}`}>Global Distribution</div>
                                                        <div className={`text-xs ${distributionMode === 'global' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                                            Automatically available in all 140+ supported countries.
                                                        </div>
                                                    </button>

                                                    {/* Manual Option */}
                                                    <button
                                                        onClick={() => setDistributionMode('manual')}
                                                        className={`p-5 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group ${distributionMode === 'manual'
                                                            ? 'bg-white/[0.08] border-white/20 shadow-lg'
                                                            : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.04]'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className={`p-2 rounded-full ${distributionMode === 'manual' ? 'bg-white text-black' : 'bg-white/5 text-zinc-400'}`}>
                                                                <Layout className="w-5 h-5" />
                                                            </div>
                                                            {distributionMode === 'manual' && <Check className="w-5 h-5 text-white" />}
                                                        </div>
                                                        <div className={`font-semibold text-lg mb-1 tracking-tight ${distributionMode === 'manual' ? 'text-white' : 'text-zinc-400'}`}>Manual Selection</div>
                                                        <div className={`text-xs ${distributionMode === 'manual' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                                            Specific regions only.
                                                        </div>
                                                    </button>
                                                </div>

                                                {/* Manual Region Grid */}
                                                {distributionMode === 'manual' && (
                                                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-2">
                                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {regionsList.map(region => {
                                                                const isSelected = selectedRegions.includes(region);
                                                                return (
                                                                    <button
                                                                        key={region}
                                                                        onClick={() => toggleRegion(region)}
                                                                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all duration-200 ${isSelected
                                                                            ? 'bg-white/10 border-white/20 text-white'
                                                                            : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:bg-white/[0.04]'
                                                                            }`}
                                                                    >
                                                                        <span className="text-xs font-medium uppercase tracking-wide">{region}</span>
                                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        <p className="text-[10px] text-zinc-500 mt-3 ml-1 font-medium">* Users outside these regions will not see your application.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-1 border-l border-white/5 pl-8">
                                            <TipCard title="Platform Fee" content="Loopsync takes a standard 5% platform fee on all paid transactions. Payouts are processed monthly." />
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {/* SECTION: REVIEWER INFO */}
                        {activeSection === 'reviewer' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <SectionHeader
                                    title="App Review Information"
                                    description="Provide instructions and credentials to help the review team test your app effectively."
                                />

                                <GlassCard>
                                    <div className="space-y-8">

                                        {/* Test Access */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                                <div className="h-6 w-1 bg-gray-500 rounded-full"></div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Test Access</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2 col-span-2">
                                                    <Label>Test Credentials & Instructions</Label>
                                                    <div className="text-[10px] text-zinc-500 mb-8">
                                                        Provide username, password, OTP steps, or demo account details. Ensure these remain valid during review.
                                                    </div>
                                                    <textarea
                                                        value={revTestCreds}
                                                        onChange={(e) => setRevTestCreds(e.target.value)}
                                                        placeholder={`Email: test@example.com\nPassword: TestPass123\n\nLogin via Email. OTP is disabled for this account.`}
                                                        className="w-full h-32 bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-sm text-neutral-300 focus:outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700 font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* App Functionality */}
                                        <div className="space-y-4 pt-4">
                                            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                                <div className="h-6 w-1 bg-gray-500 rounded-full"></div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">App Functionality Overview</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Functionality Details</Label>
                                                    <div className="text-[10px] text-zinc-500 mb-8">
                                                        Describe the primary use case, key features, paid features, permissions, and sensitive data usage.
                                                    </div>
                                                    <textarea
                                                        value={revFunctionality}
                                                        onChange={(e) => setRevFunctionality(e.target.value)}
                                                        placeholder={`Primary Use Case: ...\nKey Features: ...\nPermissions: ...`}
                                                        className="w-full h-40 bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-sm text-neutral-300 focus:outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Limitations */}
                                        <div className="space-y-4 pt-4">
                                            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                                <div className="h-6 w-1 bg-gray-500 rounded-full"></div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Known Limitations</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Issues & Restrictions</Label>
                                                    <div className="text-[10px] text-zinc-500 mb-8">
                                                        List any known bugs, region restrictions, or beta features.
                                                    </div>
                                                    <textarea
                                                        value={revLimitations}
                                                        onChange={(e) => setRevLimitations(e.target.value)}
                                                        placeholder="e.g. The map feature only works in India currently."
                                                        className="w-full h-24 bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Guidance */}
                                        <div className="space-y-4 pt-4">
                                            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                                <div className="h-6 w-1 bg-gray-500 rounded-full"></div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Review Guidance</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Testing Instructions</Label>
                                                <div className="text-[10px] text-zinc-500 mb-8">
                                                    Best way to test, areas to focus on, and expected duration.
                                                </div>
                                                <textarea
                                                    value={revGuidance}
                                                    onChange={(e) => setRevGuidance(e.target.value)}
                                                    placeholder="Focus on the payment flow..."
                                                    className="w-full h-24 bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700"
                                                />
                                            </div>
                                        </div>

                                        {/* Final Declaration */}
                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-start gap-3 p-4 bg-transparent rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setRevDeclaration(!revDeclaration)}>
                                                <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${revDeclaration ? 'bg-white border-white text-black' : 'border-zinc-500 bg-transparent'}`}>
                                                    {revDeclaration && <Check className="w-3.5 h-3.5 font-bold" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-white">Declaration of Compliance</h4>
                                                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                                        I confirm that the submitted build matches the provided details and complies with all applicable technical and policy requirements.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {/* SECTION: BUILD */}
                        {activeSection === 'build' && (
                            <div className="space-y-8">
                                <SectionHeader
                                    title="Build & Verification"
                                    description="Upload your binary and verify ownership."
                                />

                                <div className="space-y-8">
                                    <GlassCard className="text-center group cursor-pointer hover:bg-white/[0.02] transition-colors border-dashed">
                                        <div className="py-8" onClick={() => {
                                            if ((verificationStatus !== 'analyzing' && verificationStatus !== 'verifying' && uploadProgress === 0) || buildUploaded) {
                                                buildRef.current?.click();
                                            }
                                        }}>
                                            {verificationStatus === 'analyzing' || verificationStatus === 'verifying' ? (
                                                <div className="flex flex-col items-center">
                                                    <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
                                                    <h3 className="text-xl font-medium text-white mb-2">
                                                        {verificationStatus === 'analyzing' ? 'Analyzing Package...' : 'Verifying Credentials...'}
                                                    </h3>
                                                    <p className="text-sm text-zinc-500 mb-8 font-light">Checking loopsync.json</p>
                                                </div>
                                            ) : uploadProgress > 0 && uploadProgress < 100 ? (
                                                <div className="flex flex-col items-center w-full max-w-sm mx-auto">
                                                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
                                                    <h3 className="text-xl font-medium text-white mb-2">Uploading Build...</h3>
                                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                                                        <div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }} />
                                                    </div>
                                                    <p className="text-xs text-zinc-500 mt-2 font-mono">{uploadProgress}%</p>
                                                </div>
                                            ) : verificationStatus === 'error' ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                                        <AlertCircle className="w-8 h-8 text-red-500" />
                                                    </div>
                                                    <h3 className="text-xl font-medium text-white mb-2">Verification Failed</h3>
                                                    <p className="text-sm text-red-400 mb-8 font-medium max-w-md mx-auto">{verificationError}</p>

                                                    {verificationError.includes("zip the contents") && (
                                                        <div className="mt-2 mb-8 p-6 bg-transparent rounded-3xl border border-white/5 text-left w-full max-w-md mx-auto">
                                                            <h4 className="text-xs font-bold text-white uppercase mb-4 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(59,130,246,0.5)]" /> Correct Structure
                                                            </h4>

                                                            <div className="grid grid-cols-2 gap-8">
                                                                {/* Wrong Way */}
                                                                <div className="space-y-3">
                                                                    <div className="text-[10px] uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5 bg-red-500/10 w-fit px-2 py-1 rounded-md">
                                                                        <X className="w-3 h-3" /> Wrong
                                                                    </div>
                                                                    <div className="font-mono text-xs text-zinc-500 flex flex-col gap-2 pl-2 border-l border-white/5 py-1">
                                                                        <div className="flex items-center gap-2 text-white/40"><Folder className="w-3.5 h-3.5 text-blue-400/50" /> my-app/</div>
                                                                        <div className="flex items-center gap-2 pl-4 text-white"><FileCode className="w-3.5 h-3.5 text-yellow-500" /> loopsync.json</div>
                                                                        <div className="flex items-center gap-2 pl-4 text-white/40"><FileCode className="w-3.5 h-3.5" /> game.exe</div>
                                                                    </div>
                                                                </div>

                                                                {/* Right Way */}
                                                                <div className="space-y-3">
                                                                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                                                                        <Check className="w-3 h-3" /> Correct
                                                                    </div>
                                                                    <div className="font-mono text-xs text-zinc-500 flex flex-col gap-2 pl-2 border-l border-white/5 py-1">

                                                                        <div className="flex items-center gap-2 text-white"><FileCode className="w-3.5 h-3.5 text-yellow-500" /> loopsync.json</div>
                                                                        <div className="flex items-center gap-2 text-white/40"><FileCode className="w-3.5 h-3.5" /> game.exe</div>
                                                                        <div className="flex items-center gap-2 text-white/40"><Folder className="w-3.5 h-3.5" /> assets/</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setVerificationStatus('idle');
                                                            buildRef.current?.click();
                                                        }}
                                                        className="px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-wide hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
                                                    >
                                                        Try Again
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className={`w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 ${buildUploaded ? 'bg-green-500/10 border-green-500/20' : ''}`}>
                                                        {buildUploaded ? <Check className="w-8 h-8 text-green-500" /> : <FileCode className="w-8 h-8 text-zinc-400 group-hover:text-white transition-colors" />}
                                                    </div>
                                                    <h3 className="text-xl font-medium text-white mb-2">{buildUploaded ? "App Bundle Uploaded" : "Upload App Bundle"}</h3>
                                                    <p className="text-sm text-zinc-500 mb-8 font-light">{buildUploaded ? "Your app is verified and ready to publish." : "Drag and drop your signed .zip file (Max 500MB)"}</p>
                                                    <button className="px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-wide hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10">
                                                        {buildUploaded ? "Upload New Version" : "Browse Files"}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="bg-gray-500/[0.02] border-gray-500/10">
                                        <div className="flex items-start gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-500/10 flex items-center justify-center shrink-0">
                                                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-medium text-white">Ownership Verification</h3>
                                                    <p className="text-sm text-white/60 mt-1 font-light">Include this <span className="text-white font-semibold">loopsync.json</span> file in the root of your project zip.</p>
                                                </div>
                                                <div className="relative group">
                                                    <pre className="p-6 rounded-2xl bg-[#050505] border border-gray-500/10 font-semibold text-[11px] text-white overflow-x-auto leading-relaxed shadow-inner whitespace-pre-wrap break-all">
                                                        {`{
  "app_id": "${appId || 'SAVE_APP_FIRST'}",
  "verify_key": "${verifyKey || 'LOADING...'}"
}`}
                                                    </pre>
                                                    <button
                                                        onClick={(e) => {
                                                            const pre = e.currentTarget.previousElementSibling;
                                                            if (pre) navigator.clipboard.writeText(pre.textContent || "");
                                                        }}
                                                        className="absolute top-3 right-3 p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>



            {/* New App Modal */}
            <Dialog
                open={isCreateModalOpen}
                onOpenChange={() => { }}
            >
                <DialogContent
                    showCloseButton={false}
                    className="bg-black/60 p-10 backdrop-blur-xl border border-white/10 text-white sm:max-w-md rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                >
                    {/* Header */}
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-2xl font-semibold tracking-tight text-white">
                            Create Application
                        </DialogTitle>
                        <p className="text-sm text-zinc-400 font-normal leading-relaxed">
                            Choose a name to start setting up your application.
                        </p>
                    </DialogHeader>

                    {/* Content */}
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-normal tracking-widest text-white/60">
                                Application Name
                            </Label>
                            <Input
                                autoFocus
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                placeholder="e.g. Orbit AI, Bob Space"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && appName.trim()) {
                                        handleCreateApp();
                                    }
                                }}
                                className="h-12 rounded-3xl mt-2 bg-white/5 border-white/5 focus:border-white/5 focus:ring-0 text-white placeholder:text-zinc-600 placeholder:font-normal font-bold"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="pt-2">
                        <button
                            disabled={!appName.trim() || isSaving}
                            onClick={handleCreateApp}
                            className="w-full h-12 rounded-3xl mt-2 bg-white text-black text-sm font-semibold tracking-wide hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSaving ? "Creating Application…" : "Continue"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Warning Modal */}
            <Dialog open={warningModalOpen} onOpenChange={setWarningModalOpen}>
                <DialogContent className="bg-[#0A0A0A] border border-white/10 text-white rounded-3xl w-full max-w-sm p-6 overflow-hidden">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Validation Warning
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-2">
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            {warningMessage}
                        </p>
                    </div>

                    <DialogFooter className="mt-6">
                        <button
                            onClick={() => setWarningModalOpen(false)}
                            className="w-full h-10 rounded-2xl bg-white text-black text-xs font-bold uppercase tracking-wide hover:bg-zinc-200 transition-colors"
                        >
                            Okay
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Hidden Inputs */}
            <input type="file" ref={bannerRef} className="hidden" accept="image/png,image/jpeg" onChange={(e) => handleFileUpload(e, 'banner')} />
            <input type="file" ref={iconRef} className="hidden" accept="image/png" onChange={(e) => handleFileUpload(e, 'icon')} />
            <input type="file" ref={videoRef} className="hidden" accept="video/mp4,video/webm" onChange={(e) => handleFileUpload(e, 'video')} />
            {[0, 1, 2, 3, 4, 5].map(i => (
                <input
                    key={`screenshot-${i}`}
                    type="file"
                    ref={el => { screenshotRefs.current[i] = el; }}
                    className="hidden"
                    accept="image/png,image/jpeg"
                    onChange={(e) => handleScreenshotUpload(e, i)}
                />
            ))}
            <input type="file" ref={buildRef} className="hidden" accept=".zip" onChange={(e) => handleFileUpload(e, 'build')} />
        </div>
    );
}

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-8  bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/5 relative ${className}`}>
        {children}
    </div>
);

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-all rounded-xl mx-2 first:mt-2
            ${active
                ? "bg-white text-black shadow-lg shadow-white/10"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
            }`}
    >
        <span className={active ? "text-black" : "text-zinc-600 group-hover:text-zinc-400"}>{icon}</span>
        {label}
    </button>
);

const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <label className={`text-[11px] font-bold uppercase text-white ml-1 mb-2 block ${className}`}>
        {children}
    </label>
);

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full bg-white/[0.03] border border-white/[0.06] px-5 py-4 text-sm text-white placeholder:text-zinc-700 
        focus:border-white/20 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-white/[0.02] transition-all duration-300 ${className}`}
    />
);

const Select = ({ value, onChange, options, className = "" }: { value: string, onChange: (val: string) => void, options: { label: string, value: string }[], className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div className="relative">
            {isOpen && <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-white/[0.03] border border-white/[0.06] px-5 py-4 text-sm text-white 
                focus:border-white/20 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-white/[0.02] transition-all duration-300 ${className}`}
            >
                <span className="truncate">{selectedLabel}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 p-1 bg-[#0A0A0A] border border-white/10 shadow-2xl backdrop-blur-xl z-[70] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-40 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${value === option.value
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {option.label}
                                {value === option.value && <Check className="w-4 h-4 text-white" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const SectionHeader = ({ title, description }: { title: string, description: string }) => (
    <div className="mb-8 px-2">
        <h2 className="text-3xl font-medium text-white tracking-tight mb-2">{title}</h2>
        <p className="text-base text-zinc-400 font-light tracking-wide">{description}</p>
    </div>
);

const TipCard = ({ title, content }: { title: string, content: string }) => (
    <div className="p-6 rounded-3xl bg-transparent border border-white/10 backdrop-blur-sm">
        <h4 className="text-xs font-bold text-white uppercase mb-3 flex items-center gap-2 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white box-shadow-glow" /> {title}
        </h4>
        <p className="text-xs text-white/70 leading-relaxed font-medium">
            {content}
        </p>
    </div>
);

const PricingCard = ({ active, onClick, title, desc }: { active: boolean, onClick: () => void, title: string, desc: string }) => (
    <button
        onClick={onClick}
        className={`p-6 rounded-[1.5rem] border text-left transition-all duration-300 group
            ${active
                ? "bg-white text-black border-white shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] scale-[1.02]"
                : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.04] hover:border-white/10"
            }`}
    >
        <div className="text-lg font-medium mb-1 tracking-tight">{title}</div>
        <div className={`text-xs ${active ? "text-zinc-600" : "text-zinc-600 group-hover:text-zinc-500"}`}>{desc}</div>
    </button>
);

export default function PublishAppPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
        }>
            <PublishAppContent />
        </Suspense>
    );
}
