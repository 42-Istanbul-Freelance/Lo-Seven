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

type ActivityType = {
    id: number;
    title: string;
    description: string;
    hours: number;
    mediaUrl: string | null;
    status: string;
    createdAt: string;
};

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [gamification, setGamification] = useState<GamificationProfile | null>(null);
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!session?.accessToken) return;
        try {
            const [gamRes, actRes] = await Promise.all([
                fetch(`${getApiUrl()}/api/v1/gamification/profile`, {
                    headers: { "Authorization": `Bearer ${session.accessToken}` },
                }),
                fetch(`${getApiUrl()}/api/v1/activities/my`, {
                    headers: { "Authorization": `Bearer ${session.accessToken}` },
                }),
            ]);
            if (gamRes.ok) setGamification(await gamRes.json());
            if (actRes.ok) setActivities(await actRes.json());
        } catch (err) {
            console.error("Failed to fetch profile data:", err);
        } finally {
            setLoading(false);
        }
    }, [session?.accessToken]);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (session?.accessToken) fetchData();
    }, [session?.accessToken, fetchData]);

    if (status === "loading" || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!session) return null;

    const user = session.user;
    const totalHours = gamification?.totalHours ?? 0;
    const level = gamification?.level ?? 1;
    const badges = gamification?.earnedBadges ?? [];
    const completedActivities = activities.filter(a => a.status === "APPROVED").length;
    const pendingActivities = activities.filter(a => a.status === "PENDING").length;

    const defaultBadgeEmojis = ["🏗️", "🏆", "🎖️", "⭐", "🔥"];

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 pb-20">
            <main className="w-full max-w-6xl mx-auto p-4 md:p-8 flex gap-8">

                {/* Left Icon Sidebar */}
                <aside className="w-16 shrink-0 flex flex-col items-center py-6 gap-8 text-zinc-400 pt-16">
                    <Link href="/dashboard" className="p-2 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                    </Link>
                    <Link href="/explore" className="p-2 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </Link>
                    <Link href="/gamified" className="p-2 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                    </Link>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex gap-8">

                    {/* Left Panel: Profile Info */}
                    <div className="flex-1 bg-white rounded-[32px] shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-zinc-50 overflow-hidden p-8 md:p-12">

                        {/* Avatar and Name */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-3xl font-bold text-red-500 mb-4 ring-4 ring-red-100/50">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <h1 className="text-2xl font-bold text-zinc-900">{user?.name || "User"}</h1>
                            <p className="text-sm text-zinc-400 mt-1">{user?.email}</p>
                            <div className="bg-red-50 text-red-600 font-bold text-xs px-4 py-1 rounded-full mt-3">
                                Seviye {level}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            <div className="bg-zinc-50 rounded-2xl p-5 text-center">
                                <p className="text-2xl font-bold text-zinc-900">{completedActivities}</p>
                                <p className="text-[11px] text-zinc-500 font-semibold mt-1">Tamamlanan</p>
                            </div>
                            <div className="bg-zinc-50 rounded-2xl p-5 text-center">
                                <p className="text-2xl font-bold text-zinc-900">{totalHours}</p>
                                <p className="text-[11px] text-zinc-500 font-semibold mt-1">Saat</p>
                            </div>
                            <div className="bg-zinc-50 rounded-2xl p-5 text-center">
                                <p className="text-2xl font-bold text-zinc-900">{pendingActivities}</p>
                                <p className="text-[11px] text-zinc-500 font-semibold mt-1">Bekleyen</p>
                            </div>
                        </div>

                        {/* Badges */}
                        <h3 className="text-lg font-bold text-zinc-900 mb-4">Rozetlerim</h3>
                        <div className="flex flex-wrap gap-4 mb-10">
                            {badges.length > 0 ? badges.map((badge, i) => (
                                <div key={badge.id} className="flex flex-col items-center gap-2 cursor-pointer group" title={badge.description}>
                                    <div className="w-16 h-16 rounded-full bg-white shadow-md border border-zinc-50 flex items-center justify-center text-2xl group-hover:-translate-y-1 transition-transform">
                                        {badge.iconUrl ? (
                                            <img src={badge.iconUrl} alt={badge.name} className="w-10 h-10 object-contain" />
                                        ) : (
                                            defaultBadgeEmojis[i % defaultBadgeEmojis.length]
                                        )}
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{badge.name}</span>
                                </div>
                            )) : (
                                <p className="text-sm text-zinc-400">Henüz rozetin yok ama gönüllü oldukça kazanacaksın!</p>
                            )}
                        </div>

                        {/* Recent Activities */}
                        <h3 className="text-lg font-bold text-zinc-900 mb-4">Son Etkinlikler</h3>
                        <div className="space-y-3">
                            {activities.slice(0, 5).map((act) => (
                                <div key={act.id} className="flex items-center gap-4 bg-zinc-50 rounded-xl px-5 py-4">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${act.status === "APPROVED" ? "bg-green-400" : act.status === "PENDING" ? "bg-yellow-400" : "bg-red-400"}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-800 truncate">{act.title}</p>
                                        <p className="text-[11px] text-zinc-400">{act.hours}s · {act.status === 'APPROVED' ? 'ONAYLANDI' : act.status === 'PENDING' ? 'BEKLEMEDE' : 'REDDEDİLDİ'}</p>
                                    </div>
                                    <span className="text-[10px] text-zinc-400">
                                        {new Date(act.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                                    </span>
                                </div>
                            ))}
                            {activities.length === 0 && (
                                <p className="text-sm text-zinc-400">Henüz etkinlik yok</p>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Quick Actions */}
                    <div className="w-72 shrink-0 space-y-6">
                        {/* Volunteer Opportunities */}
                        <div className="bg-white rounded-[24px] shadow-sm border border-zinc-50 p-6">
                            <h3 className="text-base font-bold text-zinc-900 mb-4">Hızlı İşlemler</h3>
                            <div className="space-y-3">
                                <Link href="/dashboard/activities/new" className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-3 rounded-xl text-center transition-colors shadow-sm">
                                    + Yeni Etkinlik Ekle
                                </Link>
                                <Link href="/community" className="block w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-sm py-3 rounded-xl text-center transition-colors">
                                    Topluluk Akışını Gör
                                </Link>
                                <Link href="/gamified" className="block w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-sm py-3 rounded-xl text-center transition-colors">
                                    Kazanımlar ve Rozetler
                                </Link>
                            </div>
                        </div>

                        {/* Connections Placeholder */}
                        <div className="bg-white rounded-[24px] shadow-sm border border-zinc-50 p-6">
                            <h3 className="text-base font-bold text-zinc-900 mb-4">Topluluk Köşesi</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">Senin gibi gönüllü olan gençlerle etkileşime geçmek için <Link href="/community" className="text-red-500 font-bold hover:underline">Topluluk</Link> bölümünü ziyaret edebilirsin.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
