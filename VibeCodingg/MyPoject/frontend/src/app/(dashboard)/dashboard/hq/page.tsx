"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

interface SchoolStats {
    schoolId: number;
    schoolName: string;
    studentCount: number;
    totalApprovedHours: number;
    totalPoints: number;
}

interface HqStats {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalSchools: number;
    totalActivities: number;
    approvedActivities: number;
    pendingActivities: number;
    totalPosts: number;
    schoolLeaderboard: SchoolStats[];
}

export default function HqDashboardPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<HqStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!session?.accessToken) return;
            try {
                const res = await fetch(`${getApiUrl()}/api/v1/reports/stats`, {
                    headers: { "Authorization": `Bearer ${session.accessToken}` }
                });
                if (res.ok) {
                    setStats(await res.json());
                } else {
                    console.error("HQ Stats API error:", res.status);
                    setError(`API Hatası: ${res.status}`);
                }
            } catch (e) {
                console.error("HQ Stats fetch error:", e);
                setError("Bağlantı hatası");
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchStats();
        } else if (status === "unauthenticated") {
            setIsLoading(false);
            setError("Giriş yapmanız gerekiyor.");
        }
    }, [session, status]);

    if (isLoading || status === "loading") {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="font-mono text-zinc-500">İstatistikler yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
                <p className="font-mono text-red-400">Hata: {error}</p>
                <Link href="/dashboard" className="font-mono text-sm text-zinc-400 hover:text-white underline">← Dashboard&apos;a Dön</Link>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
                <p className="font-mono text-zinc-500">Veri bulunamadı.</p>
                <Link href="/dashboard" className="font-mono text-sm text-zinc-400 hover:text-white underline">← Dashboard&apos;a Dön</Link>
            </div>
        );
    }

    const statCards = [
        { label: "Toplam Kullanıcı", value: stats.totalUsers, color: "text-indigo-400", bg: "bg-indigo-400/10 border-indigo-400/20" },
        { label: "Öğrenci", value: stats.totalStudents, color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20" },
        { label: "Öğretmen", value: stats.totalTeachers, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
        { label: "Okul Sayısı", value: stats.totalSchools, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
        { label: "Toplam Aktivite", value: stats.totalActivities, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
        { label: "Onaylanan", value: stats.approvedActivities, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
        { label: "Bekleyen", value: stats.pendingActivities, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
        { label: "Paylaşım", value: stats.totalPosts, color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20" },
    ];

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold font-mono text-white">[Genel_Merkez_Raporu]</h1>
                        <p className="font-mono text-sm text-zinc-500 mt-1">Tüm okulların özet istatistikleri</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 px-4 py-2 rounded-md font-mono text-sm transition-colors border border-zinc-700"
                    >
                        ← Dashboard
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <div key={card.label} className={`border rounded-lg p-5 ${card.bg}`}>
                            <p className="font-mono text-xs text-zinc-500 mb-1">{card.label}</p>
                            <p className={`text-3xl font-bold font-mono ${card.color}`}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* School Leaderboard */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <h2 className="text-lg font-mono text-white mb-6">[Okul_Sıralaması]</h2>
                    {stats.schoolLeaderboard.length === 0 ? (
                        <p className="font-mono text-sm text-zinc-500 text-center py-6">Henüz okul kaydı yok.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full font-mono text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-800 text-zinc-500">
                                        <th className="text-left py-3 px-4">#</th>
                                        <th className="text-left py-3 px-4">Okul</th>
                                        <th className="text-right py-3 px-4">Öğrenci</th>
                                        <th className="text-right py-3 px-4">Onaylı Saat</th>
                                        <th className="text-right py-3 px-4">Toplam XP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.schoolLeaderboard.map((school, index) => (
                                        <tr key={school.schoolId} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                            <td className="py-3 px-4 text-zinc-500">
                                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                                            </td>
                                            <td className="py-3 px-4 text-zinc-200 font-bold">{school.schoolName}</td>
                                            <td className="py-3 px-4 text-right text-cyan-400">{school.studentCount}</td>
                                            <td className="py-3 px-4 text-right text-green-400">{school.totalApprovedHours}h</td>
                                            <td className="py-3 px-4 text-right text-indigo-400 font-bold">{school.totalPoints} XP</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
