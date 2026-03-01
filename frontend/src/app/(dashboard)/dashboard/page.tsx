"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

type ActivityType = {
    id: number;
    title: string;
    description: string;
    hours: number;
    mediaUrl: string | null;
    status: string;
    createdAt: string;
};

type GamificationProfile = {
    level: number;
    currentPoints: number;
    pointsForNextLevel: number;
    totalHours: number;
    earnedBadges: { id: number; name: string; description: string; iconUrl: string | null }[];
};

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [gamification, setGamification] = useState<GamificationProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!session?.accessToken) return;
        try {
            const [actRes, gamRes] = await Promise.all([
                fetch(`${getApiUrl()}/api/v1/activities/my`, {
                    headers: { "Authorization": `Bearer ${session.accessToken}` },
                }),
                fetch(`${getApiUrl()}/api/v1/gamification/profile`, {
                    headers: { "Authorization": `Bearer ${session.accessToken}` },
                }),
            ]);
            if (actRes.ok) setActivities(await actRes.json());
            if (gamRes.ok) setGamification(await gamRes.json());
        } catch (err) {
            console.error("Dashboard fetch error:", err);
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

    // Role redirects
    if (session.user?.role === "PRINCIPAL" || session.user?.role === "HQ") {
        router.push("/dashboard/hq");
        return null;
    }

    const totalHours = gamification?.totalHours ?? 0;
    const badgeCount = gamification?.earnedBadges?.length ?? 0;
    const approvedCount = activities.filter(a => a.status === "APPROVED").length;
    const recentActivities = activities.slice(0, 3);

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 pb-20 overflow-x-hidden">
            <main className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-10">

                {/* Hero Section */}
                <div className="bg-[#ffe4e6] rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden">
                    <div className="relative z-10 space-y-2 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">İyi günler, {session.user?.name?.split(" ")[0] || "Gönüllü"}!</h1>
                        <p className="text-sm font-medium text-zinc-700">
                            {totalHours > 0 ? `${totalHours} saat gönüllülük yapıldı · ${badgeCount} rozet kazanıldı` : "Fark yaratmaya hazır mısın?"}
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 md:p-5 flex items-center justify-between gap-6 relative z-10 w-full md:w-auto mt-6 md:mt-0 shadow-sm border border-white/50">
                        <div className="pr-4 md:pr-10">
                            <h2 className="text-sm font-bold text-zinc-900 mb-0.5">Gönüllülük saatlerini takip et</h2>
                            <p className="text-[11px] font-medium text-zinc-500">Etkinken hikayelerini paylaş</p>
                        </div>
                        <Link href="/dashboard/activities/new" className="bg-[#f04949] text-white text-xs font-bold px-8 py-2.5 rounded-xl hover:bg-red-600 transition-colors shadow-sm uppercase tracking-wide">
                            Paylaş
                        </Link>
                    </div>
                </div>

                {/* Today's Highlights */}
                <section>
                    <h2 className="text-lg font-bold text-zinc-900 mb-4 px-1">Öne Çıkan Fırsatlar</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                        <Link href="/explore" className="min-w-[300px] h-[180px] rounded-2xl bg-red-500 relative overflow-hidden flex flex-col justify-end p-6 shrink-0 snap-start shadow-sm cursor-pointer group">
                            <div className="absolute inset-0 bg-gradient-to-t from-red-700/90 to-transparent z-10"></div>
                            <img src="https://images.unsplash.com/photo-1593113565694-c700e5fff0b5?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay group-hover:scale-105 transition-transform duration-700" alt="" />
                            <div className="relative z-20 text-white">
                                <h3 className="font-bold text-base mb-1">Gönüllülük etkinliğine katıl</h3>
                                <p className="text-xs text-white/80 font-medium">Yaklaşan fırsatları gör</p>
                            </div>
                        </Link>

                        <Link href="/gamified" className="min-w-[220px] h-[180px] rounded-2xl bg-[#ea3535] relative overflow-hidden flex flex-col justify-center items-center text-center p-6 shrink-0 snap-start shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
                            <h3 className="font-bold text-base text-white mb-1.5">Kazanılan Rozetler</h3>
                            <p className="text-[11px] text-red-200 font-medium bg-red-900/20 px-3 py-1 rounded-full">{badgeCount} Rozet</p>
                        </Link>

                        <Link href="/community" className="min-w-[260px] h-[180px] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden flex flex-col justify-end p-6 shrink-0 snap-start shadow-sm hover:scale-[1.02] cursor-pointer transition-transform group">
                            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-700" alt="" />
                            <div className="absolute top-5 right-5 bg-white shadow-sm w-9 h-9 rounded-full flex items-center justify-center text-lg z-20">👋</div>
                            <h3 className="font-bold text-base text-white relative z-20 pr-8">Sosyal Akış</h3>
                        </Link>

                        <Link href="/profile" className="min-w-[240px] h-[180px] rounded-2xl bg-red-400 relative overflow-hidden flex flex-col justify-center items-center p-6 shrink-0 snap-start shadow-sm hover:scale-[1.02] cursor-pointer transition-transform group">
                            <img src="https://images.unsplash.com/photo-1560252829-804f1aedf1be?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-700" alt="" />
                            <h3 className="font-bold text-base text-white relative z-10 text-center">Profilim</h3>
                        </Link>
                    </div>
                </section>

                {/* Activities */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-bold text-zinc-900">Etkinlikler</h2>
                        <span className="text-xs font-semibold text-zinc-400">{approvedCount} onaylandı</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">

                        <Link href="/dashboard/activities/new" className="min-w-[260px] h-[160px] rounded-2xl bg-[#ea4949] relative overflow-hidden flex flex-col justify-end p-6 shrink-0 snap-start shadow-sm cursor-pointer group hover:scale-[1.02] transition-transform">
                            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:opacity-50 transition-opacity" alt="" />
                            <h3 className="font-bold text-base text-white relative z-10 w-4/5 leading-tight">+ Yeni Etkinlik Ekle</h3>
                        </Link>

                        <Link href="/community" className="min-w-[200px] h-[160px] rounded-2xl bg-[#b91c1c] flex flex-col justify-center items-center p-6 shrink-0 snap-start shadow-[0_4px_20px_-5px_rgba(185,28,28,0.4)] cursor-pointer hover:-translate-y-1 transition-transform">
                            <h3 className="font-bold text-base text-white text-center">Diğer Gönüllüleri Gör</h3>
                        </Link>

                        <Link href="/gamified" className="min-w-[220px] h-[160px] rounded-2xl bg-[#ef4444] relative overflow-hidden flex flex-col justify-end p-6 shrink-0 snap-start shadow-sm cursor-pointer hover:-translate-y-1 transition-transform group">
                            <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-50 group-hover:scale-105 transition-transform duration-700" alt="" />
                            <h3 className="font-bold text-base text-white relative z-10">Gelişimim</h3>
                        </Link>

                        <Link href="/explore" className="min-w-[180px] h-[160px] rounded-2xl bg-[#ff6b6b] flex flex-col justify-center items-center p-6 shrink-0 snap-start shadow-sm cursor-pointer hover:-translate-y-1 transition-transform">
                            <h3 className="font-bold text-base text-white text-center">Hedefleri Keşfet</h3>
                        </Link>

                        <Link href="/onboarding" className="min-w-[140px] h-[160px] rounded-2xl bg-[#fff0f2] flex flex-col justify-center items-center p-5 shrink-0 snap-start shadow-sm cursor-pointer hover:bg-red-50 transition-colors border border-red-100/50">
                            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white font-bold mb-4 shadow-[0_4px_12px_-2px_rgba(239,68,68,0.5)]">✨</div>
                            <h3 className="font-bold text-xs text-red-600 text-center tracking-wide uppercase">Hedef Belirle</h3>
                        </Link>
                    </div>
                </section>

                {/* Recent Activity Feed */}
                {recentActivities.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-4 px-1">Son Etkinlikleri</h2>
                        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden divide-y divide-zinc-50">
                            {recentActivities.map((act) => (
                                <div key={act.id} className="flex items-center gap-4 px-6 py-4">
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${act.status === "APPROVED" ? "bg-green-400" : act.status === "PENDING" ? "bg-yellow-400" : "bg-red-400"}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-800 truncate">{act.title}</p>
                                        <p className="text-[11px] text-zinc-400">{act.hours}s · {act.status === 'APPROVED' ? 'ONAYLANDI' : act.status === 'PENDING' ? 'BEKLEMEDE' : 'RETDEDİLDİ'}</p>
                                    </div>
                                    <span className="text-[10px] text-zinc-400 shrink-0">
                                        {new Date(act.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
}
