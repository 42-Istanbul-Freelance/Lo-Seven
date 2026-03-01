"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";

interface Activity {
    id: number;
    title: string;
    description: string;
    hours: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    approverName?: string;
    mediaUrl?: string;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [gamification, setGamification] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quickPostContent, setQuickPostContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    // Feature states
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [quickPostMediaUrl, setQuickPostMediaUrl] = useState("");
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [likedActivities, setLikedActivities] = useState<Record<number, boolean>>({});
    const [commentingOn, setCommentingOn] = useState<number | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (session?.accessToken) {
                try {
                    const activitiesEndpoint = session.user?.role === "STUDENT"
                        ? "/api/v1/activities/my"
                        : "/api/v1/activities/pending";

                    const [activitiesRes, gamificationRes] = await Promise.all([
                        fetch(`${getApiUrl()}${activitiesEndpoint}`, {
                            headers: { "Authorization": `Bearer ${session.accessToken}` }
                        }),
                        fetch(`${getApiUrl()}/api/v1/gamification/profile`, {
                            headers: { "Authorization": `Bearer ${session.accessToken}` }
                        })
                    ]);

                    if (activitiesRes.ok) {
                        setActivities(await activitiesRes.json());
                    }
                    if (gamificationRes.ok) {
                        setGamification(await gamificationRes.json());
                    }
                } catch (error) {
                    console.error("Failed to load dashboard data", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (status === "authenticated") {
            fetchData();
        }
    }, [session, status]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingMedia(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);

            const res = await fetch(`${getApiUrl()}/api/v1/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session?.accessToken}` },
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                setQuickPostMediaUrl(data.url);
            } else {
                try {
                    const data = await res.json();
                    alert(`Görsel Yüklenemedi: ${data.error || 'Bilinmeyen Hata'}`);
                } catch {
                    alert("Görsel yüklenemedi.");
                }
            }
        } catch (err) {
            alert(`Bağlantı hatası: ${err}`);
        } finally {
            setIsUploadingMedia(false);
        }
    };

    const toggleLike = (id: number) => {
        setLikedActivities(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleQuickPost = async () => {
        if ((!quickPostContent.trim() && !quickPostMediaUrl) || !session?.accessToken) return;

        setIsPosting(true);
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/activities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({
                    title: "Sosyal Etki Güncellemesi",
                    description: quickPostContent,
                    hours: 1, // Defaulting to 1 hour or a new category
                    mediaUrl: quickPostMediaUrl || null,
                }),
            });

            if (res.ok) {
                setQuickPostContent("");
                setQuickPostMediaUrl("");
                // Reload activities to show the new post
                const activitiesRes = await fetch(`${getApiUrl()}/api/v1/activities/my`, {
                    headers: { "Authorization": `Bearer ${session.accessToken}` }
                });
                if (activitiesRes.ok) {
                    setActivities(await activitiesRes.json());
                }
            } else {
                alert("Gönderi paylaşılamadı. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            console.error("Quick post failed", error);
            alert("Bağlantı hatası.");
        } finally {
            setIsPosting(false);
        }
    };

    if (status === "loading" || (status === "authenticated" && isLoading)) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    // Role redirects
    if (session.user?.role === "PRINCIPAL" || session.user?.role === "HQ") {
        router.push("/dashboard/hq");
        return null;
    }

    const currentPoints = gamification?.currentPoints || 0;
    const pointsForNextLevel = gamification?.pointsForNextLevel || 100;
    const progressPercent = Math.min(100, Math.max(0, (currentPoints / pointsForNextLevel) * 100));

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-zinc-800">

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-20 border-r border-zinc-200 bg-white sticky top-0 h-screen py-8 items-center justify-between z-10 shrink-0">
                <div className="flex flex-col gap-8">
                    <Link href="/dashboard" className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </Link>
                    <Link href="/dashboard/activities/new" className="p-3 text-red-500 bg-red-50 rounded-xl transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </Link>
                    <Link href="/dashboard/settings" className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </Link>
                </div>
                <div>
                    <Link href="/dashboard/settings" className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-zinc-500 hover:ring-2 hover:ring-red-500 transition-all overflow-hidden">
                        {session.user?.image ? (
                            <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            session.user?.name?.charAt(0)
                        )}
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full bg-white border-b border-zinc-200 px-4 py-3 z-20 flex justify-between items-center">
                <Link href="/">
                    <Image
                        src="/logo.svg"
                        alt="LoSeven Logo"
                        width={100}
                        height={30}
                        className="object-contain h-6 w-auto"
                        priority
                    />
                </Link>
                <Link href="/dashboard/activities/new" className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm">
                    Yeni Etki
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-10 pt-20 md:pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Your Impact & Social Feed */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Header text */}
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Senin Etkin</h1>
                        <p className="text-sm text-zinc-500 mt-1">Gönüllülük çalışmaların ve sosyal akışın</p>
                    </div>

                    {/* Impact Overview Card (Minimalist) */}
                    <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-2xl shadow-inner text-zinc-400 overflow-hidden border-2 border-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)]">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        "👤"
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-zinc-900">{session.user?.name}</h2>
                                    <p className="text-sm text-zinc-500">Gönüllü - Seviye {gamification?.level || 1}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Toplam Saat</span>
                                <p className="text-2xl font-bold text-red-500">{gamification?.currentPoints || 0}<span className="text-sm text-zinc-400">s</span></p>
                            </div>
                        </div>

                        {/* Minimalist Progress Bar */}
                        <div>
                            <div className="flex justify-between text-xs text-zinc-500 font-medium mb-2">
                                <span>İlerleme</span>
                                <span>{progressPercent.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-zinc-100 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Tweet-like Quick Post Form */}
                    <div className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center text-zinc-500 font-bold">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    session.user?.name?.charAt(0)
                                )}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    className="w-full resize-none border-none focus:ring-0 p-2 text-zinc-900 placeholder:text-zinc-400 text-lg bg-transparent"
                                    placeholder="Bugün hangi sosyal etkiyi yarattın?"
                                    rows={2}
                                    value={quickPostContent}
                                    onChange={(e) => setQuickPostContent(e.target.value)}
                                    disabled={isPosting}
                                />
                                <div className="flex justify-between items-center mt-2 pt-3 border-t border-zinc-50">
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploadingMedia}
                                            className={`hover:bg-red-50 p-2 rounded-full transition-colors ${quickPostMediaUrl ? 'text-green-500' : 'text-red-500'} ${isUploadingMedia ? 'opacity-50' : ''}`}
                                            title="Görsel Ekle"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                        <Link href="/dashboard/activities/new" className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center gap-1">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span className="text-xs font-semibold px-1">Detaylı Ekle</span>
                                        </Link>
                                    </div>
                                    <button
                                        onClick={handleQuickPost}
                                        disabled={!quickPostContent.trim() || isPosting}
                                        className="bg-red-500 text-white font-bold py-1.5 px-5 rounded-full hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50">
                                        {isPosting ? "Paylaşılıyor..." : "Paylaş"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Feed - Instagram/Twitter Style */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-zinc-900">Güncel Aktiviteler</h3>

                        {activities.length === 0 ? (
                            <div className="bg-white rounded-2xl p-10 text-center border border-zinc-100">
                                <p className="text-zinc-500">Henüz aktivite bulunmuyor. Ekleyerek ilham ol!</p>
                            </div>
                        ) : (
                            activities.map((activity) => (
                                <article key={activity.id} className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                                    {/* Author & Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center font-bold text-sm text-zinc-500">
                                                {session.user?.image ? (
                                                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    session.user?.name?.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-zinc-900">{session.user?.name}</p>
                                                <p className="text-[11px] text-zinc-400">{new Date(activity.createdAt).toLocaleDateString("tr-TR")}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-md">
                                            {activity.hours}s
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-4">
                                        <h4 className="font-bold text-base text-zinc-800 mb-1">{activity.title}</h4>
                                        <p className="text-sm text-zinc-600 leading-relaxed">{activity.description}</p>
                                    </div>

                                    {/* Conditional Image */}
                                    {activity.mediaUrl && activity.mediaUrl !== "null" && activity.mediaUrl.trim() !== "" && (
                                        <div className="w-full bg-zinc-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-zinc-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={activity.mediaUrl} alt="Aktivite Görseli" className="w-full h-auto max-h-96 object-contain" />
                                        </div>
                                    )}

                                    {/* Actions (Twitter/IG Style) */}
                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-50">
                                        <div className="flex gap-6">
                                            <button
                                                onClick={() => toggleLike(activity.id)}
                                                className={`flex items-center gap-1.5 transition-colors group ${likedActivities[activity.id] ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'}`}>
                                                <svg className={`w-5 h-5 group-hover:scale-110 transition-transform ${likedActivities[activity.id] ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                <span className="text-xs font-medium">{likedActivities[activity.id] ? 'Beğenildi' : 'Beğen'}</span>
                                            </button>
                                            <button
                                                onClick={() => setCommentingOn(commentingOn === activity.id ? null : activity.id)}
                                                className={`flex items-center gap-1.5 transition-colors group ${commentingOn === activity.id ? 'text-blue-500' : 'text-zinc-500 hover:text-blue-500'}`}>
                                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                <span className="text-xs font-medium">Yorum Yap</span>
                                            </button>
                                        </div>
                                        <div>
                                            {activity.status === 'PENDING' && <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">Bekliyor</span>}
                                            {activity.status === 'APPROVED' && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Onaylandı</span>}
                                            {activity.status === 'REJECTED' && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Reddedildi</span>}
                                        </div>
                                    </div>

                                    {/* Inline Comment Field */}
                                    {commentingOn === activity.id && (
                                        <div className="mt-4 pt-4 border-t border-zinc-50 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="w-8 h-8 rounded-full bg-zinc-200 shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-zinc-500">
                                                {session.user?.image ? (
                                                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    session.user?.name?.charAt(0)
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Harika bir etkinlik!"
                                                className="flex-1 text-sm bg-zinc-50 border border-zinc-200 rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                            <button
                                                className="text-sm font-bold text-blue-500 px-3 py-1 hover:bg-blue-50 rounded-full transition-colors"
                                                onClick={() => { alert('Yorum özelliği başarıyla tetiklendi!'); setCommentingOn(null); }}
                                            >
                                                Gönder
                                            </button>
                                        </div>
                                    )}
                                </article>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Badges & Suggestions */}
                <div className="space-y-6">
                    {/* Add Activity Button (Desktop) */}
                    <div className="hidden lg:block bg-red-500 text-white rounded-2xl p-6 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] text-center cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/dashboard/activities/new')}>
                        <span className="text-sm font-bold block mb-1">Aktivite Ekle</span>
                        <p className="text-xs text-red-100">Yeni bir gönüllülük görevini kaydet</p>
                    </div>

                    {/* Minimalist Badges Card */}
                    <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                        <h3 className="font-bold text-sm text-zinc-900 mb-4">Rozetlerim</h3>

                        {gamification?.earnedBadges && gamification.earnedBadges.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {gamification.earnedBadges.map((badge: any) => (
                                    <div key={badge.id} className="bg-[#fafafa] border border-zinc-100 rounded-xl p-3 flex flex-col items-center justify-center aspect-square">
                                        <span className="text-3xl mb-2 grayscale hover:grayscale-0 transition-all">{badge.iconUrl}</span>
                                        <span className="text-[10px] font-semibold text-zinc-600 text-center leading-tight truncate w-full">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <span className="text-2xl mb-2 block grayscale opacity-40">🏆</span>
                                <p className="text-xs text-zinc-400">Henüz rozet kazanılmadı.</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
