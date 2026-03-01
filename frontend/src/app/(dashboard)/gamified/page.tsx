"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

type BadgeType = {
    id: number;
    name: string;
    description: string;
    iconUrl: string | null;
    earnedAt: string;
};

type GamificationProfile = {
    level: number;
    currentPoints: number;
    pointsForNextLevel: number;
    totalHours: number;
    earnedBadges: BadgeType[];
};

export default function GamifiedDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<GamificationProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/gamification/profile`, {
                headers: { "Authorization": `Bearer ${session.accessToken}` },
            });
            if (res.ok) {
                setProfile(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch gamification profile:", err);
        } finally {
            setLoading(false);
        }
    }, [session?.accessToken]);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (session?.accessToken) fetchProfile();
    }, [session?.accessToken, fetchProfile]);

    if (status === "loading" || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!session) return null;

    const totalHours = profile?.totalHours ?? 0;
    const level = profile?.level ?? 1;
    const currentPoints = profile?.currentPoints ?? 0;
    const pointsForNext = profile?.pointsForNextLevel ?? 100;
    const badges = profile?.earnedBadges ?? [];
    const progressPercent = pointsForNext > 0 ? Math.min((currentPoints / pointsForNext) * 100, 100) : 0;

    // Gauge needle rotation: map totalHours (0 → 500+) to degrees (-90 → 90)
    const maxHours = 500;
    const needleAngle = -90 + Math.min(totalHours / maxHours, 1) * 180;

    const defaultBadgeIcons = [
        "🏗️", "🏆", "🎖️", "⭐", "🔥"
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 pb-20">
            <main className="w-full max-w-5xl mx-auto p-4 md:p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <p className="text-sm font-semibold text-zinc-500">Oyunlaştırılmış Pano</p>
                    <Link href="/settings" className="flex flex-col items-center gap-1 group">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-50 transition-colors">
                            <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ayarlar</span>
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="w-full bg-white rounded-[32px] shadow-sm border border-zinc-100 overflow-hidden min-h-[700px] flex flex-col">

                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-50">
                        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.4H4.8L12 5.8z" /></svg>
                            </div>
                            <span className="font-bold text-zinc-900 tracking-tight">PearlConnect</span>
                        </Link>
                        <Link href="/profile" className="bg-red-500 text-white font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm">
                            Profil
                        </Link>
                    </div>

                    {/* Central Gauge Display */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8">

                        {/* Level Badge */}
                        <div className="bg-red-50 text-red-600 font-bold text-xs px-4 py-1.5 rounded-full mb-6">
                            Level {level}
                        </div>

                        {/* Circular Gauge */}
                        <div className="relative w-64 h-64 mb-6">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                                {/* Background circle */}
                                <circle cx="100" cy="100" r="85" fill="none" stroke="#f0f0f0" strokeWidth="18" />
                                {/* Colored arc segments */}
                                <circle cx="100" cy="100" r="85" fill="none" stroke="#60a5fa" strokeWidth="18"
                                    strokeDasharray={`${85 * 2 * Math.PI * 0.25} ${85 * 2 * Math.PI * 0.75}`}
                                    strokeDashoffset={85 * 2 * Math.PI * 0.25}
                                    transform="rotate(-90 100 100)" />
                                <circle cx="100" cy="100" r="85" fill="none" stroke="#34d399" strokeWidth="18"
                                    strokeDasharray={`${85 * 2 * Math.PI * 0.25} ${85 * 2 * Math.PI * 0.75}`}
                                    strokeDashoffset={0}
                                    transform="rotate(0 100 100)" />
                                <circle cx="100" cy="100" r="85" fill="none" stroke="#fbbf24" strokeWidth="18"
                                    strokeDasharray={`${85 * 2 * Math.PI * 0.25} ${85 * 2 * Math.PI * 0.75}`}
                                    strokeDashoffset={-85 * 2 * Math.PI * 0.25}
                                    transform="rotate(90 100 100)" />
                                <circle cx="100" cy="100" r="85" fill="none" stroke="#f87171" strokeWidth="18"
                                    strokeDasharray={`${85 * 2 * Math.PI * 0.25} ${85 * 2 * Math.PI * 0.75}`}
                                    strokeDashoffset={-85 * 2 * Math.PI * 0.5}
                                    transform="rotate(180 100 100)" />
                                {/* Inner white circle */}
                                <circle cx="100" cy="100" r="68" fill="white" />
                                {/* Needle */}
                                <line x1="100" y1="100" x2="100" y2="45" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
                                    transform={`rotate(${needleAngle} 100 100)`} />
                                {/* Center dot */}
                                <circle cx="100" cy="100" r="6" fill="#27272a" />
                            </svg>
                        </div>

                        <h2 className="text-xl font-medium text-zinc-800 mb-2 tracking-wide">
                            Gönüllü Saati: <span className="font-bold text-zinc-900">{totalHours}</span>
                        </h2>

                        {/* XP Progress Bar */}
                        <div className="w-full max-w-xs mb-10">
                            <div className="flex justify-between text-[11px] text-zinc-400 font-semibold mb-1.5">
                                <span>{currentPoints} XP</span>
                                <span>{pointsForNext} XP</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>

                        {/* Badges Row */}
                        <div className="flex items-center gap-6 mb-10 flex-wrap justify-center">
                            {badges.length > 0 ? badges.map((badge, i) => (
                                <div key={badge.id} className="flex flex-col items-center gap-2 group cursor-pointer" title={badge.description}>
                                    <div className="w-20 h-20 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-zinc-50 flex items-center justify-center text-3xl hover:-translate-y-1 transition-transform">
                                        {badge.iconUrl ? (
                                            <img src={badge.iconUrl} alt={badge.name} className="w-12 h-12 object-contain" />
                                        ) : (
                                            defaultBadgeIcons[i % defaultBadgeIcons.length]
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{badge.name}</span>
                                </div>
                            )) : (
                                <p className="text-sm text-zinc-400">Henüz rozet kazanılmamış. Gönüllü olmaya devam et!</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 w-full max-w-[220px]">
                            <Link href="/dashboard/activities/new" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-3.5 rounded-xl transition-colors shadow-sm text-center">
                                Yeni Hedef Ekle
                            </Link>
                            <Link href="/explore" className="w-full bg-zinc-200 hover:bg-zinc-300 text-zinc-600 font-bold text-sm py-3.5 rounded-xl transition-colors text-center">
                                Görevleri Keşfet
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
