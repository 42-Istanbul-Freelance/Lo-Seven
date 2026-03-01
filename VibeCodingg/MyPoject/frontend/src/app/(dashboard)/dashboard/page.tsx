"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

interface Activity {
    id: number;
    title: string;
    description: string;
    hours: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    approverName?: string;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [gamification, setGamification] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (session?.accessToken) {
                try {
                    // Fetch Activities
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

    if (status === "loading" || (status === "authenticated" && isLoading)) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="font-mono text-zinc-500">Yükleniyor...</p>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const handleApprove = async (id: number) => {
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/activities/${id}/approve`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session.accessToken}`
                }
            });
            if (res.ok) {
                setActivities(activities.filter(a => a.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleReject = async (id: number) => {
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/activities/${id}/reject`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session.accessToken}`
                }
            });
            if (res.ok) {
                setActivities(activities.filter(a => a.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "text-green-400 bg-green-400/10 ring-green-400/30";
            case "REJECTED": return "text-red-400 bg-red-400/10 ring-red-400/30";
            default: return "text-yellow-400 bg-yellow-400/10 ring-yellow-400/30";
        }
    };

    const isStudent = session.user?.role === "STUDENT";

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-mono text-white">Dashboard</h1>
                        <p className="font-mono text-sm text-zinc-400 mt-2">
                            Hoş geldin, <span className="text-indigo-400">{session.user?.name}</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/dashboard/feed"
                            className="bg-indigo-900/40 text-indigo-400 hover:bg-indigo-900/60 px-4 py-2 rounded-md font-mono text-sm transition-colors border border-indigo-900/50"
                        >
                            Sosyal Akış
                        </Link>
                        {(session.user?.role === "PRINCIPAL" || session.user?.role === "HQ") && (
                            <Link
                                href="/dashboard/hq"
                                className="bg-amber-900/40 text-amber-400 hover:bg-amber-900/60 px-4 py-2 rounded-md font-mono text-sm transition-colors border border-amber-900/50"
                            >
                                Genel Merkez
                            </Link>
                        )}
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="bg-red-900/20 text-red-400 hover:bg-red-900/40 px-4 py-2 rounded-md font-mono text-sm transition-colors border border-red-900/50"
                        >
                            Çıkış Yap
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6 flex flex-col h-fit">
                        {/* Profile Widget */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                            <h2 className="text-lg font-mono text-white mb-4">[Profil_Bilgileri]</h2>
                            <div className="space-y-3 font-mono text-sm">
                                <div className="flex justify-between border-b border-zinc-800 pb-2">
                                    <span className="text-zinc-500">Email:</span>
                                    <span className="text-zinc-300 truncate ml-2" title={session.user?.email || ""}>{session.user?.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800 pb-2">
                                    <span className="text-zinc-500">Yetki Rolü:</span>
                                    <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
                                        {session.user?.role || "BİLİNMİYOR"}
                                    </span>
                                </div>
                                <div className="flex justify-between pb-2">
                                    <span className="text-zinc-500">Kullanıcı ID:</span>
                                    <span className="text-zinc-300">{session.user?.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Gamification Widget */}
                        {gamification && (
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                                <h2 className="text-lg font-mono text-white mb-4">[Oyunlaştırma]</h2>

                                <div className="mb-6">
                                    <div className="flex justify-between items-end mb-2 font-mono">
                                        <span className="text-2xl font-bold text-indigo-400">Seviye {gamification.level}</span>
                                        <span className="text-xs text-zinc-500">{gamification.currentPoints} / {gamification.pointsForNextLevel} XP</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(100, Math.max(0, (gamification.currentPoints / gamification.pointsForNextLevel) * 100))}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-mono text-sm text-zinc-500 mb-3 border-b border-zinc-800 pb-2">Kazanılan Rozetler</h3>
                                    {gamification.earnedBadges && gamification.earnedBadges.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            {gamification.earnedBadges.map((badge: any) => (
                                                <div key={badge.id} className="flex flex-col items-center p-2 bg-zinc-950/50 border border-zinc-800 rounded-lg group relative" title={badge.description}>
                                                    <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{badge.iconUrl}</span>
                                                    <span className="font-mono text-[10px] text-zinc-400 text-center leading-tight">{badge.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center font-mono text-xs text-zinc-600 py-4 border border-zinc-800 border-dashed rounded bg-zinc-950/30">
                                            Henüz bir rozet kazanmadın. Aktiviteler ekleyerek başlayabilirsin!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-mono text-white">
                                {isStudent ? "[Aktif_Aktivitelerim]" : "[Onay_Bekleyen_Aktiviteler]"}
                            </h2>
                            {isStudent && (
                                <Link
                                    href="/dashboard/activities/new"
                                    className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors font-mono"
                                >
                                    + YENİ EKLE
                                </Link>
                            )}
                        </div>

                        {activities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-zinc-800 rounded-lg">
                                <p className="font-mono text-sm text-zinc-500">
                                    {isStudent ? "Henüz bir aktivite eklemediniz." : "Onay bekleyen aktivite yok."}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="border border-zinc-800 p-4 rounded-md bg-zinc-950/50 flex flex-col sm:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-white font-mono font-bold text-lg">{activity.title}</h3>
                                                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-medium ring-1 ring-inset ${getStatusColor(activity.status)}`}>
                                                    {activity.status}
                                                </span>
                                                <span className="text-zinc-400 font-mono text-xs px-2 py-0.5 bg-zinc-800 rounded">
                                                    {activity.hours} Saat
                                                </span>
                                            </div>
                                            <p className="text-zinc-400 text-sm font-mono mt-1 mb-2 line-clamp-2">
                                                {activity.description}
                                            </p>
                                            <p className="text-zinc-600 text-xs font-mono">
                                                Tarih: {new Date(activity.createdAt).toLocaleDateString("tr-TR")}
                                                {activity.approverName && ` • Onaylayan: ${activity.approverName}`}
                                            </p>
                                        </div>

                                        {!isStudent && activity.status === "PENDING" && (
                                            <div className="flex flex-row sm:flex-col gap-2 justify-center shrink-0">
                                                <button
                                                    onClick={() => handleApprove(activity.id)}
                                                    className="bg-green-900/40 text-green-400 hover:bg-green-900/60 px-3 py-1.5 rounded text-xs font-bold font-mono transition-colors border border-green-900/50"
                                                >
                                                    ONAYLA
                                                </button>
                                                <button
                                                    onClick={() => handleReject(activity.id)}
                                                    className="bg-red-900/40 text-red-400 hover:bg-red-900/60 px-3 py-1.5 rounded text-xs font-bold font-mono transition-colors border border-red-900/50"
                                                >
                                                    REDDET
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
